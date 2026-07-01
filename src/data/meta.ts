import type { BrawlerBase, MapMeta, MapMetaByName, Tier } from "@/types";

// ─── Global tier list ────────────────────────────────────────────────────────
// Season 51 — June 2026. Source: community consensus / grindnstrat.com

export const GLOBAL_TIERS_BY_NAME: Record<string, Tier> = {
  // S
  Colette: "S", Edgar: "S", Bolt: "S", Mortis: "S",
  Chester: "S", Crow: "S", Colt: "S", Kit: "S",
  // A
  "Starr Nova": "A", Pierce: "A", Otis: "A", Damian: "A", Griff: "A", Mina: "A",
  // B
  Bibi: "B", Najia: "B", Shade: "B", Cordelius: "B", Lumi: "B", Emz: "B",
  Meeple: "B", Leon: "B", Fang: "B", Shelly: "B", Bull: "B", Charlie: "B",
  Bea: "B", Buster: "B", Finx: "B", Alli: "B",
  // C
  Byron: "C", Spike: "C", Maisie: "C", Sandy: "C", Mandy: "C", Tara: "C",
  Janet: "C", "Jae-Yong": "C", Stu: "C", Berry: "C", Bonnie: "C", Moe: "C",
  Sam: "C", "R-T": "C", Piper: "C", Carl: "C", Penny: "C", Brock: "C", Rico: "C",
  // D
  Pam: "D", Buzz: "D", Bo: "D", Lily: "D", Meg: "D", Sirius: "D",
  Willow: "D", Angelo: "D", Kaze: "D", Lola: "D", Gus: "D", Ziggy: "D",
  Pearl: "D", Clancy: "D", Kenji: "D", Melodie: "D",
  Lou: "D", Amber: "D", Ruffs: "D", Glowy: "D", Gene: "D", Gale: "D",
  Draco: "D", Nani: "D", Barley: "D", "Mr. P": "D", Mico: "D", Trunk: "D",
  Nita: "D", Juju: "D", Surge: "D", Squeak: "D", Max: "D", Gray: "D",
  Frank: "D", Belle: "D", Ash: "D", Rosa: "D", Dynamike: "D", "El Primo": "D",
  Darryl: "D", Tick: "D", Poco: "D", Eve: "D", "8-Bit": "D", Sprout: "D",
  Gigi: "D", Ollie: "D", Doug: "D", Grom: "D", Chuck: "D", Hank: "D",
  Jessie: "D", Jacky: "D", "Larry & Lawrie": "D",
};

export function getGlobalTier(name: string): Tier {
  return GLOBAL_TIERS_BY_NAME[name] ?? "C";
}

// ─── Mode templates ───────────────────────────────────────────────────────────
// Counters: counters[X] = brawlers that counter X
// Synergies: synergies[X] = brawlers that pair well with X

const GEM_GRAB_TEMPLATE = {
  tiers: {
    Gene: "S", Sandy: "S", Tara: "S", Max: "S", Spike: "S", Poco: "A",
    Chester: "S", Colette: "A", "Starr Nova": "A", Crow: "A", Emz: "A",
    Byron: "A", Buster: "A", Ruffs: "B", Barley: "B", Carl: "B", Brock: "B",
    Rico: "B", Stu: "B", Surge: "B", Nita: "B", Gus: "B", Mortis: "C",
    Edgar: "C", Leon: "C", Shelly: "C", Bull: "C", Bibi: "C", Piper: "D",
  } as Record<string, Tier>,
  counters: {
    Gene:    ["Mortis", "Edgar", "Cordelius", "Charlie", "Leon"],
    Sandy:   ["Edgar", "Mortis", "Leon", "Cordelius"],
    Tara:    ["Edgar", "Mortis", "Cordelius", "Charlie"],
    Max:     ["Crow", "Piper", "Brock"],
    Poco:    ["Edgar", "Mortis", "Leon", "Crow"],
    Spike:   ["Leon", "Mortis", "Edgar", "Sandy"],
    Emz:     ["Mortis", "Edgar", "Leon", "Stu"],
    Buster:  ["Colette", "Spike", "Chester"],
    Barley:  ["Mortis", "Edgar", "Stu", "Leon"],
    Chester: ["Crow", "Spike"],
    Crow:    ["Mortis", "Shelly", "Bull", "Buster"],
    Colette: ["Edgar", "Mortis", "Leon", "Crow"],
    Byron:   ["Edgar", "Mortis", "Leon"],
  } as Record<string, string[]>,
  synergies: {
    Gene:    ["Poco", "Sandy", "Max", "Tara"],
    Sandy:   ["Gene", "Tara", "Poco", "Emz"],
    Tara:    ["Sandy", "Gene", "Poco", "Emz"],
    Max:     ["Chester", "Colette", "Spike", "Crow"],
    Poco:    ["Sandy", "Gene", "Tara", "Chester", "Emz"],
    Emz:     ["Sandy", "Tara", "Gene", "Poco"],
    Spike:   ["Sandy", "Max", "Poco"],
    Chester: ["Max", "Poco", "Sandy"],
    Crow:    ["Max", "Poco"],
    Buster:  ["Gene", "Sandy", "Poco"],
  } as Record<string, string[]>,
};

