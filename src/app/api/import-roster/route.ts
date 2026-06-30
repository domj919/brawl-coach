import { NextRequest, NextResponse } from "next/server";
import type { Roster, RosterEntry } from "@/types";

// Use Railway proxy (fixed IP, no IP restriction issues) if configured, else official API
const BS_BASE = process.env.BS_PROXY_URL
  ? `${process.env.BS_PROXY_URL}/v1`
  : "https://api.brawlstars.com/v1";

interface BSGear {
  id: number;
  name: string;
  level: number;
}

interface BSStarPower {
  id: number;
  name: string;
}

interface BSGadget {
  id: number;
  name: string;
}

interface BSBrawler {
  id: number;
  name: string;
  power: number;
  rank: number;
  trophies: number;
  highestTrophies: number;
  gears: BSGear[];
  starPowers: BSStarPower[];
  gadgets: BSGadget[];
}

interface BSPlayer {
  tag: string;
  name: string;
  brawlers: BSBrawler[];
}

export async function GET(req: NextRequest) {
  const tag = req.nextUrl.searchParams.get("tag");
  if (!tag) return NextResponse.json({ error: "Missing tag parameter" }, { status: 400 });

  const encoded = encodeURIComponent(tag.startsWith("#") ? tag : `#${tag}`);

  const useProxy = !!process.env.BS_PROXY_URL;
  const headers: Record<string, string> = {};
  if (!useProxy) {
    const apiKey = process.env.BRAWLSTARS_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "API not configured" }, { status: 500 });
    headers["Authorization"] = `Bearer ${apiKey}`;
  }

  const res = await fetch(`${BS_BASE}/players/${encoded}`, { headers, cache: "no-store" });

  if (!res.ok) {
    const body = await res.text();
    const detail = (() => { try { return JSON.parse(body); } catch { return body; } })();
    return NextResponse.json({ error: `Brawl Stars API error ${res.status}`, detail }, { status: res.status });
  }

  const player: BSPlayer = await res.json();

  const roster: Roster = {};
  for (const b of player.brawlers) {
    const entry: RosterEntry = {
      brawlerId: b.id,
      powerLevel: Math.min(11, Math.max(1, b.power)) as RosterEntry["powerLevel"],
      gadgetsOwned: b.gadgets.map((g) => g.id),
      starPowersOwned: b.starPowers.map((sp) => sp.id),
      gearsOwned: b.gears.map((g) => ({ gearId: g.id, level: Math.min(3, Math.max(1, g.level)) as 1 | 2 | 3 })),
      hasHypercharge: false,    // not exposed in the API
      hasGadgetBuffie: false,   // set manually in roster
      hasStarBuffie: false,
      hasHyperBuffie: false,
    };
    roster[b.id] = entry;
  }

  return NextResponse.json({ playerName: player.name, playerTag: player.tag, roster });
}
