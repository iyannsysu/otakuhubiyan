import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { AniListMedia } from "@/lib/anilist";
import { AnimeCard } from "./anime-card";

export function AnimeRow({
  title,
  media,
  moreHref,
}: {
  title: string;
  media: AniListMedia[];
  moreHref?: string;
}) {
  if (!media.length) return null;
  return (
    <section className="space-y-3">
      <div className="flex items-end justify-between px-4 sm:px-6 lg:px-8">
        <h2 className="text-lg font-bold tracking-tight sm:text-xl">{title}</h2>
        {moreHref && (
          <Link
            href={moreHref}
            className="flex items-center text-xs font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          >
            Lihat semua
            <ChevronRight className="ml-0.5 size-4" />
          </Link>
        )}
      </div>
      <div className="scrollbar-hide flex gap-3 overflow-x-auto px-4 pb-2 sm:gap-4 sm:px-6 lg:px-8">
        {media.map((m) => (
          <div
            key={m.id}
            className="w-[140px] shrink-0 sm:w-[170px] lg:w-[180px]"
          >
            <AnimeCard media={m} />
          </div>
        ))}
      </div>
    </section>
  );
}