const BRAWL_BALL_TEMPLATE = {
  tiers: {
    Bibi: "S", Mortis: "S", Stu: "S", Edgar: "S", Bull: "S", Fang: "S",
    Damian: "S", Chester: "S", Colt: "A", Max: "A", Buster: "A", Leon: "A",
    Shelly: "A", Sam: "A", Frank: "A", Colette: "A", Kit: "A",
    Crow: "B", Spike: "B", Emz: "B", Sandy: "B", Bo: "B",
    Piper: "C", Brock: "C", Gene: "C", Poco: "C", Barley: "D",
  } as Record<string, Tier>,
  counters: {
    Bibi:    ["Colt", "Frank", "Chester", "Mortis"],
    Mortis:  ["Crow", "Spike", "Shelly", "Chester", "Bull"],
    Bull:    ["Colette", "Colt", "Frank", "Chester", "Piper"],
    Edgar:   ["Crow", "Spike", "Shelly", "Chester"],
    Stu:     ["Bull", "Colt", "Frank", "Chester"],
    Fang:    ["Chester", "Crow", "Shelly", "Spike"],
    Frank:   ["Colette", "Mortis", "Edgar", "Stu"],
    Sam:     ["Colt", "Chester", "Colette"],
    Gene:    ["Mortis", "Edgar", "Bull", "Bibi"],
    Piper:   ["Mortis", "Edgar", "Stu", "Leon", "Bull"],
    Brock:   ["Mortis", "Edgar", "Stu", "Bull"],
    Chester: ["Crow", "Spike"],
    Damian:  ["Colette", "Colt", "Brock"],
  } as Record<string, string[]>,
  synergies: {
    Max:     ["Bibi", "Bull", "Edgar", "Mortis", "Stu", "Fang"],
    Kit:     ["Bibi", "Bull", "Mortis", "Chester", "Damian"],
    Bibi:    ["Max", "Kit", "Mortis"],
    Mortis:  ["Max", "Kit", "Bibi"],
    Bull:    ["Max", "Kit", "Shelly"],
    Edgar:   ["Max", "Kit"],
    Buster:  ["Max", "Mortis", "Bibi"],
    Damian:  ["Kit", "Max", "Bibi"],
    Chester: ["Max", "Kit"],
    Colt:    ["Max", "Buster"],
  } as Record<string, string[]>,
};

