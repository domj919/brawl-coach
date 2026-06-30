"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { BrawlerBase, RosterEntry } from "@/types";
import { useAppData } from "@/lib/useAppData";
import { loadRoster, upsertEntry, removeEntry, defaultEntry } from "@/store/roster";
import { brawlerHasBuffies } from "@/data/hypercharges";
import { readinessScore, readinessColour } from "@/lib/readiness";
import type { Roster } from "@/types";

const POWER_LEVELS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] as const;

export default function RosterPage() {
  const { brawlers, loading, error } = useAppData();
  const [roster, setRoster] = useState<Roster>({});
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<BrawlerBase | null>(null);
  const [tagInput, setTagInput] = useState("");
  const [importing, setImporting] = useState(false);
  const [importMsg, setImportMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    setRoster(loadRoster());
  }, []);

  async function handleImport() {
    const tag = tagInput.trim();
    if (!tag) return;
    setImporting(true);
    setImportMsg(null);
    try {
      const res = await fetch(`/api/import-roster?tag=${encodeURIComponent(tag)}`);
      const data = await res.json();
      if (!res.ok) {
        setImportMsg({ type: "error", text: data.error ?? "Import failed" });
        return;
      }
      const imported: Roster = data.roster;
      // Merge: preserve hasBuff/hasHypercharge from existing entries
      const merged: Roster = { ...imported };
      for (const id of Object.keys(roster)) {
        const numId = Number(id);
        if (merged[numId]) {
          merged[numId].hasHypercharge = roster[numId].hasHypercharge;
          merged[numId].hasGadgetBuffie = roster[numId].hasGadgetBuffie;
          merged[numId].hasStarBuffie = roster[numId].hasStarBuffie;
          merged[numId].hasHyperBuffie = roster[numId].hasHyperBuffie;
        }
      }
      import("@/store/roster").then(({ saveRoster }) => saveRoster(merged));
      setRoster(merged);
      setImportMsg({ type: "success", text: `Imported ${Object.keys(merged).length} brawlers from ${data.playerName} (${data.playerTag})` });
    } catch (e) {
      setImportMsg({ type: "error", text: String(e) });
    } finally {
      setImporting(false);
    }
  }

  const filtered = brawlers.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase())
  );

  function toggleOwned(brawler: BrawlerBase) {
    if (roster[brawler.id]) {
      setRoster((r) => removeEntry(r, brawler.id));
      if (selected?.id === brawler.id) setSelected(null);
    } else {
      const entry = defaultEntry(brawler.id);
      setRoster((r) => upsertEntry(r, entry));
    }
  }

  function updateEntry(patch: Partial<RosterEntry>) {
    if (!selected) return;
    const existing = roster[selected.id] ?? defaultEntry(selected.id);
    const updated = { ...existing, ...patch };
    setRoster((r) => upsertEntry(r, updated));
  }

  function toggleGadget(id: number) {
    if (!selected) return;
    const entry = roster[selected.id];
    if (!entry) return;
    const owned = entry.gadgetsOwned.includes(id)
      ? entry.gadgetsOwned.filter((g) => g !== id)
      : [...entry.gadgetsOwned, id];
    updateEntry({ gadgetsOwned: owned });
  }

  function toggleStarPower(id: number) {
    if (!selected) return;
    const entry = roster[selected.id];
    if (!entry) return;
    const owned = entry.starPowersOwned.includes(id)
      ? entry.starPowersOwned.filter((s) => s !== id)
      : [...entry.starPowersOwned, id];
    updateEntry({ starPowersOwned: owned });
  }

  const selectedEntry = selected ? roster[selected.id] : null;
  const ownedCount = Object.keys(roster).length;

  if (loading) return <div className="p-8 text-gray-400">Loading brawlers…</div>;
  if (error) return <div className="p-8 text-red-400">Error: {error}</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 flex gap-6">
      {/* Left: brawler grid */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">My Roster</h1>
          <span className="text-sm text-gray-400">{ownedCount} / {brawlers.length} owned</span>
        </div>

        {/* Auto-import by player tag */}
        <div className="mb-5 bg-gray-900 border border-gray-800 rounded-xl p-4">
          <p className="text-xs text-gray-400 mb-2 font-medium">Auto-import from Brawl Stars</p>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Player tag e.g. #2PP"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleImport()}
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <button
              onClick={handleImport}
              disabled={importing}
              className="bg-yellow-400 text-gray-950 font-bold px-4 py-2 rounded-lg text-sm hover:bg-yellow-300 disabled:opacity-50 transition-colors"
            >
              {importing ? "Importing…" : "Import"}
            </button>
          </div>
          {importMsg && (
            <p className={`mt-2 text-xs ${importMsg.type === "success" ? "text-green-400" : "text-red-400"}`}>
              {importMsg.text}
            </p>
          )}
        </div>
        <input
          type="text"
          placeholder="Search brawlers…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full mb-4 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
        <div className="grid grid-cols-5 sm:grid-cols-7 md:grid-cols-9 gap-2">
          {filtered.map((b) => {
            const owned = !!roster[b.id];
            const isSelected = selected?.id === b.id;
            return (
              <button
                key={b.id}
                onClick={() => {
                  if (!owned) toggleOwned(b);
                  setSelected(isSelected ? null : b);
                }}
                onContextMenu={(e) => { e.preventDefault(); toggleOwned(b); }}
                title={`${b.name} — ${owned ? "right-click to remove" : "click to add"}`}
                className={`relative rounded-lg overflow-hidden border-2 transition-all aspect-square
                  ${owned ? "border-yellow-400 opacity-100" : "border-gray-700 opacity-40 hover:opacity-60"}
                  ${isSelected ? "ring-2 ring-white" : ""}
                `}
              >
                <Image src={b.imageUrl} alt={b.name} fill className="object-cover" sizes="64px" unoptimized />
                {owned && (() => {
                  const entry = roster[b.id];
                  const score = readinessScore(entry, b);
                  return (
                    <span className={`absolute bottom-0 right-0 text-[9px] font-bold px-0.5 bg-gray-950/80 rounded-tl ${readinessColour(score)}`}>
                      {score}%
                    </span>
                  );
                })()}
              </button>
            );
          })}
        </div>
        <p className="mt-3 text-xs text-gray-500">Click to add/select · Right-click to remove</p>
      </div>

      {/* Right: detail panel */}
      <div className="w-72 shrink-0">
        {selected && selectedEntry ? (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 sticky top-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-700">
                <Image src={selected.imageUrl} alt={selected.name} fill className="object-cover" sizes="48px" unoptimized />
              </div>
              <div>
                <h2 className="font-bold text-white">{selected.name}</h2>
                <p className="text-xs text-gray-400">{selected.class} · {selected.rarity}</p>
              </div>
            </div>

            {/* Power level */}
            <label className="block text-xs text-gray-400 mb-1">Power Level</label>
            <div className="flex flex-wrap gap-1 mb-4">
              {POWER_LEVELS.map((p) => (
                <button
                  key={p}
                  onClick={() => updateEntry({ powerLevel: p })}
                  className={`w-7 h-7 rounded text-xs font-bold transition-colors
                    ${selectedEntry.powerLevel === p ? "bg-yellow-400 text-gray-950" : "bg-gray-800 text-gray-300 hover:bg-gray-700"}
                  `}
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Gadgets */}
            {selected.gadgets.length > 0 && (
              <>
                <label className="block text-xs text-gray-400 mb-1">Gadgets</label>
                <div className="flex flex-col gap-1 mb-4">
                  {selected.gadgets.map((g) => {
                    const owned = selectedEntry.gadgetsOwned.includes(g.id);
                    return (
                      <button
                        key={g.id}
                        onClick={() => toggleGadget(g.id)}
                        className={`text-left text-xs px-3 py-1.5 rounded-lg transition-colors
                          ${owned ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"}
                        `}
                      >
                        {owned ? "✓ " : ""}{g.name}
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {/* Star Powers */}
            {selected.starPowers.length > 0 && (
              <>
                <label className="block text-xs text-gray-400 mb-1">Star Powers</label>
                <div className="flex flex-col gap-1 mb-4">
                  {selected.starPowers.map((sp) => {
                    const owned = selectedEntry.starPowersOwned.includes(sp.id);
                    return (
                      <button
                        key={sp.id}
                        onClick={() => toggleStarPower(sp.id)}
                        className={`text-left text-xs px-3 py-1.5 rounded-lg transition-colors
                          ${owned ? "bg-purple-600 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"}
                        `}
                      >
                        {owned ? "✓ " : ""}{sp.name}
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {/* Hypercharge */}
            <div className="flex flex-col gap-2 mb-2">
              <button
                onClick={() => updateEntry({ hasHypercharge: !selectedEntry.hasHypercharge })}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors
                  ${selectedEntry.hasHypercharge ? "bg-orange-500 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"}
                `}
              >
                {selectedEntry.hasHypercharge ? "✓ Hypercharge" : "Hypercharge"}
              </button>
            </div>

            {/* Buffies — only for brawlers that have them */}
            {brawlerHasBuffies(selected.name) && (
              <>
                <label className="block text-xs text-gray-400 mb-1">Buffies</label>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => updateEntry({ hasGadgetBuffie: !selectedEntry.hasGadgetBuffie })}
                    className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors
                      ${selectedEntry.hasGadgetBuffie ? "bg-cyan-600 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"}
                    `}
                  >
                    {selectedEntry.hasGadgetBuffie ? "✓ Gadget Buffie" : "Gadget Buffie"}
                  </button>
                  <button
                    onClick={() => updateEntry({ hasStarBuffie: !selectedEntry.hasStarBuffie })}
                    className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors
                      ${selectedEntry.hasStarBuffie ? "bg-purple-600 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"}
                    `}
                  >
                    {selectedEntry.hasStarBuffie ? "✓ Star Buffie" : "Star Buffie"}
                  </button>
                  <button
                    onClick={() => updateEntry({ hasHyperBuffie: !selectedEntry.hasHyperBuffie })}
                    className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors
                      ${selectedEntry.hasHyperBuffie ? "bg-yellow-500 text-gray-950" : "bg-gray-800 text-gray-400 hover:bg-gray-700"}
                    `}
                  >
                    {selectedEntry.hasHyperBuffie ? "✓ Hyper Buffie" : "Hyper Buffie"}
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 text-center text-gray-500 text-sm">
            Click a brawler you own to edit their upgrades.
          </div>
        )}
      </div>
    </div>
  );
}
