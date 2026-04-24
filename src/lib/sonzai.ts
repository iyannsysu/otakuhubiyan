// Sonzai X API client — fan-sub Indonesian streaming sources.
// https://api.sonzaix.indevs.in/
//
// We use two providers:
//   - `samehada` (Samehadaku): richer metadata, direct MP4 streams (Wibufile)
//   - `anime`    (Anime Lover V3): fallback; also direct MP4 (animekita/pixeldrain)
//
// The public endpoints are unauthenticated and CORS-enabled, so we can call
// them straight from the browser. We still cache locally to be nice to the host.

import axios from "axios";

const BASE_URL = "https://api.sonzaix.indevs.in";
const http = axios.create({ baseURL: BASE_URL, timeout: 25_000 });

const cache = new Map<string, { ts: number; data: unknown }>();
const CACHE_TTL = 5 * 60_000;

async function get<T>(path: string, params?: Record<string, unknown>): Promise<T> {
  const key = path + "?" + JSON.stringify(params || {});
  const hit = cache.get(key);
  if (hit && Date.now() - hit.ts < CACHE_TTL) return hit.data as T;
  const r = await http.get<T>(path, { params });
  cache.set(key, { ts: Date.now(), data: r.data });
  return r.data;
}

// ---------- Shared normalized types ----------

export type SonzaiProvider = "samehada" | "anime";

export type SonzaiSearchResult = {
  provider: SonzaiProvider;
  slug: string;
  title: string;
  thumbnail?: string;
  type?: string;
  score?: string | number;
  status?: string;
  synopsis?: string;
  genres?: string[];
};

export type SonzaiEpisode = {
  episode: string;
  title?: string;
  slug: string; // opaque, passed back to getStream
  date?: string;
};

export type SonzaiStreamSource = {
  server: string;
  url: string;
  quality?: string; // e.g. "360p", "720p"
  kind: "mp4" | "iframe";
};

export type SonzaiDetail = {
  provider: SonzaiProvider;
  title: string;
  thumbnail?: string;
  synopsis?: string;
  rating?: string;
  genres?: string[];
  episodes: SonzaiEpisode[];
};

// ---------- Samehadaku raw types ----------

type SamehadaSearchRaw = {
  status: boolean;
  total_results?: number;
  data?: Array<{
    slug: string;
    title: string;
    thumbnail?: string;
    score?: string;
    type?: string;
    status?: string;
    synopsis?: string;
    genres?: string[];
    episodes?: Array<{
      episode: string;
      title?: string;
      slug_episode: string;
      date?: string;
    }>;
  }>;
};

type SamehadaDetailRaw = {
  status: boolean;
  data?: {
    title: string;
    thumbnail?: string;
    synopsis?: string;
    rating?: string;
    genres?: string[];
    episodes?: Array<{
      episode: string;
      title?: string;
      slug_episode: string;
      date?: string;
    }>;
  };
};

type SamehadaStreamRaw = {
  status: boolean;
  data?: Array<{ server: string; url: string }>;
};

// ---------- Anime Lover V3 raw types ----------

type AnimeSearchRaw = {
  data?: Array<{
    result?: Array<{
      id?: string | number;
      url: string;
      judul: string;
      cover?: string;
      genre?: string[];
      sinopsis?: string;
    }>;
  }>;
};

type AnimeDetailRaw = {
  data?: Array<{
    judul: string;
    cover?: string;
    sinopsis?: string;
    rating?: string;
    status?: string;
    genre?: string[];
    chapter?: Array<{
      id: number;
      ch: string;
      url: string;
      date?: string;
    }>;
  }>;
};

type AnimeStreamRaw = {
  data?: Array<{
    streams?: Record<
      string,
      Array<{ link: string; reso?: string; size_kb?: number | null }>
    >;
  }>;
};

// ---------- Helpers ----------

const IFRAME_HOSTS = [
  "blogger.com",
  "mega.nz",
  "filedon.co",
  "wibufile.com/embed",
];