const HEIST_TEMPLATE = {
  tiers: {
    Colt: "S", Colette: "S", Rico: "S", Bull: "S", Brock: "S", Griff: "S",
    Nita: "A", Jessie: "A", Bibi: "A", Edgar: "A", Surge: "A", Sam: "A",
    Barley: "A", Penny: "A", Chester: "A",
    Mortis: "B", Spike: "B", "El Primo": "B", Dynamike: "B", Tick: "B",
    Piper: "C", Gene: "C", Sandy: "C", Emz: "C", Crow: "C",
  } as Record<string, Tier>,
  counters: {
    Colt:    ["Bull", "Frank", "El Primo", "Bibi", "Darryl"],
    Brock:   ["Edgar", "Mortis", "Stu", "Bull", "Bibi"],
    Rico:    ["Bull", "Frank", "El Primo", "Bibi"],
    Colette: ["Edgar", "Mortis", "Leon", "Crow"],
    Griff:   ["Edgar", "Mortis", "Bull", "Bibi"],
    Nita:    ["Barley", "Dynamike", "Spike"],
    Jessie:  ["Mortis", "Edgar", "Bull"],
    Surge:   ["Edgar", "Mortis", "Crow"],
    Penny:   ["Edgar", "Mortis", "Bull"],
    Edgar:   ["Crow", "Spike", "Shelly"],
    Bull:    ["Colette", "Colt", "Brock"],
    Bibi:    ["Colt", "Frank", "Chester"],
    Chester: ["Crow", "Spike"],
  } as Record<string, string[]>,
  synergies: {
    Nita:    ["Colt", "Jessie", "Brock"],
    Jessie:  ["Nita", "Colt", "Brock"],
    Ruffs:   ["Colt", "Brock", "Rico", "Griff"],
    Colt:    ["Nita", "Jessie", "Ruffs"],
    Brock:   ["Nita", "Ruffs"],
    Bull:    ["Colt", "Brock", "Nita"],
    Penny:   ["Nita", "Jessie"],
    Edgar:   ["Colt", "Brock"],
    Colette: ["Bull", "Nita"],
  } as Record<string, string[]>,
};

const BOUNTY_TEMPLATE = {
  tiers: {
    // Long-range damage dealers dominate Bounty
    Piper: "S", Brock: "S", Belle: "S", Mandy: "S", Angelo: "S",
    Crow: "A", Leon: "A", Spike: "A", Chester: "A", Tick: "A", Nani: "A",
    Bo: "B", Rico: "B", Carl: "B", Barley: "B",
    Mortis: "C", Edgar: "C", Stu: "C", Sandy: "C", Colt: "C",
    Bull: "D", "El Primo": "D", Bibi: "D",
  } as Record<string, Tier>,
  counters: {
    Piper:   ["Mortis", "Edgar", "Stu", "Leon", "Cordelius"],
    Brock:   ["Mortis", "Edgar", "Stu", "Leon"],
    Belle:   ["Mortis", "Edgar", "Stu", "Leon", "Cordelius"],
    Mandy:   ["Mortis", "Edgar", "Stu", "Leon"],
    Angelo:  ["Mortis", "Edgar", "Stu", "Leon"],
    Crow:    ["Mortis", "Shelly", "Bull", "Buster"],
    Bo:      ["Leon", "Mortis", "Edgar"],
    Leon:    ["Buster", "Crow", "Tara"],
    Tick:    ["Mortis", "Edgar", "Stu"],
    Chester: ["Crow", "Spike"],
    Spike:   ["Leon", "Mortis", "Edgar"],
    Colt:    ["Piper", "Mandy", "Angelo", "Belle"],
  } as Record<string, string[]>,
  synergies: {
    Ruffs:   ["Piper", "Brock", "Belle", "Mandy", "Angelo", "Crow"],
    Bo:      ["Piper", "Brock", "Belle", "Mandy"],
    Gene:    ["Piper", "Belle", "Mandy", "Brock"],
    Piper:   ["Ruffs", "Bo", "Belle", "Mandy"],
    Brock:   ["Ruffs", "Bo", "Piper", "Mandy"],
    Belle:   ["Ruffs", "Bo", "Piper", "Mandy"],
    Mandy:   ["Ruffs", "Bo", "Piper", "Belle"],
    Angelo:  ["Ruffs", "Piper", "Belle"],
  } as Record<string, string[]>,
};

