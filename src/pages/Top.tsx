import { useState } from "react";
import { useAsync } from "../hooks/useAsync";
import { api } from "../lib/api";
import { useT } from "../lib/i18n";
import AnimeGrid, { AnimeGridSkeleton } from "../components/AnimeGrid";
import ErrorState from "../components/ErrorState";
import Pagination from "../components/Pagination";

const TABS = [
  { value: "", i18n: "top.filter.all" },
  { value: "airing", i18n: "top.filter.airing" },
  { value: "upcoming", i18n: "top.filter.upcoming" },
  { value: "bypopularity", i18n: "top.filter.popular" },
  { value: "favorite", i18n: "top.filter.favorite" },
] as const;

export default function TopPage() {
  const t = useT();
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
          {t("top.title")}
        </h1>
        <p className="text-slate-400 mt-1">{t("top.subtitle")}</p>
      </header>

      <div className="flex flex-wrap gap-2">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => {
              setPage(1);
              setFilter(tab.value);
            }}
            className={filter === tab.value ? "chip chip-active" : "chip"}
          >
            {t(tab.i18n)}
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
