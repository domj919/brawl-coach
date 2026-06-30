import { NextResponse } from "next/server";
import { fetchBrawlers } from "@/lib/brawlify";

export async function GET() {
  try {
    const brawlers = await fetchBrawlers();
    return NextResponse.json(brawlers);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
