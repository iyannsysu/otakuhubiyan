import Link from "next/link";
import Image from "next/image";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { History as HistoryIcon, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Riwayat Tonton" };
export const dynamic = "force-dynamic";

export default async function HistoryPage() {
  const session = await auth();

  if (!session?.user?.id) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center gap-4 px-4 py-10 text-center">
        <HistoryIcon className="size-10 text-[var(--primary)]" />
        <h1 className="text-2xl font-bold">Masuk untuk melihat Riwayat</h1>
        <Button asChild>
          <Link href="/login">Masuk</Link>
        </Button>
      </div>
    );
  }

  let list: Awaited<ReturnType<typeof prisma.history.findMany>> = [];
  try {
    list = await prisma.history.findMany({
      where: { userId: session.user.id },
      orderBy: { watchedAt: "desc" },
      take: 60,
    });
  } catch {
    // Database not configured.
  }

  if (!list.length) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Belum ada riwayat</h1>
        <p className="mt-2 text-sm text-[var(--muted-foreground)]">
          Mulai nonton dan posisi menonton kamu akan otomatis tersimpan.
        </p>
        <Button asChild className="mt-4">
          <Link href="/">Jelajah</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
        Riwayat Tonton
      </h1>
      <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((h) => {
          const progress =
            h.duration > 0 ? Math.min(100, (h.position / h.duration) * 100) : 0;
          return (
            <li key={h.id}>
              <Link
                href={`/anime/${h.anilistId}`}
                prefetch={false}
                className="group flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--card)] p-2 transition-colors hover:bg-[var(--accent)]"
              >
                <div className="relative aspect-[2/3] w-14 shrink-0 overflow-hidden rounded-md">
                  {h.image && (
                    <Image
                      src={h.image}
                      alt={h.title}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-1 text-sm font-semibold leading-snug">
                    {h.title}
                  </p>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    Episode {h.episode} · {new Date(h.watchedAt).toLocaleDateString("id-ID")}
                  </p>
                  <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-[var(--muted)]">
                    <div
                      className="h-full bg-[var(--primary)]"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
                <div className="grid size-9 place-items-center rounded-full bg-[var(--primary)]/10 text-[var(--primary)] opacity-0 transition-opacity group-hover:opacity-100">
                  <Play className="size-4 fill-current" />
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
