import { Link } from "react-router-dom";
import { useAsync } from "../hooks/useAsync";
import { api } from "../lib/api";
import { useT } from "../lib/i18n";
import ErrorState from "../components/ErrorState";
import { formatNumber } from "../lib/utils";

export default function GenresPage() {
  const t = useT();
  const { data, loading, error, reload } = useAsync(() => api.genres(), []);

  return (
    <div className="container-page py-8">
      <header className="mb-6">
        <h1 className="font-display text-3xl md:text-4xl font-extrabold">
          {t("genres.title")}
        </h1>
        <p className="text-slate-400 mt-1">{t("genres.subtitle")}</p>
      </header>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="h-20 skeleton" />
          ))}
        </div>
      ) : error ? (
        <ErrorState onRetry={reload} />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {(data ?? []).map((g) => (
            <Link
              to={`/search?genres=${g.mal_id}`}
              key={g.mal_id}
              className="group card p-4 hover:border-brand/50 transition"
            >
              <div className="font-display text-lg font-bold group-hover:text-brand transition">
                {g.name}
              </div>
              <div className="mt-1 text-xs text-slate-400">
                {formatNumber(g.count)}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
