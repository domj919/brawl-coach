import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
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
        <header className="border-b border-blue-900/60 relative overflow-hidden" style={{background: "linear-gradient(180deg, #0d1f3e 0%, #081428 100%)"}}>
          <div className="absolute inset-0" style={{backgroundImage: "radial-gradient(ellipse 80% 100% at 50% 0%, rgba(30,90,200,0.2) 0%, transparent 70%)"}} />
          <nav className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-5 relative">
            <Link href="/" className="flex items-center gap-2 shrink-0">
              {/* Brawl Stars logo from Brawlify CDN */}
              <Image
                src="https://cdn.brawlify.com/assets/png/logo.png"
                alt="Brawl Stars"
                width={28}
                height={28}
                className="object-contain"
                unoptimized
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
              <span className="font-extrabold text-lg tracking-tight" style={{background: "linear-gradient(90deg, #FFD700, #FFA500)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"}}>
                Brawl Advisor
              </span>
            </Link>
            <Link href="/draft" className="text-blue-200 hover:text-yellow-400 text-sm font-medium transition-colors">
              Draft
            </Link>
            <Link href="/roster" className="text-blue-200 hover:text-yellow-400 text-sm font-medium transition-colors">
              Roster
            </Link>
            <Link href="/account" className="ml-auto text-blue-200 hover:text-yellow-400 text-sm font-medium transition-colors">
              Account
            </Link>
          </nav>
        </header>
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
