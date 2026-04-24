import { useState } from "react";
import { useAsync } from "../hooks/useAsync";
import { api } from "../lib/api";
import AnimeGrid, { AnimeGridSkeleton } from "../components/AnimeGrid";
import ErrorState from "../components/ErrorState";
import Pagination from "../components/Pagination";

const TABS = [
  { value: "", label: "All-time" },
  { value: "airing", label: "Airing" },
  { value: "upcoming", label: "Upcoming" },
  { value: "bypopularity", label: "Popular" },
  { value: "favorite", label: "Favorites" },
] as const;

export default function TopPage() {
  const [filter, setFilter] = useState<(typeof TABS)[number]["value"]>("");
  const [page, setPage] = useState(1);
  const { data, loading, error, reload } = useAsync(
    () => api.topAnime(page, filter || undefined),
    [filter, page]
  );

  return (
    <div className="container-page py-8 space-y-5">
      <header>
        <h1 className="font-display text-3xl md:text-4xl font-extrabold">
          Top Anime
        </h1>
        <p className="text-slate-400 mt-1">
          The very best — by score, popularity, and favorites.
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => {
              setPage(1);
              setFilter(t.value);
            }}
            className={filter === t.value ? "chip chip-active" : "chip"}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <AnimeGridSkeleton count={18} />
      ) : error ? (
        <ErrorState onRetry={reload} />
      ) : (
        <>
          <AnimeGrid
            items={data?.data ?? []}
            startRank={(page - 1) * 24 + 1}
          />
          <Pagination
            page={page}
            totalPages={data?.pagination?.last_visible_page}
            hasNext={Boolean(data?.pagination?.has_next_page)}
            onChange={setPage}
          />
        </>
      )}
    </div>
  );
}
