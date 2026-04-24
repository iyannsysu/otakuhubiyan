import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2, PlayCircle, Search, Tv } from "lucide-react";
import {
  getDetail,
  getStream,
  resolveByTitles,
  type SonzaiDetail,
  type SonzaiEpisode,
  type SonzaiSearchResult,
  type SonzaiStreamSource,
} from "../lib/sonzai";
import StreamPlayer from "./StreamPlayer";
import SectionHeader from "./SectionHeader";
import { useT } from "../lib/i18n";

type Props = {
  /** List of candidate titles to search — English, romaji, Japanese. */
  titles: Array<string | null | undefined>;
  /** The canonical display title for UI copy. */
  displayTitle: string;
};

type Phase =
  | { state: "resolving" }
  | { state: "not_found" }
  | { state: "resolved"; match: SonzaiSearchResult }
  | { state: "error"; message: string };

export default function SonzaiStreaming({ titles, displayTitle }: Props) {
  const t = useT();
  const [phase, setPhase] = useState<Phase>({ state: "resolving" });
  const [detail, setDetail] = useState<SonzaiDetail | null>(null);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [activeEp, setActiveEp] = useState<SonzaiEpisode | null>(null);
  const [sources, setSources] = useState<SonzaiStreamSource[] | null>(null);
  const [streamLoading, setStreamLoading] = useState(false);
  const [streamError, setStreamError] = useState<string | null>(null);

  // Stable primitive key so useEffect doesn't refire on every parent render
  const titlesKey = titles.filter(Boolean).join("||");
  const stableTitles = useMemo(() => titles.filter(Boolean) as string[], [titlesKey]); // eslint-disable-line react-hooks/exhaustive-deps

  // 1) Resolve title → Sonzai match
  useEffect(() => {
    let cancelled = false;
    setPhase({ state: "resolving" });
    setDetail(null);
    setActiveEp(null);
    setSources(null);

    resolveByTitles(stableTitles)
      .then((match) => {
        if (cancelled) return;
        if (!match) setPhase({ state: "not_found" });
        else setPhase({ state: "resolved", match });
      })
      .catch((e) => {
        if (cancelled) return;
        setPhase({ state: "error", message: (e as Error).message });
      });

    return () => {
      cancelled = true;
    };
  }, [stableTitles]);

  // 2) Once resolved, load episodes list
  useEffect(() => {
    if (phase.state !== "resolved") return;
    let cancelled = false;
    setDetailError(null);
    setDetail(null);
    getDetail(phase.match.slug, phase.match.provider)
      .then((d) => {
        if (cancelled) return;
        setDetail(d);
        // Auto-select episode 1 (last in most ID fansub lists).
        const first = [...d.episodes].reverse()[0] ?? d.episodes[0] ?? null;
        if (first) setActiveEp(first);
      })
      .catch((e) => {
        if (cancelled) return;
        setDetailError((e as Error).message);
      });
    return () => {
      cancelled = true;
    };
  }, [phase]);

  // 3) Whenever the active episode changes, fetch streams
  useEffect(() => {
    if (!activeEp || phase.state !== "resolved") return;
    let cancelled = false;
    setStreamLoading(true);
    setStreamError(null);
    setSources(null);
    getStream(activeEp.slug, phase.match.provider, phase.match.slug)
      .then((s) => {
        if (cancelled) return;
        setSources(s);
      })
      .catch((e) => {
        if (cancelled) return;
        setStreamError((e as Error).message);
      })
      .finally(() => {
        if (!cancelled) setStreamLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [activeEp, phase]);

  return (
    <section>
      <SectionHeader
        title={t("stream.title")}
        subtitle={t("stream.subtitle")}
      />

      {phase.state === "resolving" && (
        <div className="card p-6 flex items-center gap-3 text-sm text-slate-300">
          <Loader2 size={16} className="animate-spin text-brand" />
          {t("stream.searching").replace("{q}", displayTitle)}
        </div>
      )}

      {phase.state === "not_found" && (
        <div className="card p-6 flex items-center gap-3 text-sm text-slate-300">
          <Search size={16} className="text-slate-400" />
          <div>
            <div className="font-semibold">{t("stream.notFound.title")}</div>
            <div className="text-slate-400 text-xs mt-1">
              {t("stream.notFound.desc")}
            </div>
          </div>
        </div>
      )}

      {phase.state === "error" && (
        <div className="card p-6 text-sm text-rose-300">
          {t("stream.error")}: {phase.message}
        </div>
      )}

      {phase.state === "resolved" && (
        <div className="space-y-4">
          <div className="card p-4 flex items-center gap-3">
            <Check size={16} className="text-emerald-400 shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-xs text-slate-400">
                {t("stream.matched")}
              </div>
              <div className="font-semibold truncate">
                {phase.match.title}
                <span className="ml-2 text-[10px] uppercase tracking-[0.2em] text-slate-500">
                  {phase.match.provider === "samehada"
                    ? "Samehadaku"
                    : "Animekita"}
                </span>
              </div>
            </div>
            {phase.match.thumbnail && (
              <img
                src={phase.match.thumbnail}
                alt=""
                className="h-10 w-10 rounded-md object-cover border border-white/10"
              />
            )}
          </div>

          {detailError && (
            <div className="card p-4 text-sm text-rose-300">
              {t("stream.error")}: {detailError}
            </div>
          )}

          {detail && (
            <>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeEp?.slug ?? "none"}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25 }}
                >
                  {streamLoading && (
                    <div className="card p-6 flex items-center gap-3 text-sm text-slate-300">
                      <Loader2 size={16} className="animate-spin text-brand" />
                      {t("stream.loadingPlayer")}
                    </div>
                  )}
                  {streamError && !streamLoading && (
                    <div className="card p-6 text-sm text-rose-300">
                      {t("stream.error")}: {streamError}
                    </div>
                  )}
                  {sources && !streamLoading && (
                    <StreamPlayer
                      sources={sources}
                      title={`${detail.title} — Ep ${activeEp?.episode ?? ""}`}
                    />
                  )}
                </motion.div>
              </AnimatePresence>

              {detail.episodes.length > 0 && (
                <div>
                  <div className="text-xs text-slate-400 mb-2 flex items-center gap-1.5">
                    <Tv size={12} />
                    {t("stream.episodes")} ({detail.episodes.length})
                  </div>
                  <div className="flex flex-wrap gap-1.5 max-h-56 overflow-y-auto pr-1">
                    {detail.episodes.map((ep) => {
                      const isActive = ep.slug === activeEp?.slug;
                      return (
                        <button
                          key={ep.slug}
                          onClick={() => setActiveEp(ep)}
                          className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition ${
                            isActive
                              ? "bg-brand border-brand text-white shadow-soft"
                              : "border-white/10 bg-white/5 text-slate-300 hover:border-white/30 hover:text-white"
                          }`}
                          title={ep.title || `Episode ${ep.episode}`}
                        >
                          <PlayCircle size={11} />
                          Ep {ep.episode}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      <p className="mt-3 text-[11px] text-slate-500">
        {t("stream.disclaimer")}
      </p>
    </section>
  );
}
