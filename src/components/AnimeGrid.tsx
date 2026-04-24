import type { AnimeSummary } from "../lib/api";
import AnimeCard from "./AnimeCard";

export default function AnimeGrid({
  items,
  startRank,
}: {
  items: AnimeSummary[];
  startRank?: number;
}) {
  const seen = new Set<number>();
  const unique = items.filter((a) => {
    if (seen.has(a.mal_id)) return false;
    seen.add(a.mal_id);
    return true;
  });
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {unique.map((a, i) => (
        <AnimeCard
          key={a.mal_id}
          anime={a}
          rank={startRank ? startRank + i : undefined}
        />
      ))}
    </div>
  );
}

export function AnimeGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="aspect-[2/3] skeleton" />
      ))}
    </div>
  );
}
