import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center">
      <h1 className="text-5xl font-extrabold text-yellow-400 mb-4">Brawl Advisor</h1>
      <p className="text-gray-400 text-lg mb-10">
        Pick the right brawler for every ranked match — based on the map, the meta,
        your roster, and what the enemy drafted.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/roster"
          className="bg-yellow-400 text-gray-950 font-bold px-8 py-3 rounded-xl hover:bg-yellow-300 transition-colors"
        >
          Set up my roster
        </Link>
        <Link
          href="/draft"
          className="bg-gray-800 text-white font-bold px-8 py-3 rounded-xl hover:bg-gray-700 transition-colors"
        >
          Open draft advisor
        </Link>
      </div>
      <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
        {[
          { icon: "🗺️", title: "Map-aware", desc: "Brawler ratings tuned per map and mode." },
          { icon: "⚔️", title: "Counter picks", desc: "See who counters the enemy and who they counter back." },
          { icon: "🎒", title: "Your roster", desc: "Only suggests brawlers you own and flags upgrade gaps." },
        ].map(({ icon, title, desc }) => (
          <div key={title} className="bg-gray-900 rounded-2xl p-5 border border-gray-800">
            <div className="text-3xl mb-2">{icon}</div>
            <h3 className="font-semibold text-white mb-1">{title}</h3>
            <p className="text-gray-400 text-sm">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
