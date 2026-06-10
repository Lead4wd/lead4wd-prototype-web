import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

// Supabase is the only external origin the app talks to.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://*.supabase.co";
const supabaseWs = supabaseUrl.replace(/^https/, "wss");

// Next.js injects inline bootstrap scripts (hence 'unsafe-inline'); Turbopack
// dev additionally needs eval + a local websocket for HMR.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  `connect-src 'self' ${supabaseUrl} ${supabaseWs}${isDev ? " ws://localhost:* ws://127.0.0.1:*" : ""}`,
  "worker-src 'self' blob:",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

const nextConfig: NextConfig = {
  // Pin the workspace root to this project. A stray lockfile in the parent
  // directory (~/package-lock.json) otherwise makes Next infer the wrong root.
  turbopack: {
    root: __dirname,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
        ],
      },
    ];
  },
};

export default nextConfig;
