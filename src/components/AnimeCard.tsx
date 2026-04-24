import { Link } from "react-router-dom";
import { Star, Calendar, PlayCircle } from "lucide-react";
import { motion } from "framer-motion";
import type { AnimeSummary } from "../lib/api";
import { imageOf } from "../lib/utils";

export default function AnimeCard({
  anime,
  rank,
}: {
  anime: AnimeSummary;
  rank?: number;
}) {
  const img = imageOf(anime.images);
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="group"
    >
      <Link to={`/anime/${anime.mal_id}`} className="block">
        <div className="relative aspect-[2/3] w-full overflow-hidden rounded-2xl bg-bg-card border border-white/5 shadow-soft">
          {img && (
            <img
              src={img}
              alt={anime.title}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

          {rank && (
            <div className="absolute left-2 top-2 rounded-lg bg-black/60 backdrop-blur px-2 py-1 text-xs font-bold text-white">
              #{rank}
            </div>
          )}
          {typeof anime.score === "number" && anime.score > 0 && (
            <div className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-lg bg-brand/90 px-2 py-1 text-xs font-bold text-white">
              <Star size={12} fill="currentColor" /> {anime.score.toFixed(1)}
            </div>
          )}

          <div className="absolute inset-x-0 bottom-0 p-3">
            <div className="line-clamp-2 text-sm font-semibold text-white drop-shadow">
              {anime.title_english || anime.title}
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-slate-300">
              {anime.type && (
                <span className="inline-flex items-center gap-1">
                  <PlayCircle size={11} /> {anime.type}
                </span>
              )}
              {anime.episodes ? <span>{anime.episodes} eps</span> : null}
              {anime.year && (
                <span className="inline-flex items-center gap-1">
                  <Calendar size={11} /> {anime.year}
                </span>
              )}
            </div>
          </div>

          <div className="absolute inset-0 ring-1 ring-inset ring-white/0 group-hover:ring-brand/40 transition" />
        </div>
      </Link>
    </motion.div>
  );
}
