const KEY = "brawl-advisor:matches";

export interface MatchResult {
  id: string;
  timestamp: number;
  brawlerId: number;
  mapId: number;
  won: boolean;
}

export function loadMatches(): MatchResult[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as MatchResult[]) : [];
  } catch {
    return [];
  }
}

export function saveMatch(result: Omit<MatchResult, "id" | "timestamp">): void {
  const matches = loadMatches();
  matches.push({ ...result, id: crypto.randomUUID(), timestamp: Date.now() });
  localStorage.setItem(KEY, JSON.stringify(matches));
}

/** Win rate per brawler id: { [brawlerId]: { wins, total } } */
export function winRatesByBrawler(matches: MatchResult[]): Record<number, { wins: number; total: number }> {
  const stats: Record<number, { wins: number; total: number }> = {};
  for (const m of matches) {
    if (!stats[m.brawlerId]) stats[m.brawlerId] = { wins: 0, total: 0 };
    stats[m.brawlerId].total++;
    if (m.won) stats[m.brawlerId].wins++;
  }
  return stats;
}
