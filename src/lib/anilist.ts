import { GraphQLClient, gql } from "graphql-request";

const endpoint = "https://graphql.anilist.co";

export const anilist = new GraphQLClient(endpoint, {
  headers: { "Content-Type": "application/json", Accept: "application/json" },
});

export type AniListMedia = {
  id: number;
  idMal: number | null;
  title: {
    romaji: string | null;
    english: string | null;
    native: string | null;
    userPreferred: string | null;
  };
  coverImage: {
    extraLarge: string | null;
    large: string | null;
    color: string | null;
  };
  bannerImage: string | null;
  description: string | null;
  episodes: number | null;
  duration: number | null;
  status: string | null;
  season: string | null;
  seasonYear: number | null;
  genres: string[];
  averageScore: number | null;
  popularity: number | null;
  format: string | null;
  studios?: { nodes: { name: string; isAnimationStudio: boolean }[] };
  nextAiringEpisode?: {
    airingAt: number;
    timeUntilAiring: number;
    episode: number;
  } | null;
  trailer?: {
    id: string | null;
    site: string | null;
    thumbnail: string | null;
  } | null;
  characters?: {
    edges: {
      role: string;
      node: {
        id: number;
        name: { full: string };
        image: { large: string | null };
      };
    }[];
  };
  recommendations?: {
    nodes: { mediaRecommendation: AniListMedia | null }[];
  };
  streamingEpisodes?: {
    title: string | null;
    thumbnail: string | null;
    url: string | null;
    site: string | null;
  }[];
  externalLinks?: {
    id: number;
    url: string | null;
    site: string;
    type: string | null;
    language: string | null;
    color: string | null;
    icon: string | null;
  }[];
};

const mediaFragment = gql`
  fragment MediaBase on Media {
    id
    idMal
    title {
      romaji
      english
      native
      userPreferred
    }
    coverImage {
      extraLarge
      large
      color
    }
    bannerImage
    description(asHtml: false)
    episodes
    duration
    status
    season
    seasonYear
    genres
    averageScore
    popularity
    format
    nextAiringEpisode {
      airingAt
      timeUntilAiring
      episode
    }
  }
`;

export async function fetchTrending(perPage = 20): Promise<AniListMedia[]> {
  const query = gql`
    ${mediaFragment}
    query ($perPage: Int) {
      Page(perPage: $perPage) {
        media(sort: TRENDING_DESC, type: ANIME, isAdult: false) {
          ...MediaBase
        }
      }
    }
  `;
  const data = await anilist.request<{ Page: { media: AniListMedia[] } }>(
    query,
    { perPage },
  );
  return data.Page.media;
}

export async function fetchPopular(perPage = 20): Promise<AniListMedia[]> {
  const query = gql`
    ${mediaFragment}
    query ($perPage: Int) {
      Page(perPage: $perPage) {
        media(sort: POPULARITY_DESC, type: ANIME, isAdult: false) {
          ...MediaBase
        }
      }
    }
  `;
  const data = await anilist.request<{ Page: { media: AniListMedia[] } }>(
    query,
    { perPage },
  );
  return data.Page.media;
}

export async function fetchSeasonal(
  season: "WINTER" | "SPRING" | "SUMMER" | "FALL",
  year: number,
  perPage = 20,
): Promise<AniListMedia[]> {
  const query = gql`
    ${mediaFragment}
    query ($season: MediaSeason, $year: Int, $perPage: Int) {
      Page(perPage: $perPage) {
        media(
          season: $season
          seasonYear: $year
          sort: POPULARITY_DESC
          type: ANIME
          isAdult: false
        ) {
          ...MediaBase
        }
      }
    }
  `;
  const data = await anilist.request<{ Page: { media: AniListMedia[] } }>(
    query,
    { season, year, perPage },
  );
  return data.Page.media;
}

export async function fetchRecentlyUpdated(
  perPage = 24,
): Promise<AniListMedia[]> {
  const query = gql`
    ${mediaFragment}
    query ($perPage: Int) {
      Page(perPage: $perPage) {
        media(
          status: RELEASING
          sort: UPDATED_AT_DESC
          type: ANIME
          isAdult: false
        ) {
          ...MediaBase
        }
      }
    }
  `;
  const data = await anilist.request<{ Page: { media: AniListMedia[] } }>(
    query,
    { perPage },
  );
  return data.Page.media;
}

