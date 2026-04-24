import { useState } from "react";
import { useAsync } from "../hooks/useAsync";
import { api } from "../lib/api";
import AnimeGrid, { AnimeGridSkeleton } from "../components/AnimeGrid";
import ErrorState from "../components/ErrorState";
import Pagination from "../components/Pagination";
import { useSearchParams } from "react-router-dom";

export default function SeasonalPage() {
  const [params, setParams] = useSearchParams();
  const tab = (params.get("tab") as "now" | "upcoming") || "now";
  const [page, setPage] = useState(1);

  const result = useAsync(
    () => (tab === "now" ? api.seasonNow(page) : api.seasonUpcoming(page)),
    [tab, page]
  );

  const setTab = (t: "now" | "upcoming") => {
    const next = new URLSearchParams(params);
    if (t === "now") next.delete("tab");
    else next.set("tab", t);
    setParams(next);
    setPage(1);
  };

  return (
    <div className="container-page py-8 space-y-5">
      <header>
        <h1 className="font-display text-3xl md:text-4xl font-extrabold">
          Seasonal Anime
        </h1>
        <p className="text-slate-400 mt-1">
          What's on now and what's coming next season.
        </p>
      </header>

      <div className="flex gap-2">
        <button
          onClick={() => setTab("now")}
          className={tab === "now" ? "chip chip-active" : "chip"}
        >
          This season
        </button>
        <button
          onClick={() => setTab("upcoming")}
          className={tab === "upcoming" ? "chip chip-active" : "chip"}
        >
          Upcoming
        </button>
      </div>

      {result.loading ? (
        <AnimeGridSkeleton count={18} />
      ) : result.error ? (
        <ErrorState onRetry={result.reload} />
      ) : (
        <>
          <AnimeGrid items={result.data?.data ?? []} />
          <Pagination
            page={page}
            totalPages={result.data?.pagination?.last_visible_page}
            hasNext={Boolean(result.data?.pagination?.has_next_page)}
            onChange={setPage}
          />
        </>
      )}
    </div>
  );
}
