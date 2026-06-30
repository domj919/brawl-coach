/**
 * Brawlers that have Buffies available in ranked (Season 51, June 2026).
 * Confirmed by user. Update this list each season as new Buffies are added.
 */
export const BRAWLERS_WITH_BUFFIES = new Set<string>([
  "Max", "Surge", "Meg", "Brock", "8-Bit", "Rico", "Edgar", "Colette",
  "Griff", "Bo", "Nita", "Leon", "Emz", "Frank", "Mortis", "Bibi",
  "Crow", "Bull", "Shelly", "Colt", "Spike",
]);

export function brawlerHasBuffies(name: string): boolean {
  return BRAWLERS_WITH_BUFFIES.has(name);
}
