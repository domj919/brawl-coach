import { NextRequest, NextResponse } from "next/server";
import type { Roster, RosterEntry } from "@/types";

const BS_BASE = "https://api.brawlstars.com/v1";

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

  const apiKey = process.env.BRAWLSTARS_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "API key not configured" }, { status: 500 });

  // Tags may include # — encode it
  const encoded = encodeURIComponent(tag.startsWith("#") ? tag : `#${tag}`);

  const res = await fetch(`${BS_BASE}/players/${encoded}`, {
    headers: { Authorization: `Bearer ${apiKey}` },
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.text();
    return NextResponse.json({ error: `Brawl Stars API error ${res.status}`, detail: body }, { status: res.status });
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
