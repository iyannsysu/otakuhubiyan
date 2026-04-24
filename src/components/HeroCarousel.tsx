import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Play, Star, Tag } from "lucide-react";
import type { AnimeSummary } from "../lib/api";
import { imageOf, truncate } from "../lib/utils";

export default function HeroCarousel({ items }: { items: AnimeSummary[] }) {
  const slides = items.slice(0, 5);
  const [i, setI] = useState(0);

  useEffect(() => {
    if (!slides.length) return;
    const t = setInterval(() => setI((p) => (p + 1) % slides.length), 6500);
    return () => clearInterval(t);
  }, [slides.length]);

  if (!slides.length) {
    return <div className="h-[420px] md:h-[520px] skeleton rounded-3xl" />;
  }

  const current = slides[i];
  const img = imageOf(current.images);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/5 shadow-soft">
      <div className="relative h-[420px] md:h-[520px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.mal_id}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <img
              src={img}
              alt={current.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent" />
          </motion.div>
        </AnimatePresence>

        <div className="relative z-10 h-full container-page flex items-end md:items-center pb-10 md:pb-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.mal_id + "-content"}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="max-w-2xl"
            >
              <div className="mb-3 flex items-center gap-2">
                <span className="chip chip-active">Featured</span>
                {typeof current.score === "number" && current.score > 0 && (
                  <span className="chip">
                    <Star size={12} fill="currentColor" /> {current.score.toFixed(1)}
                  </span>
                )}
                {current.type && <span className="chip">{current.type}</span>}
                {current.year && <span className="chip">{current.year}</span>}
              </div>
              <h1 className="font-display text-3xl md:text-5xl font-extrabold leading-tight tracking-tight">
                {current.title_english || current.title}
              </h1>
              {current.title_japanese && (
                <p className="mt-1 text-sm text-slate-400">{current.title_japanese}</p>
              )}
              <p className="mt-4 text-slate-300 text-sm md:text-base">
                {truncate(current.synopsis, 220)}
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-2">
                {current.genres?.slice(0, 4).map((g) => (
                  <span key={g.mal_id} className="chip">
                    <Tag size={11} /> {g.name}
                  </span>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link to={`/anime/${current.mal_id}`} className="btn-primary">
                  <Play size={16} /> View details
                </Link>
                <Link to="/search" className="btn-ghost">
                  Browse more
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <button
          aria-label="Previous"
          onClick={() => setI((p) => (p - 1 + slides.length) % slides.length)}
          className="absolute left-3 top-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          aria-label="Next"
          onClick={() => setI((p) => (p + 1) % slides.length)}
          className="absolute right-3 top-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur"
        >
          <ChevronRight size={20} />
        </button>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5">
          {slides.map((s, idx) => (
            <button
              key={s.mal_id}
              onClick={() => setI(idx)}
              aria-label={`Slide ${idx + 1}`}
              className={
                "h-1.5 rounded-full transition-all " +
                (idx === i ? "w-8 bg-brand" : "w-3 bg-white/40 hover:bg-white/70")
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}
