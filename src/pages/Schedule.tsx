import { useState } from "react";
import { useAsync } from "../hooks/useAsync";
import { api } from "../lib/api";
import { useT } from "../lib/i18n";
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

const DAY_LABELS_ID: Record<string, string> = {
  monday: "Senin",
  tuesday: "Selasa",
  wednesday: "Rabu",
  thursday: "Kamis",
  friday: "Jumat",
  saturday: "Sabtu",
  sunday: "Minggu",
};

export default function SchedulePage() {
  const t = useT();
  const [day, setDay] = useState<string>(todayName());
  const result = useAsync(() => api.schedules(day), [day]);

  const labelFor = (d: string) => {
    // Use ID day names when the i18n layer renders in Indonesian.
    if (t("nav.home") === "Beranda") return DAY_LABELS_ID[d] ?? d;
    return d[0].toUpperCase() + d.slice(1);
  };

  return (
    <div className="container-page py-8 space-y-5">
      <header>
        <h1 className="font-display text-3xl md:text-4xl font-extrabold">
          {t("schedule.title")}
        </h1>
        <p className="text-slate-400 mt-1">{t("schedule.subtitle")}</p>
      </header>

      <div className="flex flex-wrap gap-2">
        {DAYS.map((d) => (
          <button
            key={d}
            onClick={() => setDay(d)}
            className={day === d ? "chip chip-active" : "chip"}
          >
            {labelFor(d)}
          </button>
        ))}
      </div>

      {result.loading ? (
        <AnimeGridSkeleton count={18} />
      ) : result.error ? (
        <ErrorState onRetry={result.reload} />
      ) : (result.data?.data ?? []).length === 0 ? (
        <div className="card p-10 text-center text-slate-400">
          {t("common.empty")}
        </div>
      ) : (
        <AnimeGrid items={result.data!.data} />
      )}
    </div>
  );
}
