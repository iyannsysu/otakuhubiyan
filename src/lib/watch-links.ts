/**
 * Deep-link builders for legal anime streaming services.
 *
 * We no longer aggregate video scrapers (see docs/streaming.md) — most were
 * taken down by DMCA in 2026. Instead, OtakuHub acts as a discovery layer and
 * sends users to legitimate services via search URLs.
 *
 * AniList exposes two richer data sources when available:
 *   - `externalLinks` — canonical per-media links (Crunchyroll, Bstation, etc.)
 *   - `streamingEpisodes` — per-episode direct links to those same services.
 *
 * When neither is populated we fall back to generic search URLs below.
 */

export type WatchPlatform = {
  key: string;
  name: string;
  color: string;
  /** Build a URL that searches the platform by anime title. */
  search: (title: string) => string;
};

export const FALLBACK_PLATFORMS: WatchPlatform[] = [
  {
    key: "bstation",
    name: "Bstation",
    color: "#00aeec",
    search: (q) =>
      `https://www.bilibili.tv/id/search-result?keyword=${encodeURIComponent(q)}`,
  },
  {
    key: "crunchyroll",
    name: "Crunchyroll",
    color: "#f47521",
    search: (q) =>
      `https://www.crunchyroll.com/search?q=${encodeURIComponent(q)}`,
  },
  {
    key: "netflix",
    name: "Netflix",
    color: "#e50914",
    search: (q) =>
      `https://www.netflix.com/search?q=${encodeURIComponent(q)}`,
  },
  {
    key: "iqiyi",
    name: "iQIYI",
    color: "#00be06",
    search: (q) =>
      `https://www.iq.com/search?query=${encodeURIComponent(q)}`,
  },
  {
    key: "youtube",
    name: "YouTube",
    color: "#ff0000",
    search: (q) =>
      `https://www.youtube.com/results?search_query=${encodeURIComponent(
        `${q} anime full episode`,
      )}`,
  },
];

/**
 * AniList `externalLinks` include a mix of streaming, info, and social sites.
 * This set narrows to actual streaming platforms.
 */
const STREAMING_SITES = new Set([
  "Crunchyroll",
  "Bilibili TV",
  "Bstation",
  "Bilibili",
  "Netflix",
  "iQIYI",
  "Hulu",
  "HIDIVE",
  "Amazon Prime Video",
  "Disney Plus",
  "Animelab",
  "VRV",
  "Funimation",
  "Tubi TV",
  "Youtube",
  "YouTube",
]);

export type StreamingExternalLink = {
  site: string;
  url: string;
  color: string | null;
  icon: string | null;
};

export function filterStreamingLinks(
  links:
    | {
        site: string;
        url: string | null;
        type: string | null;
        color: string | null;
        icon: string | null;
      }[]
    | undefined,
): StreamingExternalLink[] {
  if (!links?.length) return [];
  return links
    .filter((l): l is StreamingExternalLink & { type: string | null } => {
      if (!l.url) return false;
      if (l.type === "STREAMING") return true;
      return STREAMING_SITES.has(l.site);
    })
    .map((l) => ({ site: l.site, url: l.url, color: l.color, icon: l.icon }));
}
