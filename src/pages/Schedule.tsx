import { useState } from "react";
import { useAsync } from "../hooks/useAsync";
import { api } from "../lib/api";
import AnimeGrid, { AnimeGridSkeleton } from "../components/AnimeGrid";
import ErrorState from "../components/ErrorState";

const DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

function todayName() {
  return new Date()
    .toLocaleDateString("en-US", { weekday: "long" })
    .toLowerCase();
}

export default function SchedulePage() {
  const [day, setDay] = useState<string>(todayName());
  const result = useAsync(() => api.schedules(day), [day]);

  return (
    <div className="container-page py-8 space-y-5">
      <header>
        <h1 className="font-display text-3xl md:text-4xl font-extrabold">
          Weekly Schedule
        </h1>
        <p className="text-slate-400 mt-1">
          Anime airing on each day of the week.
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        {DAYS.map((d) => (
          <button
            key={d}
            onClick={() => setDay(d)}
            className={day === d ? "chip chip-active" : "chip"}
          >
            {d[0].toUpperCase() + d.slice(1)}
          </button>
        ))}
      </div>

      {result.loading ? (
        <AnimeGridSkeleton count={18} />
      ) : result.error ? (
        <ErrorState onRetry={result.reload} />
      ) : (result.data?.data ?? []).length === 0 ? (
        <div className="card p-10 text-center text-slate-400">
          Nothing scheduled for {day}.
        </div>
      ) : (
        <AnimeGrid items={result.data!.data} />
      )}
    </div>
  );
}
