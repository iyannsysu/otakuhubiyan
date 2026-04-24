import Link from "next/link";
import Image from "next/image";
import { Clock } from "lucide-react";
import { fetchAiringSchedule } from "@/lib/anilist";
import { WEEKDAYS } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Jadwal Rilis Anime" };
export const revalidate = 3600;

export default async function SchedulePage() {
  const schedule = await fetchAiringSchedule();
  // Group by local weekday.
  const byDay: Record<string, typeof schedule> = {};
  for (const w of WEEKDAYS) byDay[w] = [];
  for (const item of schedule) {
    const d = new Date(item.airingAt * 1000);
    byDay[WEEKDAYS[d.getDay()]].push(item);
  }
  const today = WEEKDAYS[new Date().getDay()];

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
          Jadwal Rilis
        </h1>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          7 hari ke depan — waktu berdasarkan zona waktu browser kamu.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {WEEKDAYS.map((day) => {
          const items = byDay[day].sort((a, b) => a.airingAt - b.airingAt);
          if (!items.length) return null;
          return (
            <section key={day} className="space-y-3">
              <h2 className="flex items-center gap-2 text-lg font-bold tracking-tight">
                {day}
                {day === today && <Badge>Hari ini</Badge>}
                <span className="text-xs font-normal text-[var(--muted-foreground)]">
                  · {items.length} judul
                </span>
              </h2>
              <ul className="space-y-2">
                {items.map((s) => {
                  const d = new Date(s.airingAt * 1000);
                  const time = d.toLocaleTimeString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                  const title =
                    s.media.title.english ||
                    s.media.title.romaji ||
                    s.media.title.userPreferred ||
                    "";
                  const img =
                    s.media.coverImage.extraLarge || s.media.coverImage.large;
                  return (
                    <li key={s.id}>
                      <Link
                        href={`/anime/${s.media.id}`}
                        prefetch={false}
                        className="flex items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--card)] p-2 transition-colors hover:bg-[var(--accent)]"
                      >
                        <div className="grid w-14 shrink-0 place-items-center rounded-md bg-[var(--primary)]/10 p-2 text-center">
                          <Clock className="size-4 text-[var(--primary)]" />
                          <span className="mt-1 text-[11px] font-bold text-[var(--primary)]">
                            {time}
                          </span>
                        </div>
                        {img && (
                          <div className="relative aspect-[2/3] w-10 shrink-0 overflow-hidden rounded-md">
                            <Image
                              src={img}
                              alt={title}
                              fill
                              sizes="40px"
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="line-clamp-2 text-sm font-semibold leading-snug">
                            {title}
                          </p>
                          <p className="text-xs text-[var(--muted-foreground)]">
                            Episode {s.episode}
                            {s.media.format ? ` · ${s.media.format.replace("_", " ")}` : ""}
                          </p>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
