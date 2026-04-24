import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Profil" };
export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  let counts = { watchlist: 0, history: 0 };
  try {
    const [w, h] = await Promise.all([
      prisma.watchlist.count({ where: { userId: session.user.id } }),
      prisma.history.count({ where: { userId: session.user.id } }),
    ]);
    counts = { watchlist: w, history: h };
  } catch {
    /* db not configured */
  }

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6 px-4 py-8 sm:px-6">
      <div className="flex items-center gap-4">
        <div className="relative size-16 overflow-hidden rounded-full bg-[var(--accent)]">
          {session.user.image ? (
            <Image
              src={session.user.image}
              alt={session.user.name || "User"}
              fill
              sizes="64px"
              className="object-cover"
            />
          ) : null}
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-2xl font-extrabold tracking-tight">
            {session.user.name || "Pengguna"}
          </h1>
          <p className="truncate text-sm text-[var(--muted-foreground)]">
            {session.user.email}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Link
          href="/watchlist"
          className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 transition-colors hover:bg-[var(--accent)]"
        >
          <p className="text-xs text-[var(--muted-foreground)]">Watchlist</p>
          <p className="mt-1 text-2xl font-bold">{counts.watchlist}</p>
        </Link>
        <Link
          href="/history"
          className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 transition-colors hover:bg-[var(--accent)]"
        >
          <p className="text-xs text-[var(--muted-foreground)]">Episode ditonton</p>
          <p className="mt-1 text-2xl font-bold">{counts.history}</p>
        </Link>
      </div>

      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/" });
        }}
      >
        <Button type="submit" variant="outline" className="w-full">
          Keluar
        </Button>
      </form>
    </div>
  );
}