const KNOCKOUT_TEMPLATE = {
  tiers: {
    Piper: "S", Belle: "S", Brock: "S", Crow: "S", Leon: "S",
    Chester: "S", Damian: "A", Angelo: "A", Mandy: "A", Spike: "A", Bo: "A",
    Gray: "A", Tick: "A", Colt: "B",
    Carl: "B", Rico: "B", Barley: "B", Emz: "B",
    Bull: "C", "El Primo": "C", Bibi: "C", Mortis: "C",
  } as Record<string, Tier>,
  counters: {
    Piper:   ["Mortis", "Edgar", "Stu", "Leon", "Cordelius"],
    Belle:   ["Mortis", "Edgar", "Stu", "Leon", "Cordelius"],
    Brock:   ["Mortis", "Edgar", "Stu", "Leon"],
    Crow:    ["Mortis", "Shelly", "Bull", "Buster"],
    Leon:    ["Buster", "Crow", "Tara", "Spike"],
    Colt:    ["Bull", "Frank", "El Primo"],
    Angelo:  ["Mortis", "Edgar", "Stu", "Leon"],
    Mandy:   ["Mortis", "Edgar", "Stu", "Leon"],
    Bo:      ["Leon", "Mortis", "Edgar"],
    Tick:    ["Mortis", "Edgar", "Stu"],
    Gray:    ["Mortis", "Edgar", "Leon"],
    Damian:  ["Colette", "Colt", "Brock", "Belle"],
    Chester: ["Crow", "Spike"],
    Spike:   ["Leon", "Mortis"],
  } as Record<string, string[]>,
  synergies: {
    Ruffs:   ["Piper", "Brock", "Belle", "Colt", "Angelo", "Crow"],
    Gray:    ["Piper", "Belle", "Brock", "Colt"],
    Bo:      ["Piper", "Belle", "Brock", "Colt"],
    Piper:   ["Ruffs", "Gray", "Bo", "Belle"],
    Brock:   ["Ruffs", "Gray", "Bo", "Piper"],
    Belle:   ["Ruffs", "Gray", "Bo", "Piper"],
    Colt:    ["Ruffs", "Gray", "Bo"],
    Crow:    ["Ruffs", "Piper"],
    Leon:    ["Ruffs", "Gray"],
  } as Record<string, string[]>,
};

const HOT_ZONE_TEMPLATE = {
  tiers: {
    Emz: "S", Sandy: "S", "Larry & Lawrie": "S", Damian: "S", Juju: "S", Pam: "S",
    Poco: "A", Ruffs: "A", Barley: "A", Spike: "A", Sprout: "A", Frank: "A",
    Tara: "B", Buster: "B", Colette: "B", Gale: "B",
    Mortis: "C", Edgar: "C", Leon: "C", Bibi: "C",
  } as Record<string, Tier>,
  counters: {
    Emz:             ["Mortis", "Edgar", "Leon", "Stu"],
    Sandy:           ["Edgar", "Mortis", "Leon", "Cordelius"],
    "Larry & Lawrie":["Mortis", "Edgar", "Leon", "Stu"],
    Pam:             ["Edgar", "Mortis", "Colette"],
    Juju:            ["Mortis", "Edgar", "Leon"],
    Damian:          ["Colette", "Colt", "Brock"],
    Frank:           ["Colette", "Mortis", "Edgar"],
    Sprout:          ["Mortis", "Edgar", "Stu"],
    Barley:          ["Mortis", "Edgar", "Stu", "Leon"],
    Spike:           ["Leon", "Mortis", "Edgar"],
    Buster:          ["Colette", "Spike", "Chester"],
    Poco:            ["Edgar", "Mortis", "Leon"],
  } as Record<string, string[]>,
  synergies: {
    Sandy:           ["Emz", "Tara", "Poco", "Pam"],
    Emz:             ["Sandy", "Tara", "Poco", "Pam"],
    Pam:             ["Sandy", "Emz", "Frank"],
    Poco:            ["Sandy", "Emz", "Pam", "Frank", "Juju"],
    Tara:            ["Sandy", "Emz", "Poco"],
    Ruffs:           ["Emz", "Sandy", "Damian", "Colette"],
    Frank:           ["Pam", "Poco"],
    Damian:          ["Poco", "Pam", "Ruffs"],
    Juju:            ["Poco", "Pam", "Sandy"],
  } as Record<string, string[]>,
};

