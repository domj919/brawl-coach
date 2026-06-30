import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

const SITE_URL = "https://brawl-advisor.vercel.app";

export const metadata: Metadata = {
  title: {
    default: "Brawl Advisor — Brawl Stars Ranked Draft Helper",
    template: "%s | Brawl Advisor",
  },
  description:
    "Not sure what to pick in Brawl Stars ranked? Brawl Advisor recommends the best brawlers for your map, counters enemy picks, and is personalised to your roster.",
  keywords: [
    "Brawl Stars ranked", "what to pick in ranked brawl stars",
    "brawl stars draft helper", "brawl stars tier list", "brawl stars counter pick",
    "best brawler ranked", "brawl stars map tier list", "brawl stars ranked guide 2026",
  ],
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: "Brawl Advisor — Brawl Stars Ranked Draft Helper",
    description: "Real-time ranked draft tool — picks counters, tracks bans, balances your team composition.",
    url: SITE_URL,
    siteName: "Brawl Advisor",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Brawl Advisor — Brawl Stars Ranked Draft Helper",
    description: "Real-time ranked draft tool — picks counters, tracks bans, balances your team composition.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-gray-950 text-gray-100 font-sans">
        <header className="border-b border-gray-800 bg-gray-900">
          <nav className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-6">
            <Link href="/" className="text-yellow-400 font-bold text-lg tracking-tight">
              ⚡ Brawl Advisor
            </Link>
            <Link href="/roster" className="text-gray-300 hover:text-white text-sm transition-colors">
              My Roster
            </Link>
            <Link href="/draft" className="text-gray-300 hover:text-white text-sm transition-colors">
              Draft
            </Link>
          </nav>
        </header>
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
