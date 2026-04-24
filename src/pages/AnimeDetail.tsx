import { Link, useParams } from "react-router-dom";
import {
  Calendar,
  Clock,
  Film,
  Globe,
  Hash,
  Heart,
  Play,
  PlayCircle,
  Star,
  Tag,
  Tv,
  Users,
} from "lucide-react";
import { useAsync } from "../hooks/useAsync";
import { api } from "../lib/api";
import { formatNumber, imageOf } from "../lib/utils";
import { useT } from "../lib/i18n";
import AnimeGrid from "../components/AnimeGrid";
import ErrorState from "../components/ErrorState";
import SectionHeader from "../components/SectionHeader";
import TranslatedSynopsis from "../components/TranslatedSynopsis";

export default function AnimeDetail() {
  const { id } = useParams();
  const animeId = Number(id);
  const t = useT();

  const anime = useAsync(() => api.animeFull(animeId), [animeId]);
  const characters = useAsync(() => api.animeCharacters(animeId), [animeId]);
  const recs = useAsync(() => api.animeRecommendations(animeId), [animeId]);
  const eps = useAsync(() => api.animeEpisodes(animeId, 1), [animeId]);

  if (anime.loading) {
    return (
      <div className="container-page py-8 space-y-6">
        <div className="h-72 skeleton rounded-3xl" />
        <div className="grid md:grid-cols-[260px_1fr] gap-6">
          <div className="aspect-[2/3] skeleton rounded-2xl" />
          <div className="space-y-3">
            <div className="h-8 w-2/3 skeleton" />
            <div className="h-4 w-1/2 skeleton" />
            <div className="h-24 skeleton" />
          </div>
        </div>
      </div>
    );
  }

  if (anime.error || !anime.data) {
    return (
      <div className="container-page py-10">
        <ErrorState onRetry={anime.reload} message={t("common.error")} />
      </div>
    );
  }

  const a = anime.data;
  const banner = a.trailer?.youtube_id
    ? `https://img.youtube.com/vi/${a.trailer.youtube_id}/maxresdefault.jpg`
    : imageOf(a.images);

  return (
    <div>
      <div className="relative h-[300px] md:h-[420px] overflow-hidden">
        <img
          src={banner}
          alt=""
          className="absolute inset-0 h-full w-full object-cover blur-sm scale-110 opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-bg/80 to-bg" />
      </div>

      <div className="container-page -mt-40 md:-mt-56 relative">
        <div className="grid gap-6 md:grid-cols-[260px_1fr]">
          <div className="space-y-3">
            <div className="aspect-[2/3] overflow-hidden rounded-2xl border border-white/10 shadow-soft">
              <img
                src={imageOf(a.images)}
                alt={a.title}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {a.external?.slice(0, 3).map((x) => (
                <a
                  key={x.url}
                  href={x.url}
                  target="_blank"
                  rel="noreferrer"
                  className="chip hover:chip-active"
                >
                  <Globe size={12} /> {x.name}
                </a>
              ))}
            </div>
          </div>

          <div className="md:pt-6">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {typeof a.score === "number" && a.score > 0 && (
                <span className="chip chip-active">
                  <Star size={12} fill="currentColor" /> {a.score.toFixed(2)}
                </span>
              )}
              {a.rank ? (
                <span className="chip">
                  <Hash size={12} /> Rank #{a.rank}
                </span>
              ) : null}
              {a.popularity ? (
                <span className="chip">
                  <Heart size={12} /> Pop #{a.popularity}
                </span>
              ) : null}
              {a.members ? (
                <span className="chip">
                  <Users size={12} /> {formatNumber(a.members)} {t("detail.stat.members")}
                </span>
              ) : null}
            </div>

            <h1 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight">
              {a.title_english || a.title}
            </h1>
            {a.title_japanese && (
              <p className="text-slate-400 mt-1">{a.title_japanese}</p>
            )}

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Link
                to={`/anime/${animeId}/watch`}
                className="btn-primary shadow-glow"
              >
                <Play size={16} fill="currentColor" />
                {t("detail.watchNow")}
              </Link>
            </div>

            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
              <Stat icon={<Tv size={14} />} label={t("detail.stat.type")} value={a.type ?? "—"} />
              <Stat
                icon={<PlayCircle size={14} />}
                label={t("detail.stat.episodes")}
                value={a.episodes ? String(a.episodes) : "—"}
              />
              <Stat
                icon={<Calendar size={14} />}
                label={t("detail.stat.aired")}
                value={a.aired?.string ?? a.year?.toString() ?? "—"}
              />
              <Stat
                icon={<Clock size={14} />}
                label={t("detail.stat.duration")}
                value={a.duration ?? "—"}
              />
              <Stat icon={<Film size={14} />} label={t("detail.stat.status")} value={a.status ?? "—"} />
              <Stat icon={<Tag size={14} />} label={t("detail.stat.source")} value={a.source ?? "—"} />
              <Stat
                icon={<Star size={14} />}
                label={t("detail.stat.rating")}
                value={a.rating ?? "—"}
              />
              <Stat
                icon={<Users size={14} />}
                label={t("detail.stat.studio")}
                value={a.studios?.[0]?.name ?? "—"}
              />
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {a.genres?.map((g) => (
                <Link
                  key={g.mal_id}
                  to={`/search?genres=${g.mal_id}`}
                  className="chip hover:chip-active"
                >
                  {g.name}
                </Link>
              ))}
              {a.themes?.map((g) => (
                <span key={g.mal_id} className="chip">
                  {g.name}
                </span>
              ))}
            </div>

            {a.synopsis && (
              <div className="mt-6 card p-5">
                <h3 className="text-lg font-bold mb-2">{t("detail.synopsis")}</h3>
                <TranslatedSynopsis
                  text={a.synopsis}
                  className="text-slate-300 whitespace-pre-line leading-relaxed"
                />
                {a.background && (
                  <>
                    <h4 className="mt-5 mb-2 text-sm uppercase tracking-wider text-slate-400">
                      {t("detail.background")}
                    </h4>
                    <TranslatedSynopsis
                      text={a.background}
                      className="text-slate-400 whitespace-pre-line leading-relaxed text-sm"
                    />
                  </>
                )}
              </div>
            )}

            {a.trailer?.youtube_id && (
              <div className="mt-6 card overflow-hidden">
                <div className="aspect-video w-full">
                  <iframe
                    src={`https://www.youtube.com/embed/${a.trailer.youtube_id}`}
                    title="Trailer"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="h-full w-full"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <section className="mt-12">
          <SectionHeader
            title={t("detail.characters")}
            subtitle={t("detail.characters.sub")}
          />
          {characters.loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="aspect-[3/4] skeleton" />
              ))}
            </div>
          ) : characters.error ? (
            <ErrorState onRetry={characters.reload} />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {(characters.data ?? []).slice(0, 18).map((c) => (
                <Link
                  to={`/characters/${c.character.mal_id}`}
                  key={c.character.mal_id}
                  className="group block"
                >
                  <div className="relative aspect-[3/4] overflow-hidden rounded-xl border border-white/5">
                    <img
                      src={imageOf(c.character.images)}
                      alt={c.character.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-2">
                      <div className="text-sm font-semibold text-white line-clamp-1">
                        {c.character.name}
                      </div>
                      <div className="text-[11px] text-slate-300">{c.role}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {!eps.loading && (eps.data?.data ?? []).length > 0 && (
          <section className="mt-12">
            <SectionHeader title={t("detail.episodes")} subtitle={t("detail.episodes.sub")} />
            <div className="card divide-y divide-white/5">
              {(eps.data?.data ?? []).slice(0, 25).map((e) => (
                <div
                  key={e.mal_id}
                  className="flex items-center gap-3 p-3 hover:bg-white/5 transition"
                >
                  <div className="w-10 text-center text-slate-400 font-mono text-sm">
                    {e.mal_id}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm">{e.title}</div>
                    {e.title_japanese && (
                      <div className="text-xs text-slate-500">
                        {e.title_japanese}
                      </div>
                    )}
                  </div>
                  {e.aired && (
                    <div className="text-xs text-slate-400 hidden sm:block">
                      {new Date(e.aired).toLocaleDateString()}
                    </div>
                  )}
                  {e.filler && <span className="chip">Filler</span>}
                  {e.recap && <span className="chip">Recap</span>}
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="mt-12 mb-10">
          <SectionHeader
            title={t("detail.recs")}
            subtitle={t("detail.recs.sub")}
          />
          {recs.loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="aspect-[2/3] skeleton" />
              ))}
            </div>
          ) : recs.error ? (
            <ErrorState onRetry={recs.reload} />
          ) : (
            <AnimeGrid items={(recs.data ?? []).slice(0, 12)} />
          )}
        </section>
      </div>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="card p-3">
      <div className="text-xs uppercase tracking-wider text-slate-400 inline-flex items-center gap-1.5">
        {icon} {label}
      </div>
      <div className="mt-1 text-sm font-semibold text-white truncate">
        {value}
      </div>
    </div>
  );
}