const WIPEOUT_TEMPLATE = {
  tiers: {
    ...KNOCKOUT_TEMPLATE.tiers,
    Damian: "S", Colette: "A", Bibi: "A", Sam: "A",
  } as Record<string, Tier>,
  counters: { ...KNOCKOUT_TEMPLATE.counters } as Record<string, string[]>,
  synergies: { ...KNOCKOUT_TEMPLATE.synergies } as Record<string, string[]>,
};

// ─── Per-map meta (name-based) ────────────────────────────────────────────────
// Active ranked maps as of Season 51 (June 2026)

type NamedMeta = Omit<MapMetaByName, "mapId">;

// Map-specific overrides merged on top of mode templates
const MAP_OVERRIDES: Record<number, Partial<NamedMeta>> = {
  // ── Gem Grab ──────────────────────────────────────────────────────────────
  // Hard Rock Mine (15000007) — open middle, long lanes
  15000007: {
    tiers: { Piper: "B", Brock: "B", Rico: "A" },
  },
  // Crystal Arcade (15000008) — lots of walls, throwers strong
  15000008: {
    tiers: { Barley: "S", Dynamike: "A", Sprout: "A", Rico: "S" },
  },
  // Deathcap Trap (15000009) — open, chokepoints
  15000009: {
    tiers: { Emz: "S", Byron: "S", Sandy: "A" },
  },
  // Gem Fort (15000010) — walled fort, close range viable
  15000010: {
    tiers: { Buster: "S", Bull: "B", Frank: "B" },
  },
  // Undermine (15000011) — bush-heavy
  15000011: {
    tiers: { Leon: "B", Sandy: "S", Crow: "S" },
  },
  // Double Swoosh (15000115) — symmetric, balanced
  15000115: {},

  // ── Brawl Ball ───────────────────────────────────────────────────────────
  // Backyard Bowl (15000024) — many walls, close-range
  15000024: {
    tiers: { Bull: "S", Frank: "A", Darryl: "A" },
  },
  // Triple Dribble (15000025) — open middle
  15000025: {
    tiers: { Colt: "S", Rico: "S", Brock: "B" },
  },
  // Pinhole Punt (15000026) — very tight, tanks dominate
  15000026: {
    tiers: { Bull: "S", Darryl: "S", Frank: "S", Bibi: "A" },
  },
  // Sneaky Fields (15000050) — bushy, ambush heavy
  15000050: {
    tiers: { Leon: "B", Sandy: "A", Crow: "A" },
  },
  // Super Beach (15000051) — open, long range viable
  15000051: {
    tiers: { Colt: "S", Piper: "C", Brock: "C" },
  },
  // Pinball Dreams (15000118) — bouncy walls, Rico heaven
  15000118: {
    tiers: { Rico: "S", Colt: "S", Brock: "A" },
    counters: { Rico: ["Bull", "Frank", "Bibi"] },
  },
  // Center Stage (15000132) — open center
  15000132: {
    tiers: { Bibi: "S", Stu: "S", Colt: "A" },
  },
  // Beach Ball (15000143) — lots of water, fewer walls
  15000143: {
    tiers: { Stu: "S", Fang: "S", Mortis: "S" },
  },
  // Sunny Soccer (15000144) — wide open
  15000144: {
    tiers: { Colt: "S", Rico: "A", Brock: "C" },
  },

  // ── Heist ────────────────────────────────────────────────────────────────
  // Kaboom Canyon (15000018) — wide lanes, long range
  15000018: {
    tiers: { Brock: "S", Piper: "B", Rico: "S" },
  },
  // Safe Zone (15000019) — protected safe, tanks needed
  15000019: {
    tiers: { Bull: "S", Bibi: "S", Frank: "A" },
  },
  // Bridge Too Far (15000072) — narrow lanes
  15000072: {
    tiers: { Colt: "S", Rico: "S", Bull: "A" },
  },
  // Pit Stop (15000137) — central pits
  15000137: {
    tiers: { Griff: "S", Colette: "S", Colt: "S" },
  },

  // ── Bounty ───────────────────────────────────────────────────────────────
  // Shooting Star (15000005) — very open, snipers only
  15000005: {
    tiers: { Piper: "S", Brock: "S", Belle: "S", Mandy: "S", Angelo: "S", Bo: "C", Colt: "D" },
  },
  // Hideout (15000022) — bushy flanks
  15000022: {
    tiers: { Leon: "S", Crow: "S", Sandy: "A" },
  },
  // Layer Cake (15000082) — layered platforms, mid-range more viable
  15000082: {
    tiers: { Brock: "S", Belle: "S", Bo: "A", Mandy: "S" },
  },
  // Dry Season (15000083) — open desert
  15000083: {
    tiers: { Piper: "S", Mandy: "S", Angelo: "A" },
  },
};

