// ─── Brawler Base ───────────────────────────────────────────────────────────

export type BrawlerClass =
  | "Tank"
  | "Damage Dealer"
  | "Assassin"
  | "Support"
  | "Controller"
  | "Marksman"
  | "Artillery"
  | "Hybrid";

export type Rarity =
  | "Trophy Road"
  | "Rare"
  | "Super Rare"
  | "Epic"
  | "Mythic"
  | "Legendary"
  | "Starting Brawler"
  | "Chrome";

export interface Gadget {
  id: number;
  name: string;
}

export interface StarPower {
  id: number;
  name: string;
}

export interface Gear {
  id: number;
  name: string;
}

export interface BrawlerBase {
  id: number;
  name: string;
  class: BrawlerClass;
  rarity: Rarity;
  imageUrl: string;
  gadgets: Gadget[];   // all possible gadgets (max 2)
  starPowers: StarPower[]; // all possible star powers (max 2)
}

// ─── Player Roster ──────────────────────────────────────────────────────────

export interface OwnedGear {
  gearId: number;
  level: 1 | 2 | 3;
}

export interface RosterEntry {
  brawlerId: number;
  powerLevel: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
  gadgetsOwned: number[];     // gadget ids
  starPowersOwned: number[];  // star power ids
  gearsOwned: OwnedGear[];
  hasHypercharge: boolean;
  hasGadgetBuffie: boolean;   // Gadget Buffie — boosts both gadgets
  hasStarBuffie: boolean;     // Star Buffie — boosts both star powers
  hasHyperBuffie: boolean;    // Hyper Buffie — boosts hypercharge
}

export type Roster = Record<number, RosterEntry>; // keyed by brawlerId

// ─── Maps & Modes ───────────────────────────────────────────────────────────

export type GameMode =
  | "Gem Grab"
  | "Brawl Ball"
  | "Heist"
  | "Bounty"
  | "Siege"
  | "Hot Zone"
  | "Knockout"
  | "Wipeout"
  | "Duels"
  | "5v5 Brawl Ball"
  | "5v5 Gem Grab"
  | "Paint Brawl"
  | "Showdown"
  | "Duo Showdown";

export interface GameMap {
  id: number;
  name: string;
  mode: GameMode;
  imageUrl: string;
  environment: string;
}

// ─── Meta / Tier Data ────────────────────────────────────────────────────────

export type Tier = "S" | "A" | "B" | "C" | "D";

export interface MapMeta {
  mapId: number;
  /** tier per brawler id */
  tiers: Record<number, Tier>;
  /** counters[X] = brawlers that counter X (by id) */
  counters: Record<number, number[]>;
  /** synergies[X] = brawlers that work well alongside X (by id) */
  synergies: Record<number, number[]>;
}

/** Name-based meta — easier to author, resolved to ids at runtime */
export interface MapMetaByName {
  mapId: number;
  tiers: Record<string, Tier>;
  /** counters[X] = brawler names that counter X */
  counters: Record<string, string[]>;
  /** synergies[X] = brawler names that work well alongside X */
  synergies: Record<string, string[]>;
}

// ─── Draft State ─────────────────────────────────────────────────────────────

export interface DraftState {
  mapId: number | null;
  allyPicks: number[];   // brawler ids (up to 2 allies already picked)
  enemyPicks: number[];  // brawler ids (up to 3 enemies already picked)
  bans: number[];        // brawler ids banned (up to 6 total, 3 per side)
}

// ─── Recommendation ──────────────────────────────────────────────────────────

export interface Recommendation {
  brawlerId: number;
  score: number;        // composite 0–100
  tier: Tier;
  reasons: string[];    // human-readable explanation bullets
  warnings: string[];   // e.g. "missing star power", "power level 6 — consider upgrading"
}
