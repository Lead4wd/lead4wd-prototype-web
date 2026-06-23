// GA4 aggregate for the in-app analytics sections. The service-account key lives
// ONLY in server env — the browser never sees it. Degrades to {configured:false}
// when GA isn't set up yet, so the UI shows a "not connected" note.
//
// Required env (server-only): GA_PROPERTY_ID, GA_CLIENT_EMAIL, GA_PRIVATE_KEY.
import { NextResponse, type NextRequest } from "next/server";
import { createSign } from "node:crypto";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const NOT_CONFIGURED = NextResponse.json({ configured: false });

function b64url(input: Buffer | string): string {
  return Buffer.from(input).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

// Mint a Google OAuth access token from the service account (RS256 JWT grant).
async function getAccessToken(clientEmail: string, privateKey: string): Promise<string | null> {
  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claim = b64url(
    JSON.stringify({
      iss: clientEmail,
      scope: "https://www.googleapis.com/auth/analytics.readonly",
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600,
    })
  );
  const signer = createSign("RSA-SHA256");
  signer.update(`${header}.${claim}`);
  const signature = b64url(signer.sign(privateKey));
  const assertion = `${header}.${claim}.${signature}`;

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  });
  if (!res.ok) return null;
  const json = (await res.json()) as { access_token?: string };
  return json.access_token ?? null;
}

type ReportRow = { dimensionValues?: { value: string }[]; metricValues?: { value: string }[] };

async function runReport(token: string, propertyId: string, body: unknown): Promise<ReportRow[]> {
  const res = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );
  if (!res.ok) return [];
  const json = (await res.json()) as { rows?: ReportRow[] };
  return json.rows ?? [];
}

export async function GET(request: NextRequest) {
  // Must be signed in; admin scope additionally requires the admin flag.
  const sb = await createSupabaseServerClient();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const scope = request.nextUrl.searchParams.get("scope") === "admin" ? "admin" : "user";
  if (scope === "admin") {
    const { data: prof } = await sb.from("profiles").select("is_admin").eq("id", user.id).maybeSingle();
    if (!prof?.is_admin) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const propertyId = process.env.GA_PROPERTY_ID;
  const clientEmail = process.env.GA_CLIENT_EMAIL;
  const privateKey = process.env.GA_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!propertyId || !clientEmail || !privateKey) return NOT_CONFIGURED;

  try {
    const token = await getAccessToken(clientEmail, privateKey);
    if (!token) return NOT_CONFIGURED;

    const [daily, events] = await Promise.all([
      runReport(token, propertyId, {
        dateRanges: [{ startDate: "28daysAgo", endDate: "today" }],
        dimensions: [{ name: "date" }],
        metrics: [
          { name: "activeUsers" },
          { name: "newUsers" },
          { name: "sessions" },
          { name: "averageSessionDuration" },
        ],
        orderBys: [{ dimension: { dimensionName: "date" } }],
      }),
      runReport(token, propertyId, {
        dateRanges: [{ startDate: "28daysAgo", endDate: "today" }],
        dimensions: [{ name: "eventName" }],
        metrics: [{ name: "eventCount" }],
        orderBys: [{ metric: { metricName: "eventCount" }, desc: true }],
        limit: 8,
      }),
    ]);

    let activeUsers = 0;
    let newUsers = 0;
    let sessions = 0;
    let durWeighted = 0;
    const dailyOut = daily.map((r) => {
      const date = r.dimensionValues?.[0]?.value ?? "";
      const au = Number(r.metricValues?.[0]?.value ?? 0);
      newUsers += Number(r.metricValues?.[1]?.value ?? 0);
      sessions += Number(r.metricValues?.[2]?.value ?? 0);
      durWeighted += Number(r.metricValues?.[3]?.value ?? 0) * au;
      activeUsers = Math.max(activeUsers, au);
      // YYYYMMDD -> YYYY-MM-DD for the shared chart
      const iso = date.length === 8 ? `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}` : date;
      return { date: iso, activeUsers: au };
    });
    const totalAu = dailyOut.reduce((a, d) => a + d.activeUsers, 0);

    return NextResponse.json({
      configured: true,
      range: "28d",
      activeUsers: totalAu,
      newUsers,
      sessions,
      avgEngagementSec: totalAu > 0 ? Math.round(durWeighted / totalAu) : 0,
      topEvents: events.map((r) => ({
        name: r.dimensionValues?.[0]?.value ?? "",
        count: Number(r.metricValues?.[0]?.value ?? 0),
      })),
      daily: dailyOut,
    });
  } catch {
    return NOT_CONFIGURED;
  }
}
