import type { Metadata } from "next";
import {
  Bricolage_Grotesque,
  Hanken_Grotesk,
  Space_Mono,
  Noto_Sans_Devanagari,
  Noto_Sans_Telugu,
} from "next/font/google";
import "./globals.css";
import GoogleAnalytics from "@/components/GoogleAnalytics";

// ── Display / headings ────────────────────────────────────────────────────
// Variable font; load the same weight range as the mockup's Google Fonts URL:
// family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,600;12..96,700;12..96,800
const display = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--ff-display",
  display: "swap",
});

// ── Body / UI ─────────────────────────────────────────────────────────────
// Hanken Grotesk; include weight 450 which the lesson body uses (font-weight:450)
const body = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--ff-body",
  display: "swap",
});

// ── Monospace accents ─────────────────────────────────────────────────────
const mono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--ff-mono",
  display: "swap",
});

// ── Script fallbacks for Hindi / Telugu ───────────────────────────────────
const devanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  weight: ["400", "500", "700"],
  variable: "--ff-deva",
  display: "swap",
});

const telugu = Noto_Sans_Telugu({
  subsets: ["telugu"],
  weight: ["400", "500", "700"],
  variable: "--ff-telugu",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lead4wd — Manager coaching app",
  description:
    "A coach in your pocket for first-time managers: a personalised skills check, bite-sized lessons, and an anonymous team pulse.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // IMPORTANT: Apply the font variable classes to <html> (= :root), NOT <body>.
  // globals.css uses `--display: var(--ff-display)` etc. inside :root {}.
  // CSS custom properties cannot inherit *up* from descendants, so if the
  // classes are on <body>, :root can't see --ff-display and the fonts silently
  // fall through to the system sans-serif. Putting them on <html> makes the
  // variables available at :root level and throughout the whole document.
  return (
    <html
      lang="en"
      data-theme="evergreen"
      className={`${display.variable} ${body.variable} ${mono.variable} ${devanagari.variable} ${telugu.variable}`}
    >
      <body>
        {children}
        <GoogleAnalytics />
      </body>
    </html>
  );
}
