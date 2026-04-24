import { NextResponse } from "next/server";
import { fetchAiringSchedule } from "@/lib/anilist";

/**
 * Lightweight JSON endpoint for the 7-day airing schedule.
 * Useful for: clients that want to refresh daily without re-rendering the page,
 * or a Vercel Cron hitting this endpoint to warm the AniList cache.
 */
export async function GET() {
  try {
    const schedule = await fetchAiringSchedule();
    return NextResponse.json(
      { schedule, updatedAt: new Date().toISOString() },
      {
        headers: {
          "cache-control":
            "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      },
    );
  } catch (e) {
    return NextResponse.json(
      { error: (e as Error).message },
      { status: 502 },
    );
  }
}
