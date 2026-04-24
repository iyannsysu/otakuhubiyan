"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Play, Info, Star } from "lucide-react";
import type { AniListMedia } from "@/lib/anilist";
import { Button } from "@/components/ui/button";
import { stripHtml, truncate } from "@/lib/utils";

export function Hero({ items }: { items: AniListMedia[] }) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (items.length < 2) return;
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % items.length);
    }, 7000);
    return () => clearInterval(t);
  }, [items.length]);

  if (!items.length) return null;
  const current = items[index];
  const title =
    current.title.userPreferred ||
    current.title.english ||
    current.title.romaji ||
    "";
  const banner =
    current.bannerImage ||
    current.coverImage.extraLarge ||
    current.coverImage.large;
  const score = current.averageScore
    ? (current.averageScore / 10).toFixed(1)
    : null;

  return (
    <section className="relative h-[58vh] min-h-[380px] w-full overflow-hidden sm:h-[70vh] lg:h-[78vh]">
      {banner && (
        <Image
          key={current.id}
          src={banner}
          alt={title}
          fill
          priority
          sizes="100vw"
          className="object-cover animate-[fadeIn_1s_ease-out]"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-[var(--background)]/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--background)]/85 via-[var(--background)]/30 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-4 pb-8 sm:px-6 sm:pb-12 lg:px-8 lg:pb-16">
        <div className="max-w-2xl space-y-3 sm:space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {score && (
              <span className="inline-flex items-center gap-1 rounded-md bg-yellow-500/20 px-2 py-0.5 font-semibold text-yellow-400">
                <Star className="size-3 fill-yellow-400" /> {score}
              </span>
            )}
            {current.format && (
              <span className="rounded-md bg-white/10 px-2 py-0.5 text-white backdrop-blur">
                {current.format.replace("_", " ")}
              </span>
            )}
            {current.seasonYear && (
              <span className="rounded-md bg-white/10 px-2 py-0.5 text-white backdrop-blur">
                {current.seasonYear}
              </span>
            )}
            {current.episodes && (
              <span className="rounded-md bg-white/10 px-2 py-0.5 text-white backdrop-blur">
                {current.episodes} episode
              </span>
            )}
          </div>
          <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-white drop-shadow-lg sm:text-5xl lg:text-6xl">
            {truncate(title, 80)}
          </h1>
          <p className="line-clamp-3 max-w-xl text-sm text-white/80 sm:text-base">
            {truncate(stripHtml(current.description), 260)}
          </p>
          <div className="flex flex-wrap gap-2">
            <Button asChild size="lg" className="font-semibold">
              <Link href={`/watch/${current.id}/1`}>
                <Play className="fill-current" />
                Tonton Sekarang
              </Link>
            </Button>
            <Button
              asChild
              variant="secondary"
              size="lg"
              className="bg-white/10 text-white backdrop-blur hover:bg-white/20"
            >
              <Link href={`/anime/${current.id}`}>
                <Info />
                Detail
              </Link>
            </Button>
          </div>
          {items.length > 1 && (
            <div className="flex gap-1.5 pt-2">
              {items.slice(0, 6).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Slide ${i + 1}`}
                  onClick={() => setIndex(i)}
                  className={`h-1 rounded-full transition-all ${
                    i === index % 6
                      ? "w-8 bg-[var(--primary)]"
                      : "w-3 bg-white/40"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(1.05);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </section>
  );
}
