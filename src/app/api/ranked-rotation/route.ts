import { NextResponse } from "next/server";
import { fetchRankedRotation } from "@/lib/brawlify";

export async function GET() {
  try {
    const maps = await fetchRankedRotation();
    return NextResponse.json(maps);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