function classifyUrl(url: string): "mp4" | "iframe" {
  if (/\.mp4($|\?)/i.test(url)) return "mp4";
  if (IFRAME_HOSTS.some((h) => url.includes(h))) return "iframe";
  // storage.animekita.org returns application/octet-stream MP4s
  if (/storage\.animekita\.org\/.+\.mp4/i.test(url)) return "mp4";
  // pixeldrain direct file links play natively
  if (/pixeldrain\.com\/api\/file\//i.test(url)) return "mp4";
  // Fallback: assume iframe if we can't tell
  return "iframe";
}

function qualityOf(server: string): string | undefined {
  const m = server.match(/(\d{3,4}p)/i);
  return m ? m[1].toLowerCase() : undefined;
}

function normalizeTitle(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\bsub\s*indo\b/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Crude similarity score — Jaccard on normalized word sets. */
function similarity(a: string, b: string): number {
  const A = new Set(normalizeTitle(a).split(" ").filter(Boolean));
  const B = new Set(normalizeTitle(b).split(" ").filter(Boolean));
  if (A.size === 0 || B.size === 0) return 0;
  let inter = 0;
  A.forEach((w) => B.has(w) && inter++);
  const union = A.size + B.size - inter;
  return inter / union;
}

// ---------- Samehadaku ----------

async function samehadaSearch(query: string): Promise<SonzaiSearchResult[]> {
  const raw = await get<SamehadaSearchRaw>("/samehada", { search: query });
  return (raw.data ?? []).map((r) => ({
    provider: "samehada" as const,
    slug: r.slug,
    title: r.title,
    thumbnail: r.thumbnail,
    score: r.score,
    type: r.type,
    status: r.status,
    synopsis: r.synopsis,
    genres: r.genres,
  }));
}

async function samehadaDetail(slug: string): Promise<SonzaiDetail> {
  const raw = await get<SamehadaDetailRaw>("/samehada", { detail: slug });
  const d = raw.data;
  if (!d) throw new Error("Samehadaku: no detail data");
  return {
    provider: "samehada",
    title: d.title,
    thumbnail: d.thumbnail,
    synopsis: d.synopsis,
    rating: d.rating,
    genres: d.genres,
    episodes: (d.episodes ?? []).map((e) => ({
      episode: e.episode,
      title: e.title,
      slug: e.slug_episode,
      date: e.date,
    })),
  };
}

async function samehadaStream(episodeSlug: string): Promise<SonzaiStreamSource[]> {
  const raw = await get<SamehadaStreamRaw>("/samehada", { stream: episodeSlug });
  return (raw.data ?? []).map((s) => ({
    server: s.server,
    url: s.url,
    quality: qualityOf(s.server),
    kind: classifyUrl(s.url),
  }));
}

// ---------- Anime Lover V3 ----------

async function animeSearch(query: string): Promise<SonzaiSearchResult[]> {
  const raw = await get<AnimeSearchRaw>("/anime/search", { query, page: 1 });
  const items = raw.data?.[0]?.result ?? [];
  return items.map((r) => ({
    provider: "anime" as const,
    slug: r.url,
    title: r.judul,
    thumbnail: r.cover,
    synopsis: r.sinopsis,
    genres: r.genre,
  }));
}

async function animeDetail(slug: string): Promise<SonzaiDetail> {
  const raw = await get<AnimeDetailRaw>("/anime/detail", { series: slug });
  const d = raw.data?.[0];
  if (!d) throw new Error("Anime Lover: no detail data");
  return {
    provider: "anime",
    title: d.judul,
    thumbnail: d.cover,
    synopsis: d.sinopsis,
    rating: d.rating,
    genres: d.genre,
    episodes: (d.chapter ?? []).map((c) => ({
      episode: c.ch,
      slug: c.url,
      date: c.date,
    })),
  };
}

async function animeStream(
  episodeSlug: string,
  series: string,
): Promise<SonzaiStreamSource[]> {
  // Anime Lover needs all three params; episode number can be derived from slug suffix.
  const m = episodeSlug.match(/-(\d+)$/);
  const episode = m ? Number(m[1]) : 1;
  const raw = await get<AnimeStreamRaw>("/anime/stream", {
    slug: episodeSlug,
    series,
    episode,
  });
  const streams = raw.data?.[0]?.streams ?? {};
  const out: SonzaiStreamSource[] = [];
  Object.entries(streams).forEach(([reso, arr]) => {
    (arr ?? []).forEach((s, idx) => {
      out.push({
        server: idx === 0 ? `Server ${reso}` : `Mirror ${idx} ${reso}`,
        url: s.link,
        quality: reso,
        kind: classifyUrl(s.link),
      });
    });
  });
  return out;
}

// ---------- Public facade ----------

/**
 * Search both providers in parallel and return results ranked by title
 * similarity to the query. Samehadaku is preferred when the score is close
 * because it gives us real metadata and direct MP4 streams.
 */
export async function searchAnime(query: string): Promise<SonzaiSearchResult[]> {
  const [a, b] = await Promise.allSettled([
    samehadaSearch(query),
    animeSearch(query),
  ]);
  const flat: SonzaiSearchResult[] = [];
  if (a.status === "fulfilled") flat.push(...a.value);
  if (b.status === "fulfilled") flat.push(...b.value);

  // Rank by similarity; prefer samehada when within 0.1 of the best.
  return flat
    .map((r) => ({ r, s: similarity(r.title, query) }))
    .sort((a, b) => {
      if (Math.abs(a.s - b.s) < 0.1) {
        if (a.r.provider === "samehada" && b.r.provider !== "samehada") return -1;
        if (b.r.provider === "samehada" && a.r.provider !== "samehada") return 1;
      }
      return b.s - a.s;
    })
    .map((x) => x.r);
}

export async function getDetail(
  slug: string,
  provider: SonzaiProvider,
): Promise<SonzaiDetail> {
  if (provider === "samehada") return samehadaDetail(slug);
  return animeDetail(slug);
}

export async function getStream(
  episodeSlug: string,
  provider: SonzaiProvider,
  seriesSlug?: string,
): Promise<SonzaiStreamSource[]> {
  if (provider === "samehada") return samehadaStream(episodeSlug);
  if (!seriesSlug) throw new Error("Anime Lover requires seriesSlug");
  return animeStream(episodeSlug, seriesSlug);
}

/**
 * Attempt to resolve an English/romaji/Japanese title list to the best Sonzai match.
 * Returns the first result whose similarity is above the threshold.
 */
export async function resolveByTitles(
  titles: Array<string | null | undefined>,
  threshold = 0.35,
): Promise<SonzaiSearchResult | null> {
  const nonEmpty = titles.filter(Boolean) as string[];
  for (const q of nonEmpty) {
    const results = await searchAnime(q);
    if (results.length > 0 && similarity(results[0].title, q) >= threshold) {
      return results[0];
    }
  }
  // Last-ditch: return whatever came back from the first non-empty query.
  if (nonEmpty.length > 0) {
    const results = await searchAnime(nonEmpty[0]);
    return results[0] ?? null;
  }
  return null;
}
