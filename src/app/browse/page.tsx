import {
  fetchPopular,
  fetchTrending,
  fetchRecentlyUpdated,
  fetchSeasonal,
  searchMedia,
  getCurrentSeason,
} from "@/lib/anilist";
import { AnimeCard } from "@/components/anime-card";

export const metadata = { title: "Jelajah Anime" };
export const revalidate = 1800;

type SearchParams = {
  sort?: "trending" | "popular" | "updated" | "seasonal";
  genre?: string;
  season?: string;
  year?: string;
};

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const sort = sp.sort || "trending";

  let media = [] as Awaited<ReturnType<typeof fetchPopular>>;
  let title = "Trending Minggu Ini";

  if (sp.genre) {
    const r = await searchMedia("", 1, 36, sp.genre);
    media = r.media;
    title = `Genre: ${sp.genre}`;
  } else if (sort === "popular") {
    media = await fetchPopular(36);
    title = "Paling Populer";
  } else if (sort === "updated") {
    media = await fetchRecentlyUpdated(36);
    title = "Episode Terbaru";
  } else if (sort === "seasonal" || sp.season) {
    const season = (sp.season as "WINTER" | "SPRING" | "SUMMER" | "FALL") || getCurrentSeason();
    const year = sp.year ? Number(sp.year) : new Date().getFullYear();
    media = await fetchSeasonal(season, year, 36);
    title = `Anime Musim ${season[0]}${season.slice(1).toLowerCase()} ${year}`;
  } else {
    media = await fetchTrending(36);
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
        {title}
      </h1>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {media.map((m) => (
          <AnimeCard key={m.id} media={m} />
        ))}
      </div>
    </div>
  );
}
