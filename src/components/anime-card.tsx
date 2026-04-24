import Image from "next/image";
import Link from "next/link";
import { Star, Play } from "lucide-react";
import type { AniListMedia } from "@/lib/anilist";
import { cn, truncate } from "@/lib/utils";

export function AnimeCard({
  media,
  className,
  aspect = "portrait",
  badge,
}: {
  media: AniListMedia;
  className?: string;
  aspect?: "portrait" | "landscape";
  badge?: React.ReactNode;
}) {
  const title =
    media.title.userPreferred ||
    media.title.english ||
    media.title.romaji ||
    "Untitled";
  const score = media.averageScore ? (media.averageScore / 10).toFixed(1) : null;
  const img =
    aspect === "landscape"
      ? media.bannerImage || media.coverImage.extraLarge || media.coverImage.large
      : media.coverImage.extraLarge || media.coverImage.large;
  return (
    <Link
      href={`/anime/${media.id}`}
      prefetch={false}
      className={cn(
        "group relative block overflow-hidden rounded-xl bg-[var(--card)]",
        aspect === "portrait" ? "aspect-[2/3]" : "aspect-video",
        className,
      )}
      style={{
        backgroundColor: media.coverImage.color || undefined,
      }}
    >
      {img && (
        <Image
          src={img}
          alt={title}
          fill
          sizes="(max-width: 640px) 45vw, (max-width: 1024px) 25vw, 200px"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90" />

      {badge && (
        <div className="absolute left-2 top-2 z-10">{badge}</div>
      )}

      {score && (
        <div className="absolute right-2 top-2 z-10 flex items-center gap-1 rounded-md bg-black/60 px-1.5 py-0.5 text-xs font-medium text-yellow-300 backdrop-blur">
          <Star className="size-3 fill-yellow-300 text-yellow-300" />
          {score}
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 z-10 p-2.5 text-white">
        <p className="line-clamp-2 text-sm font-semibold leading-snug drop-shadow">
          {truncate(title, 70)}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] text-white/70">
          {media.format && <span>{media.format.replace("_", " ")}</span>}
          {media.episodes && <span>• {media.episodes} ep</span>}
          {media.seasonYear && <span>• {media.seasonYear}</span>}
        </div>
      </div>

      <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
        <div className="rounded-full bg-[var(--primary)] p-3 text-[var(--primary-foreground)] shadow-lg">
          <Play className="size-5 fill-current" />
        </div>
      </div>
    </Link>
  );
}
