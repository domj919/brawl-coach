import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center">
      {/* Hero */}
      <div className="mb-4 inline-block px-4 py-1 rounded-full text-xs font-semibold border border-purple-500/40 text-purple-300 bg-purple-500/10">
        Season 51 meta · Updated June 2026
      </div>
      <h1 className="text-5xl sm:text-6xl font-extrabold mb-4 leading-tight"
        style={{background: "linear-gradient(135deg, #fbbf24 0%, #f97316 50%, #a855f7 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"}}>
        Brawl Advisor
      </h1>
      <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">
        Win more ranked matches. Get real-time brawler recommendations based on
        your map, the meta, your roster, and what the enemy drafts.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/draft"
          className="font-bold px-8 py-3 rounded-xl transition-all hover:scale-105"
          style={{background: "linear-gradient(135deg, #fbbf24, #f97316)", color: "#06030f"}}>
          Open Draft Advisor
        </Link>
        <Link href="/account"
          className="bg-gray-800 text-white font-bold px-8 py-3 rounded-xl hover:bg-gray-700 transition-colors border border-gray-700">
          Set up my account
        </Link>
      </div>

      {/* Feature cards */}
      <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
        {[
          { icon: "🗺️", title: "Map-aware", desc: "Tier lists and counters tuned per map and mode — not just a global ranking." },
          { icon: "⚔️", title: "Counter picks", desc: "See who hard-counters the enemy's picks and who they counter back." },
          { icon: "🎒", title: "Your roster", desc: "Only recommends brawlers you own, with upgrade warnings and readiness scores." },
          { icon: "🚫", title: "Ban tracking", desc: "Log bans to remove them from recommendations instantly." },
          { icon: "🛡️", title: "Team balance", desc: "Warns you when your draft is missing a healer, tank or sniper." },
          { icon: "📊", title: "Personal stats", desc: "Track your win rate per brawler over time." },
        ].map(({ icon, title, desc }) => (
          <div key={title} className="bg-gray-900 rounded-2xl p-5 border border-gray-700 hover:border-purple-500/50 transition-colors">
            <div className="text-3xl mb-2">{icon}</div>
            <h3 className="font-semibold text-white mb-1">{title}</h3>
            <p className="text-gray-400 text-sm">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
