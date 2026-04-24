import { Suspense } from "react";
import {
  fetchTrending,
  fetchPopular,
  fetchRecentlyUpdated,
  fetchSeasonal,
  getCurrentSeason,
} from "@/lib/anilist";
import { AnimeRow } from "@/components/anime-row";
import { Hero } from "@/components/hero";
import { Skeleton } from "@/components/ui/skeleton";

export const revalidate = 1800; // refresh home every 30 minutes

export default async function HomePage() {
  return (
    <div className="flex flex-col gap-8 pb-10 sm:gap-10">
      <Suspense fallback={<HeroSkeleton />}>
        <HeroSection />
      </Suspense>
      <Suspense fallback={<RowSkeleton label="Update Terbaru" />}>
        <RecentlyUpdatedSection />
      </Suspense>
      <Suspense fallback={<RowSkeleton label="Trending Minggu Ini" />}>
        <TrendingSection />
      </Suspense>
      <Suspense fallback={<RowSkeleton label="Musim Ini" />}>
        <SeasonalSection />
      </Suspense>
      <Suspense fallback={<RowSkeleton label="Paling Populer" />}>
        <PopularSection />
      </Suspense>
    </div>
  );
}

async function HeroSection() {
  const trending = await fetchTrending(6);
  return <Hero items={trending} />;
}

async function RecentlyUpdatedSection() {
  const data = await fetchRecentlyUpdated(20);
  return (
    <AnimeRow
      title="Episode Baru Update Hari Ini"
      media={data}
      moreHref="/browse?sort=updated"
    />
  );
}

async function TrendingSection() {
  const data = await fetchTrending(20);
  return (
    <AnimeRow
      title="Trending Minggu Ini"
      media={data}
      moreHref="/browse?sort=trending"
    />
  );
}

async function SeasonalSection() {
  const season = getCurrentSeason();
  const year = new Date().getFullYear();
  const data = await fetchSeasonal(season, year, 20);
  return (
    <AnimeRow
      title={`Anime Musim ${season[0]}${season.slice(1).toLowerCase()} ${year}`}
      media={data}
      moreHref={`/browse?season=${season}&year=${year}`}
    />
  );
}

async function PopularSection() {
  const data = await fetchPopular(20);
  return (
    <AnimeRow
      title="Paling Populer Sepanjang Masa"
      media={data}
      moreHref="/browse?sort=popular"
    />
  );
}

function HeroSkeleton() {
  return (
    <div className="relative h-[58vh] min-h-[380px] w-full overflow-hidden sm:h-[70vh]">
      <Skeleton className="absolute inset-0" />
    </div>
  );
}

function RowSkeleton({ label }: { label: string }) {
  return (
    <section className="space-y-3">
      <div className="px-4 sm:px-6 lg:px-8">
        <h2 className="text-lg font-bold">{label}</h2>
      </div>
      <div className="flex gap-3 overflow-hidden px-4 pb-2 sm:gap-4 sm:px-6 lg:px-8">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton
            key={i}
            className="aspect-[2/3] w-[140px] shrink-0 sm:w-[170px] lg:w-[180px]"
          />
        ))}
      </div>
    </section>
  );
}
