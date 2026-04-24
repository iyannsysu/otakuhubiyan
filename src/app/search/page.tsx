import { Suspense } from "react";
import { searchMedia } from "@/lib/anilist";
import { AnimeCard } from "@/components/anime-card";
import { SearchForm } from "./search-form";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata = { title: "Cari Anime" };

type SearchParams = {
  q?: string;
  genre?: string;
  year?: string;
  season?: string;
  format?: string;
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
          Cari Anime
        </h1>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          Temukan anime berdasarkan judul, genre, tahun, musim, atau format.
        </p>
      </div>
      <SearchForm initial={sp} />
      <Suspense fallback={<ResultsSkeleton />}>
        <Results sp={sp} />
      </Suspense>
    </div>
  );
}

async function Results({ sp }: { sp: SearchParams }) {
  const query = (sp.q || "").trim();
  const hasFilter = Boolean(
    query || sp.genre || sp.year || sp.season || sp.format,
  );
  if (!hasFilter) {
    return (
      <p className="py-16 text-center text-sm text-[var(--muted-foreground)]">
        Mulai ketik untuk mencari anime, atau gunakan filter di atas.
      </p>
    );
  }
  const { media } = await searchMedia(
    query,
    1,
    30,
    sp.genre,
    sp.year ? Number(sp.year) : undefined,
    sp.season,
    sp.format,
  );
  if (!media.length) {
    return (
      <p className="py-16 text-center text-sm text-[var(--muted-foreground)]">
        Tidak ada hasil. Coba kata kunci lain.
      </p>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {media.map((m) => (
        <AnimeCard key={m.id} media={m} />
      ))}
    </div>
  );
}

function ResultsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {Array.from({ length: 18 }).map((_, i) => (
        <Skeleton key={i} className="aspect-[2/3] w-full rounded-xl" />
      ))}
    </div>
  );
}
