"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import type { BrawlerBase, DraftState, GameMap, Recommendation } from "@/types";
import { useAppData } from "@/lib/useAppData";
import { loadRoster } from "@/store/roster";
import { resolveMapMeta } from "@/data/meta";
import { recommend } from "@/lib/recommend";
import { getRoleWarnings } from "@/lib/roles";
import { saveMatch, loadMatches, winRatesByBrawler } from "@/store/matches";
import type { Roster } from "@/types";

const TIER_COLOR: Record<string, string> = {
  S: "text-yellow-400 bg-yellow-400/10 border-yellow-400/40",
  A: "text-green-400 bg-green-400/10 border-green-400/40",
  B: "text-blue-400 bg-blue-400/10 border-blue-400/40",
  C: "text-gray-300 bg-gray-700/30 border-gray-600",
  D: "text-red-400 bg-red-400/10 border-red-400/40",
};

const RANKED_MODES = [
  "Gem Grab", "Brawl Ball", "Heist", "Bounty", "Hot Zone", "Knockout", "Wipeout",
];

type PickerTarget = "ally" | "enemy" | "ban";

export default function DraftPage() {
  const { brawlers, maps, loading, error } = useAppData();
  const [roster, setRoster] = useState<Roster>({});
  const [draft, setDraft] = useState<DraftState>({ mapId: null, allyPicks: [], enemyPicks: [], bans: [] });
  const [modeFilter, setModeFilter] = useState<string>("");
  const [mapSearch, setMapSearch] = useState("");
  const [pickerTarget, setPickerTarget] = useState<PickerTarget | null>(null);
  const [brawlerSearch, setBrawlerSearch] = useState("");
  const [lastPickedBrawlerId, setLastPickedBrawlerId] = useState<number | null>(null);
  const [matchLogged, setMatchLogged] = useState(false);
  const [winRates, setWinRates] = useState<Record<number, { wins: number; total: number }>>({});

  useEffect(() => {
    setRoster(loadRoster());
    setWinRates(winRatesByBrawler(loadMatches()));
  }, []);

  const filteredMaps = useMemo(() => maps
    .filter((m) => RANKED_MODES.includes(m.mode))
    .filter((m) => !modeFilter || m.mode === modeFilter)
    .filter((m) => m.name.toLowerCase().includes(mapSearch.toLowerCase())),
    [maps, modeFilter, mapSearch]
  );

  const selectedMap = maps.find((m) => m.id === draft.mapId) ?? null;

  const meta = useMemo(
    () => draft.mapId && brawlers.length
      ? resolveMapMeta(draft.mapId, brawlers, selectedMap?.mode)
      : null,
    [draft.mapId, brawlers, selectedMap?.mode]
  );

  const recommendations: Recommendation[] = useMemo(() => {
    if (!draft.mapId) return [];
    return recommend(draft, roster, brawlers, meta);
  }, [draft, roster, brawlers, meta]);

  const roleWarnings = useMemo(() =>
    getRoleWarnings(draft.allyPicks, brawlers, selectedMap?.mode as never),
    [draft.allyPicks, brawlers, selectedMap]
  );

  function allUsedIds() {
    return new Set([...draft.allyPicks, ...draft.enemyPicks, ...draft.bans]);
  }

  function addPick(brawlerId: number, side: PickerTarget) {
    setDraft((d) => {
      const used = new Set([...d.allyPicks, ...d.enemyPicks, ...d.bans]);
      if (used.has(brawlerId)) return d;
      if (side === "ally" && d.allyPicks.length >= 2) return d;
      if (side === "enemy" && d.enemyPicks.length >= 3) return d;
      if (side === "ban" && d.bans.length >= 6) return d;
      if (side === "ally") { setLastPickedBrawlerId(brawlerId); setMatchLogged(false); }
      return side === "ally"
        ? { ...d, allyPicks: [...d.allyPicks, brawlerId] }
        : side === "enemy"
        ? { ...d, enemyPicks: [...d.enemyPicks, brawlerId] }
        : { ...d, bans: [...d.bans, brawlerId] };
    });
    setPickerTarget(null);
    setBrawlerSearch("");
  }

  function removePick(brawlerId: number, side: PickerTarget) {
    setDraft((d) =>
      side === "ally" ? { ...d, allyPicks: d.allyPicks.filter((id) => id !== brawlerId) }
      : side === "enemy" ? { ...d, enemyPicks: d.enemyPicks.filter((id) => id !== brawlerId) }
      : { ...d, bans: d.bans.filter((id) => id !== brawlerId) }
    );
  }

  function resetDraft() {
    setDraft((d) => ({ mapId: d.mapId, allyPicks: [], enemyPicks: [], bans: [] }));
    setLastPickedBrawlerId(null);
    setMatchLogged(false);
  }

  function logMatch(won: boolean) {
    if (!lastPickedBrawlerId || !draft.mapId) return;
    saveMatch({ brawlerId: lastPickedBrawlerId, mapId: draft.mapId, won });
    setWinRates(winRatesByBrawler(loadMatches()));
    setMatchLogged(true);
  }

  function brawlerById(id: number) {
    return brawlers.find((b) => b.id === id);
  }

  const pickerBrawlers = brawlers.filter(
    (b) => !allUsedIds().has(b.id) &&
      b.name.toLowerCase().includes(brawlerSearch.toLowerCase())
  );

  if (loading) return <div className="p-8 text-gray-400">Loading data…</div>;
  if (error) return <div className="p-8 text-red-400">Error: {error}</div>;

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">Draft Advisor</h1>
        <button onClick={resetDraft} className="text-xs text-gray-400 hover:text-white border border-gray-700 rounded-lg px-3 py-1.5 transition-colors">
          Reset picks
        </button>
      </div>

      {/* Step 1: map */}
      <section className="mb-6">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">1 · Select Map</h2>
        <div className="flex gap-1.5 flex-wrap mb-2">
          <button
            onClick={() => setModeFilter("")}
            className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${!modeFilter ? "bg-yellow-400 text-gray-950 border-yellow-400" : "border-gray-700 text-gray-400 hover:border-gray-500"}`}
          >All</button>
          {RANKED_MODES.map((m) => (
            <button key={m} onClick={() => setModeFilter(m === modeFilter ? "" : m)}
              className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${modeFilter === m ? "bg-yellow-400 text-gray-950 border-yellow-400" : "border-gray-700 text-gray-400 hover:border-gray-500"}`}
            >{m}</button>
          ))}
        </div>
        <input type="text" placeholder="Search maps…" value={mapSearch} onChange={(e) => setMapSearch(e.target.value)}
          className="w-full mb-2 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400" />
        <div className="flex gap-2 overflow-x-auto pb-2">
          {filteredMaps.map((map: GameMap) => (
            <button key={map.id} onClick={() => setDraft((d) => ({ ...d, mapId: map.id }))}
              className={`shrink-0 rounded-xl overflow-hidden border-2 transition-all w-24 sm:w-28 ${draft.mapId === map.id ? "border-yellow-400" : "border-gray-700 hover:border-gray-500"}`}
            >
              <div className="relative h-16 sm:h-20 w-full bg-gray-800">
                <Image src={map.imageUrl} alt={map.name} fill className="object-cover" sizes="112px" unoptimized />
              </div>
              <div className="bg-gray-900 p-1.5">
                <p className="text-xs text-white font-medium truncate">{map.name}</p>
                <p className="text-xs text-gray-400 truncate">{map.mode}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Step 2: bans + picks */}
      <section className="mb-6 space-y-3">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">2 · Bans &amp; Picks</h2>

        {/* Bans */}
        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-4">
          <h3 className="text-sm font-semibold text-gray-300 mb-2">Bans <span className="text-gray-500 font-normal text-xs">({draft.bans.length}/6)</span></h3>
          <div className="flex gap-2 flex-wrap">
            {draft.bans.map((id) => {
              const b = brawlerById(id);
              return b ? (
                <button key={id} onClick={() => removePick(id, "ban")} title="Click to remove ban"
                  className="relative w-12 h-12 rounded-lg overflow-hidden border-2 border-red-600 opacity-60 hover:opacity-80 transition-opacity"
                >
                  <Image src={b.imageUrl} alt={b.name} fill className="object-cover grayscale" sizes="48px" unoptimized />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-red-400 text-lg font-bold">✕</div>
                </button>
              ) : null;
            })}
            {draft.bans.length < 6 && (
              <button onClick={() => setPickerTarget(pickerTarget === "ban" ? null : "ban")}
                className="w-12 h-12 rounded-lg border-2 border-dashed border-red-700 text-red-500 text-xl font-bold hover:border-red-500 transition-colors"
              >✕</button>
            )}
          </div>
        </div>

        {/* Ally + enemy picks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {(["ally", "enemy"] as const).map((side) => {
            const picks = side === "ally" ? draft.allyPicks : draft.enemyPicks;
            const limit = side === "ally" ? 2 : 3;
            const label = side === "ally" ? "Your Team" : "Enemy Team";
            const borderColor = side === "ally" ? "border-blue-500/40" : "border-red-500/40";
            const addBg = side === "ally" ? "border-blue-600 text-blue-400 hover:border-blue-400" : "border-red-700 text-red-400 hover:border-red-500";

            return (
              <div key={side} className={`bg-gray-900 border ${borderColor} rounded-2xl p-4`}>
                <h3 className="text-sm font-semibold text-gray-300 mb-2">{label} <span className="text-gray-500 font-normal text-xs">({picks.length}/{limit})</span></h3>
                <div className="flex gap-2 flex-wrap">
                  {picks.map((id) => {
                    const b = brawlerById(id);
                    const wr = winRates[id];
                    return b ? (
                      <div key={id} className="flex flex-col items-center gap-0.5">
                        <button onClick={() => removePick(id, side)} title="Click to remove"
                          className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-600 hover:border-red-400 transition-colors"
                        >
                          <Image src={b.imageUrl} alt={b.name} fill className="object-cover" sizes="48px" unoptimized />
                        </button>
                        {wr && wr.total > 0 && (
                          <span className={`text-xs font-medium ${Math.round((wr.wins / wr.total) * 100) >= 50 ? "text-green-400" : "text-red-400"}`}>
                            {Math.round((wr.wins / wr.total) * 100)}%
                          </span>
                        )}
                      </div>
                    ) : null;
                  })}
                  {picks.length < limit && (
                    <button onClick={() => setPickerTarget(pickerTarget === side ? null : side)}
                      className={`w-12 h-12 rounded-lg border-2 border-dashed text-xl font-bold transition-colors ${addBg}`}
                    >+</button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Inline brawler picker */}
      {pickerTarget && (
        <div className="mb-6 bg-gray-900 border border-gray-700 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-300">
              {pickerTarget === "ban" ? "Select brawler to ban" : `Adding ${pickerTarget} pick`}
            </h3>
            <button onClick={() => setPickerTarget(null)} className="text-gray-500 hover:text-white text-sm">✕</button>
          </div>
          <input type="text" placeholder="Search…" value={brawlerSearch} onChange={(e) => setBrawlerSearch(e.target.value)}
            autoFocus
            className="w-full mb-2 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400" />
          <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
            {pickerBrawlers.map((b) => (
              <button key={b.id} onClick={() => addPick(b.id, pickerTarget)} title={b.name}
                className="relative w-11 h-11 rounded-lg overflow-hidden border border-gray-700 hover:border-yellow-400 transition-colors"
              >
                <Image src={b.imageUrl} alt={b.name} fill className="object-cover" sizes="44px" unoptimized />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Role warnings */}
      {roleWarnings.length > 0 && draft.allyPicks.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {roleWarnings.map((w) => (
            <div key={w.role} className="flex items-center gap-1.5 bg-orange-400/10 border border-orange-400/30 rounded-lg px-3 py-1.5 text-xs text-orange-300">
              ⚠ {w.message}
            </div>
          ))}
        </div>
      )}

      {/* Post-match logger */}
      {lastPickedBrawlerId && draft.mapId && (
        <div className="mb-6 bg-gray-900 border border-gray-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center gap-3 flex-1">
            {(() => {
              const b = brawlerById(lastPickedBrawlerId);
              return b ? (
                <>
                  <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-gray-700 shrink-0">
                    <Image src={b.imageUrl} alt={b.name} fill className="object-cover" sizes="40px" unoptimized />
                  </div>
                  <p className="text-sm text-gray-300">
                    How did you do with <span className="text-white font-semibold">{b.name}</span>?
                  </p>
                </>
              ) : null;
            })()}
          </div>
          {matchLogged ? (
            <p className="text-xs text-green-400">Result logged ✓</p>
          ) : (
            <div className="flex gap-2">
              <button onClick={() => logMatch(true)}
                className="flex-1 sm:flex-none bg-green-700 hover:bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
                Won
              </button>
              <button onClick={() => logMatch(false)}
                className="flex-1 sm:flex-none bg-red-800 hover:bg-red-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
                Lost
              </button>
            </div>
          )}
        </div>
      )}

      {/* Step 3: recommendations */}
      {draft.mapId && (
        <section>
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
            3 · Recommendations {selectedMap && `— ${selectedMap.name}`}
          </h2>
          {!meta && (
            <div className="mb-3 p-3 bg-yellow-400/10 border border-yellow-400/30 rounded-xl text-yellow-300 text-xs">
              No map-specific data yet — using global tier list.
            </div>
          )}
          {recommendations.length === 0 ? (
            <p className="text-gray-400 text-sm">No brawlers in your roster to recommend. Add brawlers in My Roster first.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {recommendations.slice(0, 12).map((rec) => {
                const b = brawlerById(rec.brawlerId);
                if (!b) return null;
                const wr = winRates[rec.brawlerId];
                return (
                  <div key={rec.brawlerId}
                    className={`bg-gray-900 border rounded-xl p-3 flex gap-3 items-start ${TIER_COLOR[rec.tier]}`}
                  >
                    <button
                      onClick={() => addPick(rec.brawlerId, "ally")}
                      title={`Pick ${b.name}`}
                      className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-gray-700 hover:border-yellow-400 transition-colors"
                    >
                      <Image src={b.imageUrl} alt={b.name} fill className="object-cover" sizes="48px" unoptimized />
                    </button>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                        <span className="font-bold text-white text-sm">{b.name}</span>
                        <span className={`text-xs font-bold px-1.5 py-0.5 rounded border ${TIER_COLOR[rec.tier]}`}>{rec.tier}</span>
                        {wr && wr.total >= 3 && (
                          <span className={`text-xs font-medium ml-auto ${Math.round((wr.wins / wr.total) * 100) >= 50 ? "text-green-400" : "text-red-400"}`}>
                            {Math.round((wr.wins / wr.total) * 100)}% WR ({wr.total})
                          </span>
                        )}
                      </div>
                      {rec.reasons.map((r) => (
                        <p key={r} className="text-xs text-gray-300 leading-tight">✓ {r}</p>
                      ))}
                      {rec.warnings.map((w) => (
                        <p key={w} className="text-xs text-orange-400 leading-tight">⚠ {w}</p>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