const MODE_TEMPLATES: Record<string, NamedMeta> = {
  "Gem Grab":  GEM_GRAB_TEMPLATE,
  "Brawl Ball": BRAWL_BALL_TEMPLATE,
  "Heist":     HEIST_TEMPLATE,
  "Bounty":    BOUNTY_TEMPLATE,
  "Knockout":  KNOCKOUT_TEMPLATE,
  "Hot Zone":  HOT_ZONE_TEMPLATE,
  "Wipeout":   WIPEOUT_TEMPLATE,
};

// Map id → mode name (derived from API; stored here for offline resolution)
const MAP_MODES: Record<number, string> = {
  15000007: "Gem Grab", 15000008: "Gem Grab", 15000009: "Gem Grab",
  15000010: "Gem Grab", 15000011: "Gem Grab", 15000115: "Gem Grab",
  15000024: "Brawl Ball", 15000025: "Brawl Ball", 15000026: "Brawl Ball",
  15000050: "Brawl Ball", 15000051: "Brawl Ball", 15000118: "Brawl Ball",
  15000132: "Brawl Ball", 15000143: "Brawl Ball", 15000144: "Brawl Ball",
  15000018: "Heist", 15000019: "Heist", 15000072: "Heist",
  15000053: "Heist", 15000137: "Heist",
  15000005: "Bounty", 15000022: "Bounty", 15000082: "Bounty", 15000083: "Bounty",
};

// ─── Runtime resolution ───────────────────────────────────────────────────────

function nameIndex(brawlers: BrawlerBase[]): Map<string, number> {
  const idx = new Map<string, number>();
  for (const b of brawlers) idx.set(b.name, b.id);
  return idx;
}

function resolveNames(names: string[], idx: Map<string, number>): number[] {
  return names.flatMap((n) => {
    const id = idx.get(n);
    return id !== undefined ? [id] : [];
  });
}

export function resolveMapMeta(
  mapId: number,
  brawlers: BrawlerBase[],
  mapMode?: string
): MapMeta | null {
  const mode = mapMode ?? MAP_MODES[mapId];
  const template = mode ? MODE_TEMPLATES[mode] : null;
  if (!template) return null;

  const override = MAP_OVERRIDES[mapId] ?? {};
  const idx = nameIndex(brawlers);

  // Merge tiers
  const mergedTiers: Record<string, Tier> = {
    ...template.tiers,
    ...override.tiers,
  };

  // Merge counters
  const mergedCounters: Record<string, string[]> = {
    ...template.counters,
    ...override.counters,
  };

  // Merge synergies
  const mergedSynergies: Record<string, string[]> = {
    ...template.synergies,
    ...override.synergies,
  };

  // Resolve to IDs
  const tiers: Record<number, Tier> = {};
  for (const [name, tier] of Object.entries(mergedTiers)) {
    const id = idx.get(name);
    if (id !== undefined) tiers[id] = tier;
  }

  const counters: Record<number, number[]> = {};
  for (const [name, counterNames] of Object.entries(mergedCounters)) {
    const id = idx.get(name);
    if (id !== undefined) counters[id] = resolveNames(counterNames, idx);
  }

  const synergies: Record<number, number[]> = {};
  for (const [name, synergyNames] of Object.entries(mergedSynergies)) {
    const id = idx.get(name);
    if (id !== undefined) synergies[id] = resolveNames(synergyNames, idx);
  }

  return { mapId, tiers, counters, synergies };
}
