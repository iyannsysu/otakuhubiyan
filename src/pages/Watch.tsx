import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ExternalLink, Film, PlayCircle } from "lucide-react";
import { useAsync } from "../hooks/useAsync";
import { api } from "../lib/api";
import { imageOf } from "../lib/utils";
import { useT } from "../lib/i18n";
import ErrorState from "../components/ErrorState";
import SectionHeader from "../components/SectionHeader";

/** Known streaming providers with brand colors so the buttons look like real CTA cards. */
const PROVIDER_STYLES: Record<string, { bg: string; fg: string }> = {
  Crunchyroll: { bg: "bg-[#F47521]", fg: "text-white" },
  Netflix: { bg: "bg-[#e50914]", fg: "text-white" },
  "Muse Asia": { bg: "bg-[#ff0000]", fg: "text-white" },
  "Bilibili Global": { bg: "bg-[#00a1d6]", fg: "text-white" },
  Bahamut: { bg: "bg-[#f89a0e]", fg: "text-black" },
  HIDIVE: { bg: "bg-[#00b0f0]", fg: "text-white" },
  Hulu: { bg: "bg-[#1ce783]", fg: "text-black" },
  "Amazon Prime Video": { bg: "bg-[#1399FF]", fg: "text-white" },
  "Disney Plus": { bg: "bg-[#113CCF]", fg: "text-white" },
  iQIYI: { bg: "bg-[#00be06]", fg: "text-white" },
  YouTube: { bg: "bg-[#ff0000]", fg: "text-white" },
  Aniplus: { bg: "bg-[#00adef]", fg: "text-white" },
  CatchPlay: { bg: "bg-[#ff6600]", fg: "text-white" },
  MeWatch: { bg: "bg-[#0068c8]", fg: "text-white" },
};

function providerStyle(name: string) {
  // Case-insensitive match on known providers; falls back to gradient brand.
  const k = Object.keys(PROVIDER_STYLES).find(
    (key) => name.toLowerCase().includes(key.toLowerCase())
  );
  if (k) return PROVIDER_STYLES[k];
  return { bg: "bg-gradient-to-br from-brand to-accent", fg: "text-white" };
}

export default function WatchPage() {
  const { id } = useParams();
  const animeId = Number(id);
  const t = useT();

  const anime = useAsync(() => api.animeFull(animeId), [animeId]);
  const videos = useAsync(() => api.animeVideos(animeId), [animeId]);

  if (anime.loading) {
    return (
      <div className="container-page py-10 space-y-6">
        <div className="h-10 w-60 skeleton" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-20 skeleton" />
          ))}
        </div>
      </div>
    );
  }

  if (anime.error || !anime.data) {
    return (
      <div className="container-page py-10">
        <ErrorState onRetry={anime.reload} />
      </div>
    );
  }

  const a = anime.data;
  const streaming = a.streaming ?? [];
  const external = a.external ?? [];
  const eps = videos.data?.episodes ?? [];
  const promos = videos.data?.promo ?? [];

  return (
    <div className="container-page py-6 space-y-10">
      <div>
        <Link
          to={`/anime/${animeId}`}
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition"
        >
          <ArrowLeft size={14} />
          {t("watch.back")}
        </Link>

        <div className="mt-4 flex items-start gap-4">
          <div className="hidden sm:block w-24 aspect-[2/3] overflow-hidden rounded-xl border border-white/10 shrink-0">
            <img
              src={imageOf(a.images)}
              alt={a.title}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-brand font-bold">
              {t("watch.title")}
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-extrabold leading-tight">
              {a.title_english || a.title}
            </h1>
            <p className="mt-2 text-slate-400">{t("watch.subtitle")}</p>
          </div>
        </div>
      </div>

      <section>
        <SectionHeader
          title={t("watch.providers.title")}
          subtitle={t("watch.providers.sub")}
        />
        {streaming.length === 0 ? (
          <div className="card p-6 text-sm text-slate-400">
            {t("watch.providers.empty")}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {streaming.map((s) => {
              const st = providerStyle(s.name);
              return (
                <a
                  key={s.name + s.url}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className={`group flex items-center gap-3 rounded-2xl border border-white/10 px-4 py-3 shadow-soft hover:border-white/30 transition ${st.bg} ${st.fg}`}
                >
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-black/25">
                    <PlayCircle size={20} />
                  </span>
                  <span className="flex-1">
                    <span className="block text-[11px] uppercase tracking-[0.18em] opacity-80">
                      {t("detail.watchNow")}
                    </span>
                    <span className="block font-extrabold text-base truncate">
                      {s.name}
                    </span>
                  </span>
                  <ExternalLink size={16} className="opacity-70 group-hover:opacity-100" />
                </a>
              );
            })}
          </div>
        )}
      </section>

      {eps.length > 0 && (
        <section>
          <SectionHeader
            title={t("watch.episodes.title")}
            subtitle={t("watch.episodes.sub")}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {eps.slice(0, 24).map((e) => (
              <a
                key={e.mal_id + e.episode}
                href={e.url}
                target="_blank"
                rel="noreferrer"
                className="group block overflow-hidden rounded-xl border border-white/5 bg-white/5 hover:border-brand/50 transition"
              >
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={e.images?.jpg?.image_url}
                    alt={e.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute left-2 top-2 rounded-md bg-black/70 px-2 py-0.5 text-[11px] font-bold text-white">
                    {e.episode}
                  </div>
                  <div className="absolute inset-0 grid place-items-center opacity-0 group-hover:opacity-100 transition">
                    <PlayCircle size={38} className="text-white drop-shadow-lg" />
                  </div>
                </div>
                <div className="p-3">
                  <div className="text-sm font-semibold line-clamp-2">{e.title}</div>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      {promos.length > 0 && (
        <section>
          <SectionHeader
            title={t("watch.pv.title")}
            subtitle={t("watch.pv.sub")}
          />
          <div className="grid md:grid-cols-2 gap-4">
            {promos.slice(0, 4).map((p, idx) => (
              <div
                key={idx}
                className="card overflow-hidden"
              >
                {p.trailer.embed_url ? (
                  <div className="aspect-video">
                    <iframe
                      src={p.trailer.embed_url}
                      title={p.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="h-full w-full"
                    />
                  </div>
                ) : p.trailer.images?.large_image_url ? (
                  <img
                    src={p.trailer.images.large_image_url}
                    alt={p.title}
                    className="aspect-video w-full object-cover"
                  />
                ) : null}
                <div className="flex items-center gap-2 p-3 text-sm">
                  <Film size={16} className="text-brand" />
                  <span className="font-semibold line-clamp-1 flex-1">
                    {p.title}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {external.length > 0 && (
        <section>
          <SectionHeader title={t("watch.external.title")} />
          <div className="flex flex-wrap gap-2">
            {external.map((x) => (
              <a
                key={x.name + x.url}
                href={x.url}
                target="_blank"
                rel="noreferrer"
                className="chip hover:chip-active"
              >
                <ExternalLink size={12} />
                {x.name}
              </a>
            ))}
          </div>
        </section>
      )}

      <p className="text-xs text-slate-500 border-t border-white/5 pt-4">
        {t("watch.disclaimer")}
      </p>
    </div>
  );
}
