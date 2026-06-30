import type { BrawlerBase, BrawlerClass, GameMode } from "@/types";

/** Roles we check for in a team composition */
export type TeamRole = "Healer" | "Tank" | "Zone Control" | "Assassin" | "Sniper" | "Thrower";

const CLASS_ROLES: Partial<Record<BrawlerClass, TeamRole[]>> = {
  Support:        ["Healer"],
  Tank:           ["Tank"],
  Controller:     ["Zone Control"],
  Assassin:       ["Assassin"],
  Marksman:       ["Sniper"],
  Artillery:      ["Thrower"],
};

// Named brawlers that fill roles regardless of their class tag
const NAMED_ROLES: Record<string, TeamRole[]> = {
  Poco:   ["Healer"], Pam:    ["Healer"], Byron:  ["Healer"],
  Gus:    ["Healer"], Gene:   ["Healer"], Max:    ["Healer"],
  Sandy:  ["Zone Control"], Emz: ["Zone Control"], Sprout: ["Zone Control", "Thrower"],
  Barley: ["Thrower"], Dynamike: ["Thrower"], Tick: ["Thrower"],
  Grom:   ["Thrower"], "Larry & Lawrie": ["Zone Control"],
  Bull:   ["Tank"], "El Primo": ["Tank"], Frank: ["Tank"], Jacky: ["Tank"],
  Darryl: ["Tank"], Rosa: ["Tank"], Ash: ["Tank"],
  Mortis: ["Assassin"], Edgar: ["Assassin"], Leon: ["Assassin"],
  Crow:   ["Assassin"], Fang: ["Assassin"], Mico: ["Assassin"],
  Cordelius: ["Assassin"], Charlie: ["Assassin"],
  Piper:  ["Sniper"], Brock: ["Sniper"], Belle: ["Sniper"],
  Angelo: ["Sniper"], Mandy: ["Sniper"], Nani: ["Sniper"],
};

export function getRoles(brawler: BrawlerBase): TeamRole[] {
  const named = NAMED_ROLES[brawler.name];
  if (named) return named;
  return CLASS_ROLES[brawler.class] ?? [];
}

/** Roles that are nice-to-have per mode */
const MODE_DESIRED_ROLES: Partial<Record<GameMode, TeamRole[]>> = {
  "Gem Grab":  ["Healer", "Zone Control"],
  "Brawl Ball": ["Tank", "Assassin"],
  "Heist":     ["Tank"],
  "Hot Zone":  ["Healer", "Zone Control"],
  "Bounty":    ["Sniper"],
  "Knockout":  ["Sniper"],
  "Wipeout":   ["Sniper"],
};

export interface RoleWarning {
  role: TeamRole;
  message: string;
}

export function getRoleWarnings(
  allyPicks: number[],
  allBrawlers: BrawlerBase[],
  mode: GameMode | undefined
): RoleWarning[] {
  if (!mode) return [];
  const desired = MODE_DESIRED_ROLES[mode] ?? [];
  if (!desired.length) return [];

  const teamRoles = new Set<TeamRole>();
  for (const id of allyPicks) {
    const b = allBrawlers.find((x) => x.id === id);
    if (b) getRoles(b).forEach((r) => teamRoles.add(r));
  }

  return desired
    .filter((r) => !teamRoles.has(r))
    .map((r) => ({ role: r, message: `No ${r.toLowerCase()} in your team` }));
}
