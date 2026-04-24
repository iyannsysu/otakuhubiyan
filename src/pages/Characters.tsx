import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useAsync } from "../hooks/useAsync";
import { api } from "../lib/api";
import { useT } from "../lib/i18n";
import ErrorState from "../components/ErrorState";
import Pagination from "../components/Pagination";
import { formatNumber, imageOf } from "../lib/utils";

export default function CharactersPage() {
  const t = useT();
  const [page, setPage] = useState(1);
  const { data, loading, error, reload } = useAsync(
    () => api.topCharacters(page),
    [page]
  );

  return (
    <div className="container-page py-8 space-y-5">
      <header>
        <h1 className="font-display text-3xl md:text-4xl font-extrabold">
          {t("characters.title")}
        </h1>
        <p className="text-slate-400 mt-1">{t("characters.subtitle")}</p>
      </header>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 18 }).map((_, i) => (
            <div key={i} className="aspect-[3/4] skeleton" />
          ))}
        </div>
      ) : error ? (
        <ErrorState onRetry={reload} />
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {(data?.data ?? []).map((c, i) => (
              <motion.div
                key={c.mal_id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3 }}
              >
                <Link
                  to={`/characters/${c.mal_id}`}
                  className="group block relative aspect-[3/4] overflow-hidden rounded-2xl border border-white/5"
                >
                  <img
                    src={imageOf(c.images)}
                    alt={c.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                  <div className="absolute left-2 top-2 rounded-lg bg-black/60 backdrop-blur px-2 py-1 text-xs font-bold text-white">
                    #{(page - 1) * 24 + i + 1}
                  </div>
                  {typeof c.favorites === "number" && (
                    <div className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-lg bg-brand/90 px-2 py-1 text-xs font-bold text-white">
                      <Heart size={12} fill="currentColor" />
                      {formatNumber(c.favorites)}
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 p-3">
                    <div className="text-sm font-semibold text-white line-clamp-1">
                      {c.name}
                    </div>
                    {c.name_kanji && (
                      <div className="text-[11px] text-slate-300">
                        {c.name_kanji}
                      </div>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
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
