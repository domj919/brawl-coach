import type { BrawlerBase, GameMap, GameMode } from "@/types";

const BASE = "https://api.brawlapi.com/v1";

// ─── Raw API shapes ──────────────────────────────────────────────────────────

interface BrawlifyBrawler {
  id: number;
  name: string;
  class: { name: string };
  rarity: { name: string };
  imageUrl: string;
  gadgets: { id: number; name: string }[];
  starPowers: { id: number; name: string }[];
}

interface BrawlifyMap {
  id: number;
  name: string;
  disabled: boolean;
  gameMode: { name: string };
  imageUrl: string;
  environment: { name: string };
}

// ─── Fetchers ────────────────────────────────────────────────────────────────

export async function fetchBrawlers(): Promise<BrawlerBase[]> {
  const res = await fetch(`${BASE}/brawlers`, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`Brawlify brawlers error: ${res.status}`);
  const json = await res.json();
  const REMOVED_IDS = new Set([16000088]); // Buzz Lightyear — removed from game
  return (json.list as BrawlifyBrawler[]).filter((b) => !REMOVED_IDS.has(b.id)).map((b) => ({
    id: b.id,
    name: b.name,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    class: b.class.name as any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rarity: b.rarity.name as any,
    imageUrl: b.imageUrl,
    gadgets: b.gadgets,
    starPowers: b.starPowers,
  }));
}

export async function fetchMaps(): Promise<GameMap[]> {
  const res = await fetch(`${BASE}/maps`, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`Brawlify maps error: ${res.status}`);
  const json = await res.json();
  return (json.list as BrawlifyMap[])
    .filter((m) => !m.disabled)
    .map((m) => ({
      id: m.id,
      name: m.name,
      mode: m.gameMode.name as GameMode,
      imageUrl: m.imageUrl,
      environment: m.environment.name,
    }));
}