export async function fetchMediaById(id: number): Promise<AniListMedia | null> {
  const query = gql`
    query ($id: Int) {
      Media(id: $id, type: ANIME) {
        id
        idMal
        title {
          romaji
          english
          native
          userPreferred
        }
        coverImage {
          extraLarge
          large
          color
        }
        bannerImage
        description(asHtml: false)
        episodes
        duration
        status
        season
        seasonYear
        genres
        averageScore
        popularity
        format
        studios {
          nodes {
            name
            isAnimationStudio
          }
        }
        nextAiringEpisode {
          airingAt
          timeUntilAiring
          episode
        }
        trailer {
          id
          site
          thumbnail
        }
        characters(sort: ROLE, perPage: 10) {
          edges {
            role
            node {
              id
              name {
                full
              }
              image {
                large
              }
            }
          }
        }
        streamingEpisodes {
          title
          thumbnail
          url
          site
        }
        externalLinks {
          id
          url
          site
          type
          language
          color
          icon
        }
        recommendations(sort: RATING_DESC, perPage: 12) {
          nodes {
            mediaRecommendation {
              id
              idMal
              title {
                romaji
                english
                native
                userPreferred
              }
              coverImage {
                extraLarge
                large
                color
              }
              bannerImage
              description(asHtml: false)
              episodes
              duration
              status
              season
              seasonYear
              genres
              averageScore
              popularity
              format
            }
          }
        }
      }
    }
  `;
  const data = await anilist.request<{ Media: AniListMedia | null }>(query, {
    id,
  });
  return data.Media;
}

export async function searchMedia(
  term: string,
  page = 1,
  perPage = 20,
  genre?: string,
  year?: number,
  season?: string,
  format?: string,
): Promise<{ media: AniListMedia[]; hasNextPage: boolean }> {
  const query = gql`
    ${mediaFragment}
    query (
      $search: String
      $page: Int
      $perPage: Int
      $genre: String
      $year: Int
      $season: MediaSeason
      $format: MediaFormat
    ) {
      Page(page: $page, perPage: $perPage) {
        pageInfo {
          hasNextPage
        }
        media(
          search: $search
          genre: $genre
          seasonYear: $year
          season: $season
          format: $format
          type: ANIME
          isAdult: false
          sort: SEARCH_MATCH
        ) {
          ...MediaBase
        }
      }
    }
  `;
  const data = await anilist.request<{
    Page: { pageInfo: { hasNextPage: boolean }; media: AniListMedia[] };
  }>(query, {
    search: term || undefined,
    page,
    perPage,
    genre: genre || undefined,
    year: year || undefined,
    season: season || undefined,
    format: format || undefined,
  });
  return { media: data.Page.media, hasNextPage: data.Page.pageInfo.hasNextPage };
}

export async function fetchAiringSchedule(weekStart?: number): Promise<
  {
    id: number;
    airingAt: number;
    episode: number;
    media: AniListMedia;
  }[]
> {
  const now = weekStart ?? Math.floor(Date.now() / 1000);
  const weekEnd = now + 7 * 24 * 60 * 60;
  const query = gql`
    query ($start: Int, $end: Int) {
      Page(perPage: 50) {
        airingSchedules(
          airingAt_greater: $start
          airingAt_lesser: $end
          sort: TIME
        ) {
          id
          airingAt
          episode
          media {
            id
            idMal
            title {
              romaji
              english
              native
              userPreferred
            }
            coverImage {
              extraLarge
              large
              color
            }
            bannerImage
            description(asHtml: false)
            episodes
            duration
            status
            season
            seasonYear
            genres
            averageScore
            popularity
            format
            isAdult
          }
        }
      }
    }
  `;
  const data = await anilist.request<{
    Page: {
      airingSchedules: {
        id: number;
        airingAt: number;
        episode: number;
        media: AniListMedia & { isAdult?: boolean };
      }[];
    };
  }>(query, { start: now, end: weekEnd });
  return data.Page.airingSchedules.filter((s) => !s.media.isAdult);
}

export function getCurrentSeason(): "WINTER" | "SPRING" | "SUMMER" | "FALL" {
  const m = new Date().getMonth();
  if (m <= 1 || m === 11) return "WINTER";
  if (m <= 4) return "SPRING";
  if (m <= 7) return "SUMMER";
  return "FALL";
}
