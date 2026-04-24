import { useMemo, useState } from "react";
import { AlertTriangle, ExternalLink, Film } from "lucide-react";
import type { SonzaiStreamSource } from "../lib/sonzai";
import { useT } from "../lib/i18n";

type Props = {
  sources: SonzaiStreamSource[];
  title?: string;
};

/**
 * Renders a <video> or <iframe> depending on the source kind, with a picker
 * of all available servers/qualities below the player.
 */
export default function StreamPlayer({ sources, title }: Props) {
  const t = useT();

  // Prefer a direct MP4 source when available, highest quality first.
  const sorted = useMemo(() => {
    const rank = (q?: string) => {
      if (!q) return 0;
      const m = q.match(/(\d+)p/i);
      return m ? Number(m[1]) : 0;
    };
    return [...sources].sort((a, b) => {
      if (a.kind === "mp4" && b.kind !== "mp4") return -1;
      if (b.kind === "mp4" && a.kind !== "mp4") return 1;
      return rank(b.quality) - rank(a.quality);
    });
  }, [sources]);

  const [active, setActive] = useState(0);
  const current = sorted[active];

  if (!current) {
    return (
      <div className="card p-6 text-sm text-slate-400 flex items-center gap-2">
        <AlertTriangle size={16} className="text-amber-400" />
        {t("stream.noSources")}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative aspect-video overflow-hidden rounded-2xl border border-white/10 bg-black shadow-soft">
        {current.kind === "mp4" ? (
          <video
            key={current.url}
            src={current.url}
            controls
            preload="metadata"
            playsInline
            crossOrigin="anonymous"
            className="h-full w-full"
          >
            {t("stream.html5Fallback")}
          </video>
        ) : (
          <iframe
            key={current.url}
            src={current.url}
            title={title || "Episode player"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
            className="h-full w-full"
          />
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-slate-500 mr-1">
          {t("stream.serverPicker")}:
        </span>
        {sorted.map((s, i) => {
          const isActive = i === active;
          return (
            <button
              key={s.server + s.url}
              onClick={() => setActive(i)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition ${
                isActive
                  ? "bg-brand border-brand text-white"
                  : "border-white/10 bg-white/5 text-slate-300 hover:border-white/30 hover:text-white"
              }`}
            >
              {s.kind === "mp4" ? (
                <Film size={11} />
              ) : (
                <ExternalLink size={11} />
              )}
              {s.server}
            </button>
          );
        })}
      </div>

      {current.kind === "iframe" && (
        <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
          <AlertTriangle size={12} className="text-amber-400/80" />
          {t("stream.iframeNote")}
        </p>
      )}
    </div>
  );
}
