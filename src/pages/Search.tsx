import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Filter, Search as SearchIcon, X } from "lucide-react";
import { useAsync } from "../hooks/useAsync";
import { api } from "../lib/api";
import AnimeGrid, { AnimeGridSkeleton } from "../components/AnimeGrid";
import ErrorState from "../components/ErrorState";
import Pagination from "../components/Pagination";

const TYPES = ["", "tv", "movie", "ova", "ona", "special", "music"];
const STATUSES = ["", "airing", "complete", "upcoming"];
const ORDERS = [
  { value: "", label: "Best match" },
  { value: "score", label: "Score" },
  { value: "popularity", label: "Popularity" },
  { value: "rank", label: "Rank" },
  { value: "favorites", label: "Favorites" },
  { value: "episodes", label: "Episodes" },
  { value: "start_date", label: "Start date" },
  { value: "title", label: "Title" },
];
const RATINGS = [
  { value: "", label: "Any" },
  { value: "g", label: "G — All ages" },
  { value: "pg", label: "PG — Children" },
  { value: "pg13", label: "PG-13 — Teens 13+" },
  { value: "r17", label: "R-17+ — Violence & profanity" },
  { value: "r", label: "R+ — Mild nudity" },
];

export default function SearchPage() {
  const [params, setParams] = useSearchParams();
  const q = params.get("q") || "";
  const type = params.get("type") || "";
  const status = params.get("status") || "";
  const rating = params.get("rating") || "";
  const order_by = params.get("order_by") || "";
  const sort = (params.get("sort") as "asc" | "desc") || "desc";
  const min_score = Number(params.get("min_score") || 0);
  const genres = params.get("genres") || "";
  const page = Number(params.get("page") || 1);

  const [qInput, setQInput] = useState(q);
  useEffect(() => setQInput(q), [q]);

  const allGenres = useAsync(() => api.genres(), []);
  const selectedGenres = useMemo(
    () => new Set(genres.split(",").filter(Boolean).map(Number)),
    [genres]
  );

  const result = useAsync(
    () =>
      api.search({
        q: q || undefined,
        type: type || undefined,
        status: status || undefined,
        rating: rating || undefined,
        order_by: order_by || undefined,
        sort,
        min_score: min_score || undefined,
        genres: genres || undefined,
        page,
      }),
    [q, type, status, rating, order_by, sort, min_score, genres, page]
  );

  const update = (patch: Record<string, string | number | undefined>) => {
    const next = new URLSearchParams(params);
    for (const [k, v] of Object.entries(patch)) {
      if (v === undefined || v === "" || v === 0) next.delete(k);
      else next.set(k, String(v));
    }
    if (!("page" in patch)) next.delete("page");
    setParams(next, { replace: false });
  };

  const toggleGenre = (id: number) => {
    const next = new Set(selectedGenres);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    update({ genres: Array.from(next).join(",") || undefined });
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    update({ q: qInput.trim() || undefined });
  };

  const clearAll = () => setParams({});

  return (
    <div className="container-page py-6 space-y-6">
      <div className="card p-4 md:p-5">
        <form onSubmit={submit} className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <SearchIcon
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={qInput}
              onChange={(e) => setQInput(e.target.value)}
              placeholder="Search by title (e.g. Naruto)…"
              className="w-full rounded-xl bg-white/5 border border-white/10 pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:border-brand/60 focus:bg-white/10"
            />
          </div>
          <button type="submit" className="btn-primary">
            <SearchIcon size={16} /> Search
          </button>
          {(q || type || status || rating || order_by !== "" || min_score || genres) && (
            <button type="button" onClick={clearAll} className="btn-ghost">
              <X size={16} /> Clear
            </button>
          )}
        </form>

        <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-3">
          <Select
            label="Type"
            value={type}
            onChange={(v) => update({ type: v })}
            options={TYPES.map((v) => ({
              value: v,
              label: v ? v.toUpperCase() : "Any",
            }))}
          />
          <Select
            label="Status"
            value={status}
            onChange={(v) => update({ status: v })}
            options={STATUSES.map((v) => ({
              value: v,
              label: v ? v[0].toUpperCase() + v.slice(1) : "Any",
            }))}
          />
          <Select
            label="Rating"
            value={rating}
            onChange={(v) => update({ rating: v })}
            options={RATINGS}
          />
          <Select
            label="Order by"
            value={order_by}
            onChange={(v) => update({ order_by: v })}
            options={ORDERS}
          />
          <Select
            label="Direction"
            value={sort}
            onChange={(v) => update({ sort: v })}
            options={[
              { value: "desc", label: "Descending" },
              { value: "asc", label: "Ascending" },
            ]}
          />
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between">
            <div className="text-xs uppercase tracking-wider text-slate-400 inline-flex items-center gap-2">
              <Filter size={12} /> Min score: <span className="text-white">{min_score || 0}</span>
            </div>
            {min_score > 0 && (
              <button
                onClick={() => update({ min_score: undefined })}
                className="text-xs text-slate-400 hover:text-white"
              >
                Reset
              </button>
            )}
          </div>
          <input
            type="range"
            min={0}
            max={9}
            step={0.5}
            value={min_score}
            onChange={(e) => update({ min_score: Number(e.target.value) })}
            className="mt-2 w-full accent-brand"
          />
        </div>

        <div className="mt-4">
          <div className="text-xs uppercase tracking-wider text-slate-400 mb-2">
            Genres
          </div>
          <div className="flex flex-wrap gap-2">
            {allGenres.loading ? (
              <span className="text-xs text-slate-500">Loading genres…</span>
            ) : (
              (allGenres.data ?? [])
                .slice(0, 30)
                .map((g) => (
                  <button
                    key={g.mal_id}
                    onClick={() => toggleGenre(g.mal_id)}
                    className={
                      selectedGenres.has(g.mal_id)
                        ? "chip chip-active"
                        : "chip"
                    }
                  >
                    {g.name}
                  </button>
                ))
            )}
          </div>
        </div>
      </div>

      {result.loading ? (
        <AnimeGridSkeleton count={18} />
      ) : result.error ? (
        <ErrorState onRetry={result.reload} />
      ) : (result.data?.data ?? []).length === 0 ? (
        <div className="card p-10 text-center text-slate-400">
          No results. Try different filters.
        </div>
      ) : (
        <>
          <AnimeGrid items={result.data!.data} />
          <Pagination
            page={page}
            totalPages={result.data?.pagination?.last_visible_page}
            hasNext={Boolean(result.data?.pagination?.has_next_page)}
            onChange={(n) => update({ page: n })}
          />
        </>
      )}
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-wider text-slate-400">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm focus:outline-none focus:border-brand/60"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-bg">
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
