import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";
import { fetchMediaById } from "@/lib/anilist";
import {
  fetchEpisodesByAnilistId,
  fetchStream,
  pickBestSource,
} from "@/lib/consumet";
import { Button } from "@/components/ui/button";
import { WatchClient } from "./watch-client";

export const revalidate = 300;

type Params = { id: string; episode: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}) {
  const { id, episode } = await params;
  const media = await fetchMediaById(Number(id));
  const title =
    media?.title.english ||
    media?.title.romaji ||
    media?.title.userPreferred ||
    "";
  return { title: `${title} — Episode ${episode}` };
}

export default async function WatchPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { id, episode } = await params;
  const anilistId = Number(id);
  const epNumber = Number(episode);
  if (!anilistId || !epNumber) notFound();

  const [media, info] = await Promise.all([
    fetchMediaById(anilistId),
    fetchEpisodesByAnilistId(anilistId),
  ]);
  if (!media) notFound();

  const title =
    media.title.english ||
    media.title.romaji ||
    media.title.userPreferred ||
    "";
  const episodes = info?.episodes ?? [];
  const current = episodes.find((e) => e.number === epNumber);
  const prev = episodes.find((e) => e.number === epNumber - 1);
  const next = episodes.find((e) => e.number === epNumber + 1);

  let stream = null;
  if (current) {
    stream = await fetchStream(current.id);
  }
  const source = stream ? pickBestSource(stream.sources) : null;

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-0 py-0 sm:gap-6 sm:px-6 sm:py-4 lg:px-8">
      <div className="flex items-center gap-2 px-4 pt-3 sm:px-0 sm:pt-0">
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link href={`/anime/${anilistId}`}>
            <ArrowLeft className="size-4" />
            Kembali ke detail
          </Link>
        </Button>
      </div>

      <div className="bg-black sm:rounded-xl">
        {source ? (
          <WatchClient
            anilistId={anilistId}
            title={title}
            image={media.coverImage.extraLarge || media.coverImage.large || undefined}
            episode={epNumber}
            episodeId={current?.id || ""}
            src={source.url}
            subtitles={stream?.subtitles?.filter((s) => !!s.url)}
            headers={stream?.headers}
            poster={current?.image || media.bannerImage || undefined}
          />
        ) : (
          <div className="aspect-video w-full grid place-items-center bg-black text-center text-sm text-white/70">
            <div className="max-w-md space-y-3 p-6">
              <p className="text-base font-semibold text-white">
                Stream tidak tersedia
              </p>
              <p>
                Provider streaming tidak mengembalikan sumber untuk episode ini.
                Ini bisa karena episode belum rilis, Consumet sedang down, atau
                provider memblokir request. Coba refresh atau lihat episode
                lain.
              </p>
              <p className="text-xs opacity-70">
                Tip: untuk production, self-host https://github.com/consumet/api
                dan set <code>NEXT_PUBLIC_CONSUMET_URL</code>.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 px-4 sm:flex-row sm:items-start sm:justify-between sm:px-0">
        <div className="min-w-0 flex-1 space-y-1">
          <Link
            href={`/anime/${anilistId}`}
            className="text-xs font-medium text-[var(--primary)] hover:underline"
          >
            {title}
          </Link>
          <h1 className="line-clamp-2 text-xl font-bold tracking-tight sm:text-2xl">
            Episode {epNumber}
            {current?.title ? ` — ${current.title}` : ""}
          </h1>
          {current?.description && (
            <p className="line-clamp-3 text-sm text-[var(--muted-foreground)]">
              {current.description}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm" disabled={!prev}>
            <Link
              href={prev ? `/watch/${anilistId}/${prev.number}` : "#"}
              aria-disabled={!prev}
              className={!prev ? "pointer-events-none opacity-40" : ""}
            >
              <ChevronLeft /> Sebelum
            </Link>
          </Button>
          <Button asChild size="sm" disabled={!next}>
            <Link
              href={next ? `/watch/${anilistId}/${next.number}` : "#"}
              aria-disabled={!next}
              className={!next ? "pointer-events-none opacity-40" : ""}
            >
              Berikutnya <ChevronRight />
            </Link>
          </Button>
        </div>
      </div>

      {episodes.length > 0 && (
        <div className="space-y-3 px-4 sm:px-0">
          <h2 className="text-lg font-semibold tracking-tight">
            Semua Episode ({episodes.length})
          </h2>
          <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-8 lg:grid-cols-12">
            {episodes.map((e) => {
              const active = e.number === epNumber;
              return (
                <Link
                  key={e.id}
                  href={`/watch/${anilistId}/${e.number}`}
                  prefetch={false}
                  className={`grid h-10 place-items-center rounded-md border text-xs font-semibold transition-colors ${
                    active
                      ? "border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-foreground)]"
                      : "border-[var(--border)] bg-[var(--card)] hover:border-[var(--primary)]/40 hover:bg-[var(--accent)]"
                  }`}
                >
                  {e.number}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Related episodes quick view */}
      {next && (
        <div className="hidden px-4 sm:px-0 md:block">
          <Link
            href={`/watch/${anilistId}/${next.number}`}
            prefetch={false}
            className="group flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--card)] p-3 transition-colors hover:bg-[var(--accent)]"
          >
            <div className="relative aspect-video w-40 overflow-hidden rounded-md bg-[var(--muted)]">
              {(next.image || media.bannerImage) && (
                <Image
                  src={next.image || media.bannerImage || ""}
                  alt={`Episode ${next.number}`}
                  fill
                  sizes="160px"
                  className="object-cover"
                />
              )}
            </div>
            <div>
              <p className="text-xs font-semibold text-[var(--primary)]">
                Up next
              </p>
              <p className="text-sm font-medium">
                Episode {next.number}
                {next.title ? ` — ${next.title}` : ""}
              </p>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}
