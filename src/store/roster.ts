import type { Roster, RosterEntry } from "@/types";

const KEY = "brawl-advisor:roster";

export function loadRoster(): Roster {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Roster) : {};
  } catch {
    return {};
  }
}

export function saveRoster(roster: Roster): void {
  localStorage.setItem(KEY, JSON.stringify(roster));
}

export function upsertEntry(roster: Roster, entry: RosterEntry): Roster {
  const next = { ...roster, [entry.brawlerId]: entry };
  saveRoster(next);
  return next;
}

export function removeEntry(roster: Roster, brawlerId: number): Roster {
  const next = { ...roster };
  delete next[brawlerId];
  saveRoster(next);
  return next;
}

export function defaultEntry(brawlerId: number): RosterEntry {
  return {
    brawlerId,
    powerLevel: 1,
    gadgetsOwned: [],
    starPowersOwned: [],
    gearsOwned: [],
    hasHypercharge: false,
    hasGadgetBuffie: false,
    hasStarBuffie: false,
    hasHyperBuffie: false,
  };
}
