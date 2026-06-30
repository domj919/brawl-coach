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
        <header className="border-b border-gray-700 relative overflow-hidden" style={{background: "linear-gradient(135deg, #1a0a3e 0%, #0e0820 60%, #0a1228 100%)"}}>
          <div className="absolute inset-0 opacity-30" style={{backgroundImage: "radial-gradient(ellipse 60% 100% at 0% 50%, rgba(168,85,247,0.3) 0%, transparent 70%)"}} />
          <nav className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-6 relative">
            <Link href="/" className="font-extrabold text-lg tracking-tight" style={{background: "linear-gradient(90deg, #fbbf24, #f97316)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"}}>
              ⚡ Brawl Advisor
            </Link>
            <Link href="/draft" className="text-gray-300 hover:text-yellow-400 text-sm font-medium transition-colors">
              Draft
            </Link>
            <Link href="/roster" className="text-gray-300 hover:text-yellow-400 text-sm font-medium transition-colors">
              Roster
            </Link>
            <Link href="/account" className="ml-auto text-gray-300 hover:text-yellow-400 text-sm font-medium transition-colors">
              Account
            </Link>
          </nav>
        </header>
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
