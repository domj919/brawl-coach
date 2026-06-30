import type {
  BrawlerBase,
  DraftState,
  MapMeta,
  Recommendation,
  Roster,
  Tier,
} from "@/types";
import { getGlobalTier } from "@/data/meta";

const TIER_SCORE: Record<Tier, number> = { S: 100, A: 80, B: 60, C: 40, D: 20 };

const RECOMMENDED_POWER = 9;

export function recommend(
  draft: DraftState,
  roster: Roster,
  allBrawlers: BrawlerBase[],
  meta: MapMeta | null
): Recommendation[] {
  const pickedIds = new Set([...draft.allyPicks, ...draft.enemyPicks, ...draft.bans]);
  const ownedIds = Object.keys(roster).map(Number);

  const results: Recommendation[] = [];

  for (const brawler of allBrawlers) {
    const id = brawler.id;
    if (!ownedIds.includes(id)) continue;
    if (pickedIds.has(id)) continue;

    const entry = roster[id];
    const reasons: string[] = [];
    const warnings: string[] = [];
    let score = 50;

    // ── Tier (map-specific if available, else global) ─────────────────────
    const tier: Tier = meta?.tiers[id] ?? getGlobalTier(brawler.name);
    const tierScore = TIER_SCORE[tier];
    score += (tierScore - 50) * 0.5;
    if (meta?.tiers[id]) {
      reasons.push(`${tier}-tier on this map`);
    } else {
      reasons.push(`${tier}-tier globally (no map data yet)`);
    }

    if (meta) {
      // ── Counter bonus ──────────────────────────────────────────────────
      const countersEnemies = draft.enemyPicks.filter((eid) =>
        meta.counters[eid]?.includes(id)
      );
      if (countersEnemies.length > 0) {
        score += countersEnemies.length * 10;
        const names = countersEnemies
          .map((eid) => allBrawlers.find((b) => b.id === eid)?.name ?? eid)
          .join(", ");
        reasons.push(`Counters ${names}`);
      }

      // ── Counter penalty ────────────────────────────────────────────────
      const counteredByEnemies = draft.enemyPicks.filter((eid) =>
        meta.counters[id]?.includes(eid)
      );
      if (counteredByEnemies.length > 0) {
        score -= counteredByEnemies.length * 12;
        const names = counteredByEnemies
          .map((eid) => allBrawlers.find((b) => b.id === eid)?.name ?? eid)
          .join(", ");
        warnings.push(`Countered by ${names}`);
      }

      // ── Synergy bonus ──────────────────────────────────────────────────
      const synergiesWithAllies = draft.allyPicks.filter((aid) =>
        meta.synergies[aid]?.includes(id)
      );
      if (synergiesWithAllies.length > 0) {
        score += synergiesWithAllies.length * 8;
        const names = synergiesWithAllies
          .map((aid) => allBrawlers.find((b) => b.id === aid)?.name ?? aid)
          .join(", ");
        reasons.push(`Synergises with ${names}`);
      }
    }

    // ── Roster quality ────────────────────────────────────────────────────
    if (entry.powerLevel >= 11) {
      score += 5;
      reasons.push("Max power level");
    } else if (entry.powerLevel < RECOMMENDED_POWER) {
      score -= 5;
      warnings.push(`Power level ${entry.powerLevel} — recommend upgrading to ${RECOMMENDED_POWER}+`);
    }

    if (brawler.gadgets.length > 0 && entry.gadgetsOwned.length === 0) {
      warnings.push("No gadgets unlocked");
    }
    if (brawler.starPowers.length > 0 && entry.starPowersOwned.length === 0 && entry.powerLevel >= 9) {
      warnings.push("No star power unlocked");
    }

    // ── Buffies ───────────────────────────────────────────────────────────
    if (entry.hasHypercharge) {
      score += 3;
      reasons.push("Hypercharge available");
    }
    if (entry.hasGadgetBuffie) {
      score += 2;
      reasons.push("Gadget Buffie active");
    }
    if (entry.hasStarBuffie) {
      score += 2;
      reasons.push("Star Buffie active");
    }
    if (entry.hasHyperBuffie) {
      score += 3;
      reasons.push("Hyper Buffie active");
    }

    results.push({
      brawlerId: id,
      score: Math.round(Math.min(100, Math.max(0, score))),
      tier: scoreToTier(score),
      reasons,
      warnings,
    });
  }

  return results.sort((a, b) => b.score - a.score);
}

function scoreToTier(score: number): Tier {
  if (score >= 85) return "S";
  if (score >= 70) return "A";
  if (score >= 55) return "B";
  if (score >= 40) return "C";
  return "D";
}
