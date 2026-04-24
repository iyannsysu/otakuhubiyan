import Link from "next/link";
import Image from "next/image";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Bookmark, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Watchlist" };
export const dynamic = "force-dynamic";

export default async function WatchlistPage() {
  const session = await auth();

  if (!session?.user?.id) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center gap-4 px-4 py-10 text-center">
        <Bookmark className="size-10 text-[var(--primary)]" />
        <h1 className="text-2xl font-bold">Masuk untuk melihat Watchlist</h1>
        <p className="text-sm text-[var(--muted-foreground)]">
          Buat akun gratis untuk menyimpan anime favorit & riwayat menonton di
          semua perangkat.
        </p>
        <Button asChild>
          <Link href="/login">Masuk</Link>
        </Button>
      </div>
    );
  }

  let list: Awaited<ReturnType<typeof prisma.watchlist.findMany>> = [];
  try {
    list = await prisma.watchlist.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: "desc" },
    });
  } catch {
    // Database not configured. Fall through to empty state.
  }

  if (!list.length) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Watchlist kosong</h1>
        <p className="mt-2 text-sm text-[var(--muted-foreground)]">
          Simpan anime favorit kamu dengan tombol Simpan di halaman detail.
        </p>
        <Button asChild className="mt-4">
          <Link href="/">Jelajah Anime</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
        Watchlist Saya
      </h1>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {list.map((w) => (
          <Link
            key={w.id}
            href={`/anime/${w.anilistId}`}
            prefetch={false}
            className="group relative block aspect-[2/3] overflow-hidden rounded-xl bg-[var(--card)]"
          >
            {w.image && (
              <Image
                src={w.image}
                alt={w.title}
                fill
                sizes="(max-width: 640px) 45vw, 180px"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-2.5 text-white">
              <p className="line-clamp-2 text-sm font-semibold leading-snug">
                {w.title}
              </p>
            </div>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
              <div className="rounded-full bg-[var(--primary)] p-3 text-[var(--primary-foreground)]">
                <Play className="size-5 fill-current" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
