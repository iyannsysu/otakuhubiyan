/**
 * Consumet API client.
 *
 * Consumet aggregates multiple anime streaming providers (zoro/aniwatch, gogoanime, animepahe, ...)
 * and normalizes their APIs. It also has meta providers (e.g. anilist) that map AniList IDs to
 * provider-specific stream IDs automatically.
 *
 * The public demo (`https://api.consumet.org`) is frequently rate limited / down. For production,
 * self-host https://github.com/consumet/api or point at a community mirror via
 * `NEXT_PUBLIC_CONSUMET_URL`.
 */
const BASE_URL =
  process.env.NEXT_PUBLIC_CONSUMET_URL?.replace(/\/$/, "") ||
  "https://api.consumet.org";

export type ConsumetEpisode = {
  id: string;
  title?: string | null;
  description?: string | null;
  number: number;
  image?: string | null;
  airDate?: string | null;
  isFiller?: boolean;
};

export type ConsumetInfo = {
  id: string;
  title: string | { english?: string; romaji?: string };
  episodes: ConsumetEpisode[];
  totalEpisodes?: number;
  image?: string | null;
};

export type ConsumetSource = {
  url: string;
  isM3U8?: boolean;
  quality?: string;
};

export type ConsumetSubtitle = {
  url: string;
  lang: string;
};

export type ConsumetStream = {
  sources: ConsumetSource[];
  subtitles?: ConsumetSubtitle[];
  headers?: Record<string, string>;
  download?: string;
};

async function consumetFetch<T>(path: string): Promise<T> {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, {
    next: { revalidate: 60 * 30 },
    headers: { accept: "application/json" },
  });
  if (!res.ok) {
    throw new Error(`Consumet ${res.status}: ${url}`);
  }
  return (await res.json()) as T;
}

/**
 * Fetch episode list by AniList ID using Consumet's meta/anilist route.
 * Uses the `zoro` provider by default because it is the most reliable and usually
 * has embedded soft subtitles.
 */
export async function fetchEpisodesByAnilistId(
  anilistId: number,
  provider: "zoro" | "gogoanime" | "animepahe" = "zoro",
): Promise<ConsumetInfo | null> {
  try {
    const data = await consumetFetch<ConsumetInfo>(
      `/meta/anilist/info/${anilistId}?provider=${provider}`,
    );
    return data;
  } catch {
    return null;
  }
}

export async function fetchStream(
  episodeId: string,
  provider: "zoro" | "gogoanime" | "animepahe" = "zoro",
): Promise<ConsumetStream | null> {
  try {
    const data = await consumetFetch<ConsumetStream>(
      `/meta/anilist/watch/${encodeURIComponent(episodeId)}?provider=${provider}`,
    );
    return data;
  } catch {
    return null;
  }
}

export function pickBestSource(sources: ConsumetSource[]): ConsumetSource | null {
  if (!sources || sources.length === 0) return null;
  const preferredOrder = ["default", "auto", "1080p", "720p", "480p", "360p"];
  for (const q of preferredOrder) {
    const match = sources.find((s) => (s.quality || "").toLowerCase() === q);
    if (match) return match;
  }
  return sources[0];
}
