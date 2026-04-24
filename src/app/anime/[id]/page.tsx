import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Star, Calendar, Clock, Tv, Play, ExternalLink } from "lucide-react";
import { fetchMediaById } from "@/lib/anilist";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AnimeRow } from "@/components/anime-row";
import { stripHtml, formatSeason } from "@/lib/utils";
import { WatchlistButton } from "@/components/watchlist-button";
import {
  FALLBACK_PLATFORMS,
  filterStreamingLinks,
} from "@/lib/watch-links";

export const revalidate = 3600;

type Params = { id: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}) {
  const { id } = await params;
  const media = await fetchMediaById(Number(id));
  if (!media) return { title: "Anime tidak ditemukan" };
  const title =
    media.title.english || media.title.romaji || media.title.userPreferred || "";
  return {
    title,
    description: stripHtml(media.description).slice(0, 160),
    openGraph: {
      title,
      description: stripHtml(media.description).slice(0, 160),
      images: [media.bannerImage || media.coverImage.extraLarge || ""],
    },
  };
}

export default async function AnimeDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { id } = await params;
  const anilistId = Number(id);
  if (!anilistId) notFound();
  const media = await fetchMediaById(anilistId);
  if (!media) notFound();

  const title =
    media.title.english || media.title.romaji || media.title.userPreferred || "";
  const banner =
    media.bannerImage || media.coverImage.extraLarge || media.coverImage.large;
  const cover = media.coverImage.extraLarge || media.coverImage.large;
  const desc = stripHtml(media.description);
  const studio = media.studios?.nodes.find((s) => s.isAnimationStudio)?.name;

  return (
    <div className="flex flex-col">
      {/* Hero / banner */}
      <div className="relative h-[36vh] min-h-[220px] w-full sm:h-[44vh]">
        {banner && (
          <Image
            src={banner}
            alt={title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-[var(--background)]/60 to-[var(--background)]/20" />
      </div>

      <div className="mx-auto -mt-24 w-full max-w-7xl px-4 sm:-mt-32 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 sm:flex-row">
          {cover && (
            <div className="relative mx-auto aspect-[2/3] w-40 shrink-0 overflow-hidden rounded-xl border-2 border-[var(--background)] shadow-xl sm:mx-0 sm:w-52">
              <Image
                src={cover}
                alt={title}
                fill
                sizes="(max-width: 640px) 160px, 208px"
                className="object-cover"
              />
            </div>
          )}
          <div className="flex-1 space-y-3 pt-2 text-center sm:pt-12 sm:text-left">
            <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              {media.averageScore && (
                <Badge>
                  <Star className="size-3 fill-current" />
                  {(media.averageScore / 10).toFixed(1)}
                </Badge>
              )}
              {media.format && <Badge variant="outline">{media.format.replace("_", " ")}</Badge>}
              {media.status && <Badge variant="outline">{media.status}</Badge>}
              {media.episodes && (
                <Badge variant="outline">{media.episodes} episode</Badge>
              )}
            </div>
            <h1 className="text-2xl font-extrabold leading-tight tracking-tight sm:text-4xl">
              {title}
            </h1>
            {media.title.native && (
              <p className="text-sm text-[var(--muted-foreground)]">
                {media.title.native}
              </p>
            )}
            <div className="flex flex-wrap justify-center gap-3 text-xs text-[var(--muted-foreground)] sm:justify-start">
              {(media.season || media.seasonYear) && (
                <span className="inline-flex items-center gap-1">
                  <Calendar className="size-3.5" />
                  {formatSeason(media.season, media.seasonYear)}
                </span>
              )}
              {media.duration && (
                <span className="inline-flex items-center gap-1">
                  <Clock className="size-3.5" /> {media.duration} mnt / ep
                </span>
              )}
              {studio && (
                <span className="inline-flex items-center gap-1">
                  <Tv className="size-3.5" /> {studio}
                </span>
              )}
            </div>
            <div className="flex flex-wrap justify-center gap-1.5 sm:justify-start">
              {media.genres.map((g) => (
                <Link
                  key={g}
                  href={`/browse?genre=${encodeURIComponent(g)}`}
                  className="rounded-full border border-[var(--border)] px-2.5 py-0.5 text-[11px] hover:bg-[var(--accent)]"
                >
                  {g}
                </Link>
              ))}
            </div>
            <WatchOnButtons
              media={media}
              title={title}
              cover={cover}
            />
          </div>
        </div>

        {desc && (
          <div className="mt-8 max-w-3xl">
            <h2 className="mb-2 text-base font-semibold">Sinopsis</h2>
            <p className="text-sm leading-relaxed text-[var(--muted-foreground)]">
              {desc}
            </p>
          </div>
        )}

        <EpisodesSection media={media} cover={cover} />

        {media.characters?.edges?.length ? (
          <div className="mt-10">
            <h2 className="mb-4 text-xl font-bold tracking-tight">Karakter</h2>
            <div className="scrollbar-hide flex gap-3 overflow-x-auto pb-2">
              {media.characters.edges.slice(0, 12).map((c) => (
                <div
                  key={c.node.id}
                  className="w-24 shrink-0 text-center"
                >
                  <div className="relative mx-auto aspect-[2/3] w-24 overflow-hidden rounded-lg bg-[var(--muted)]">
                    {c.node.image.large && (
                      <Image
                        src={c.node.image.large}
                        alt={c.node.name.full}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <p className="mt-1.5 line-clamp-2 text-[11px] font-medium leading-tight">
                    {c.node.name.full}
                  </p>
                  <p className="text-[10px] text-[var(--muted-foreground)]">
                    {c.role}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {media.recommendations?.nodes?.length ? (
          <div className="mt-10">
            <AnimeRow
              title="Rekomendasi Serupa"
              media={media.recommendations.nodes
                .map((n) => n.mediaRecommendation)
                .filter(
                  (m): m is NonNullable<typeof m> => m !== null && m !== undefined,
                )}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}

function WatchOnButtons({
  media,
  title,
  cover,
}: {
  media: NonNullable<Awaited<ReturnType<typeof fetchMediaById>>>;
  title: string;
  cover: string | null;
}) {
  const streamingLinks = filterStreamingLinks(media.externalLinks);
  const hasLegitLinks = streamingLinks.length > 0;
  const buttons = hasLegitLinks
    ? streamingLinks.slice(0, 4).map((l) => ({
        key: l.site,
        name: l.site,
        url: l.url,
        color: l.color || undefined,
      }))
    : FALLBACK_PLATFORMS.slice(0, 4).map((p) => ({
        key: p.key,
        name: p.name,
        url: p.search(title),
        color: p.color,
      }));

  return (
    <div className="space-y-2 pt-2">
      <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
        {buttons.map((b, i) => (
          <Button
            key={b.key}
            asChild
            size="lg"
            variant={i === 0 ? "default" : "outline"}
            style={
              i === 0 && b.color
                ? { backgroundColor: b.color, borderColor: b.color, color: "white" }
                : undefined
            }
          >
            <a href={b.url} target="_blank" rel="noopener noreferrer">
              {i === 0 ? (
                <Play className="fill-current" />
              ) : (
                <ExternalLink />
              )}
              <span>Nonton di {b.name}</span>
            </a>
          </Button>
        ))}
        <WatchlistButton
          anilistId={media.id}
          title={title}
          image={cover || undefined}
        />
      </div>
      {!hasLegitLinks && (
        <p className="text-[11px] text-[var(--muted-foreground)] sm:text-left">
          OtakuHub adalah katalog discovery — pencarian akan dibuka di layanan
          streaming resmi.
        </p>
      )}
    </div>
  );
}

function EpisodesSection({
  media,
  cover,
}: {
  media: NonNullable<Awaited<ReturnType<typeof fetchMediaById>>>;
  cover: string | null;
}) {
  const episodes = (media.streamingEpisodes || []).filter((e) => e.url);
  if (!episodes.length) return null;
  return (
    <div className="mt-8">
      <h2 className="mb-1 text-xl font-bold tracking-tight">Episode</h2>
      <p className="mb-4 text-xs text-[var(--muted-foreground)]">
        Link langsung ke episode di layanan streaming resmi (via AniList).
      </p>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {episodes.map((ep, idx) => (
          <a
            key={ep.url || idx}
            href={ep.url || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--card)] p-2 transition-colors hover:bg-[var(--accent)]"
          >
            <div className="relative aspect-video w-28 shrink-0 overflow-hidden rounded-md bg-[var(--muted)]">
              {(ep.thumbnail || cover) && (
                // Streaming-episode thumbnails are served from arbitrary
                // streaming-service CDNs (Crunchyroll, Bstation, etc.), so
                // skip next/image's domain allow-list and use a plain img.
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={ep.thumbnail || cover || ""}
                  alt={ep.title || `Episode ${idx + 1}`}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
              )}
              <div className="absolute inset-0 grid place-items-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                <Play className="size-6 fill-white text-white" />
              </div>
            </div>
            <div className="min-w-0 flex-1">
              {ep.site && (
                <p className="text-xs font-semibold text-[var(--primary)]">
                  {ep.site}
                </p>
              )}
              <p className="line-clamp-2 text-sm font-medium leading-snug">
                {ep.title || `Episode ${idx + 1}`}
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
