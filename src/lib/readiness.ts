import type { BrawlerBase, RosterEntry } from "@/types";
import { brawlerHasBuffies } from "@/data/hypercharges";

/** Returns a 0–100 readiness score for a brawler entry */
export function readinessScore(entry: RosterEntry, brawler: BrawlerBase): number {
  let score = 0;
  let total = 0;

  // Power level (max 11) — 40 points
  total += 40;
  score += Math.round((entry.powerLevel / 11) * 40);

  // Gadgets — 20 points
  if (brawler.gadgets.length > 0) {
    total += 20;
    score += Math.round((entry.gadgetsOwned.length / brawler.gadgets.length) * 20);
  }

  // Star powers — 20 points
  if (brawler.starPowers.length > 0) {
    total += 20;
    score += Math.round((entry.starPowersOwned.length / brawler.starPowers.length) * 20);
  }

  // Hypercharge — 10 points
  total += 10;
  if (entry.hasHypercharge) score += 10;

  // Buffies — 10 points
  if (brawlerHasBuffies(brawler.name)) {
    total += 10;
    const buffieCount = [entry.hasGadgetBuffie, entry.hasStarBuffie, entry.hasHyperBuffie].filter(Boolean).length;
    score += Math.round((buffieCount / 3) * 10);
  }

  return Math.round((score / total) * 100);
}

export function readinessColour(score: number): string {
  if (score >= 80) return "text-green-400";
  if (score >= 50) return "text-yellow-400";
  return "text-red-400";
}
