import axios from "axios";

const BASE_URL = "https://api.jikan.moe/v4";

// Jikan rate-limits: 3 req/sec, 60 req/min. We serialize requests with a small
// gap and an in-memory cache to avoid 429s.
const http = axios.create({ baseURL: BASE_URL, timeout: 20000 });

const MIN_GAP_MS = 450;
let lastSent = 0;
let chain: Promise<unknown> = Promise.resolve();

function throttle<T>(task: () => Promise<T>): Promise<T> {
  const next = chain.then(async () => {
    const wait = Math.max(0, MIN_GAP_MS - (Date.now() - lastSent));
    if (wait > 0) await new Promise((r) => setTimeout(r, wait));
    lastSent = Date.now();
    return task();
  });
  chain = next.catch(() => undefined);
  return next as Promise<T>;
}

const cache = new Map<string, { ts: number; data: unknown }>();
const CACHE_TTL = 60_000;

async function get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
  const key = url + "?" + JSON.stringify(params || {});
  const hit = cache.get(key);
  if (hit && Date.now() - hit.ts < CACHE_TTL) return hit.data as T;

  const data = await throttle(async () => {
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const r = await http.get<T>(url, { params });
        return r.data;
      } catch (e: unknown) {
        const err = e as { response?: { status?: number } };
        if (err.response?.status === 429 && attempt < 2) {
          await new Promise((r) => setTimeout(r, 1500 * (attempt + 1)));
          continue;
        }
        throw e;
      }
    }
    throw new Error("unreachable");
  });
  cache.set(key, { ts: Date.now(), data });
  return data;
}

export type JikanImage = {
  jpg: { image_url: string; small_image_url?: string; large_image_url?: string };
  webp?: { image_url?: string; large_image_url?: string };
};

export type AnimeSummary = {
  mal_id: number;
  title: string;
  title_english?: string | null;
  title_japanese?: string | null;
  images: JikanImage;
  score?: number | null;
  scored_by?: number | null;
  rank?: number | null;
  popularity?: number | null;
  members?: number | null;
  episodes?: number | null;
  type?: string | null;
  status?: string | null;
  year?: number | null;
  season?: string | null;
  rating?: string | null;
  duration?: string | null;
  synopsis?: string | null;
  genres?: { mal_id: number; name: string }[];
  studios?: { mal_id: number; name: string }[];
  trailer?: { youtube_id?: string | null; url?: string | null; embed_url?: string | null };
};

export type AnimeFull = AnimeSummary & {
  background?: string | null;
  source?: string | null;
  aired?: { from?: string; to?: string; string?: string };
  broadcast?: { string?: string };
  themes?: { mal_id: number; name: string }[];
  demographics?: { mal_id: number; name: string }[];
  producers?: { mal_id: number; name: string }[];
  licensors?: { mal_id: number; name: string }[];
  relations?: { relation: string; entry: { mal_id: number; type: string; name: string }[] }[];
  external?: { name: string; url: string }[];
  streaming?: { name: string; url: string }[];
};

export type Pagination = {
  last_visible_page: number;
  has_next_page: boolean;
  current_page: number;
  items?: { count: number; total: number; per_page: number };
};

export type Character = {
  mal_id: number;
  url: string;
  name: string;
  name_kanji?: string | null;
  nicknames?: string[];
  favorites?: number;
  about?: string | null;
  images: JikanImage;
};

export type AnimeCharacter = {
  character: { mal_id: number; name: string; images: JikanImage; url: string };
  role: string;
  voice_actors: { person: { mal_id: number; name: string; images: JikanImage }; language: string }[];
};

export type Genre = { mal_id: number; name: string; count: number };

export type Episode = {
  mal_id: number;
  title: string;
  title_japanese?: string | null;
  aired?: string | null;
  filler?: boolean;
  recap?: boolean;
};

type ListResp<T> = { data: T[]; pagination?: Pagination };
type ItemResp<T> = { data: T };

export const api = {
  topAnime: (page = 1, filter?: "airing" | "upcoming" | "bypopularity" | "favorite") =>
    get<ListResp<AnimeSummary>>(`/top/anime`, { page, limit: 24, filter }),

  seasonNow: (page = 1) =>
    get<ListResp<AnimeSummary>>(`/seasons/now`, { page, limit: 24 }),

  seasonUpcoming: (page = 1) =>
    get<ListResp<AnimeSummary>>(`/seasons/upcoming`, { page, limit: 24 }),

  search: (params: {
    q?: string;
    page?: number;
    limit?: number;
    type?: string;
    status?: string;
    rating?: string;
    genres?: string;
    order_by?: string;
    sort?: "asc" | "desc";
    min_score?: number;
    sfw?: boolean;
  }) => get<ListResp<AnimeSummary>>(`/anime`, { sfw: true, limit: 24, ...params }),

  animeFull: (id: number) =>
    get<ItemResp<AnimeFull>>(`/anime/${id}/full`).then((r) => r.data),

  animeCharacters: (id: number) =>
    get<ListResp<AnimeCharacter>>(`/anime/${id}/characters`).then((r) => r.data),

  animeRecommendations: (id: number) =>
    get<ListResp<{ entry: AnimeSummary }>>(`/anime/${id}/recommendations`).then(
      (r) => r.data.map((d) => d.entry)
    ),

  animeEpisodes: (id: number, page = 1) =>
    get<ListResp<Episode>>(`/anime/${id}/episodes`, { page }),

  genres: () => get<ListResp<Genre>>(`/genres/anime`).then((r) => r.data),

  topCharacters: (page = 1) =>
    get<ListResp<Character>>(`/top/characters`, { page, limit: 24 }),

  character: (id: number) =>
    get<ItemResp<Character>>(`/characters/${id}/full`).then((r) => r.data),

  schedules: (day?: string) =>
    get<ListResp<AnimeSummary>>(`/schedules`, { filter: day, sfw: true, limit: 24 }),
};
