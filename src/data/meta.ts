import type { BrawlerBase, MapMeta, MapMetaByName, Tier } from "@/types";

// ─── Global tier list ────────────────────────────────────────────────────────
// Season 51 — July 2026. Source: spenlc tier list + buffies update

export const GLOBAL_TIERS_BY_NAME: Record<string, Tier> = {
  // S — Current meta dominants (spenlc July 2026, post-buffies update)
  Damian: "S", Colette: "S", Crow: "S", Lumi: "S",
  Mina: "S", Otis: "S", Chester: "S", Pierce: "S",
  Edgar: "S", Mortis: "S", Ruffs: "S",
  "8-Bit": "S", Surge: "S", Meg: "S", Najia: "S",
  // A
  Stu: "A", Shade: "A", Leon: "A", Kit: "A",
  Charlie: "A", Finx: "A", Gene: "A", Angelo: "A",
  Sirius: "A", Max: "A", Kaze: "A", Byron: "A", Melodie: "A",
  // B
  Colt: "B", Bull: "B", Griff: "B", Penny: "B", Lola: "B",
  Brock: "B", Kenji: "B", "Jae-Yong": "B", Belle: "B",
  Bibi: "B", "R-T": "B", Lily: "B", Rico: "B",
  Cordelius: "B", Moe: "B", Poco: "B", "Starr Nova": "B",
  Nani: "B", Fang: "B", Alli: "B",
  // C
  Emz: "C", Sandy: "C", Buster: "C", Barley: "C",
  Hank: "C", Gale: "C", Squeak: "C", Frank: "C",
  Carl: "C", Buzz: "C", Willow: "C", Eve: "C",
  Draco: "C", Clancy: "C", Gray: "C",
  Ollie: "C", Trunk: "C", Amber: "C", Pearl: "C",
  Ziggy: "C", Tick: "C", Bo: "C", Shelly: "C",
  Mandy: "C", Janet: "C", Berry: "C",
  Bonnie: "C", Maisie: "C", Meeple: "C", Bea: "C",
  // D — Weak / falling off / situational at best
  Piper: "D", Spike: "D", Tara: "D", Sam: "D",
  Pam: "D", Ash: "D", Rosa: "D", Dynamike: "D",
  "El Primo": "D", Darryl: "D", Jessie: "D", Jacky: "D",
  "Larry & Lawrie": "D", "Mr. P": "D", Gigi: "D",
  Nita: "D", Doug: "D", Grom: "D", Chuck: "D",
  Sprout: "D", Juju: "D", Gus: "D", Glowy: "D",
  Lou: "D", Mico: "D",
};

export function getGlobalTier(name: string): Tier {
  return GLOBAL_TIERS_BY_NAME[name] ?? "C";
}

// ─── Mode templates ───────────────────────────────────────────────────────────
// Counters: counters[X] = brawlers that counter X
// Synergies: synergies[X] = brawlers that pair well with X

const GEM_GRAB_TEMPLATE = {
  tiers: {
    // S/A global brawlers that work in GG + mode specialists
    Chester: "S", Crow: "S", Colette: "S",
    Edgar: "A", Mortis: "A", Sandy: "A", Gene: "A", Kit: "A", Max: "A",
    Lily: "B", Stu: "B", Emz: "B", Buster: "B", Poco: "B",
    Barley: "B", Ruffs: "B", "Starr Nova": "B", Spike: "B",
    Leon: "C", Bull: "C", Shelly: "C", Rico: "C", Nita: "C",
    Piper: "D", Brock: "D", Bibi: "D", Colt: "D",
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
    // Post-buffies: Max and Meg are top BB picks; assassins dominate
    Mortis: "S", Edgar: "S", Damian: "S", Max: "S", Meg: "S",
    Colette: "A", Chester: "A", Colt: "A", Bibi: "A", Kit: "A", Stu: "A", Fang: "A",
    Leon: "B", Bull: "B", Buster: "B", Surge: "B", Sam: "B", Frank: "B", Crow: "B", Spike: "B",
    Emz: "C", Sandy: "C", Bo: "C", Gene: "C", Poco: "C",
    Piper: "D", Brock: "D", Barley: "D",
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
    // 8-Bit and Surge are top 3 globally with buffies; Heist is their best mode
    "8-Bit": "S", Surge: "S", Colette: "S",
    Colt: "A", Chester: "A", Edgar: "A", Kaze: "A", Rico: "A", Bull: "A", Bibi: "A", Brock: "A", Melodie: "A",
    Griff: "B", Nita: "B", Jessie: "B", Barley: "B", Penny: "B", Mortis: "B", Sam: "B",
    Spike: "C", "El Primo": "C", Dynamike: "C", Tick: "C",
    Piper: "D", Gene: "D", Sandy: "D", Crow: "D",
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
    // Meta S-tiers lead; Colt is a Heist pick not Bounty; Mandy is F tier
    Crow: "S", Chester: "S", Damian: "S",
    Mina: "A", Mortis: "A", Leon: "A", Gene: "A", "Jae-Yong": "A", Colette: "A",
    Piper: "A", Brock: "A", Belle: "A",
    Byron: "A",
    Nani: "B", Angelo: "B", Bo: "B", Rico: "B", Carl: "B", Barley: "B", Cordelius: "B", Spike: "B",
    Stu: "C", Sandy: "C", Colt: "C", Tick: "C", Mandy: "C",
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
    // Chester/Crow S; Damian/Mina excellent; Stu/Kit/Gene specifically strong in KO
    Chester: "S", Crow: "S",
    Damian: "A", Mina: "A", Stu: "A", Kit: "A", Leon: "A", Colette: "A", Gene: "A", Byron: "A",
    Piper: "B", Brock: "B", Spike: "B", Cordelius: "B", Belle: "B", Colt: "B", Angelo: "B",
    Bo: "C", Gray: "C", Tick: "C", Carl: "C", Rico: "C", Barley: "C", Emz: "C", Mandy: "C",
    Bull: "D", "El Primo": "D", Bibi: "D", Mortis: "D",
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
    // Meg is S in HZ with buffies; Finx's best mode is HZ
    Colette: "S", Damian: "S", Chester: "S", Meg: "S",
    Sandy: "A", Emz: "A", Finx: "A", "Larry & Lawrie": "A", Juju: "A", Poco: "A",
    Pam: "B", Draco: "B", Tara: "B", Buster: "B", Barley: "B", Spike: "B", Frank: "B", Ruffs: "B",
    Mortis: "C", Edgar: "C", Leon: "C", Bibi: "C", Sprout: "C", Gale: "C",
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
  // Shooting Star (15000005) — very open, long range matters but meta picks still lead
  15000005: {
    tiers: { Crow: "S", Chester: "S", Piper: "A", Brock: "A", Colt: "B", Bo: "D", Mandy: "D", Angelo: "D" },
  },
  // Hideout (15000022) — bushy flanks
  15000022: {
    tiers: { Leon: "S", Crow: "S", Sandy: "A" },
  },
  // Layer Cake (15000082) — layered platforms
  15000082: {
    tiers: { Brock: "B", Belle: "D", Bo: "C", Mandy: "D" },
  },
  // Dry Season (15000083) — very open desert, long-range gets a small boost
  15000083: {
    tiers: { Piper: "B", Belle: "A", Nani: "A" },
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
