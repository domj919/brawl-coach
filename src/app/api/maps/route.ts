import { NextResponse } from "next/server";
import { fetchMaps } from "@/lib/brawlify";

export async function GET() {
  try {
    const maps = await fetchMaps();
    return NextResponse.json(maps);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
