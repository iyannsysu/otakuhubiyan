"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User, LogOut, Bookmark, History } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";

export function UserMenu() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="size-10 rounded-full bg-[var(--muted)] animate-pulse" />;
  }

  if (!session) {
    return (
      <Button asChild size="sm" variant="default">
        <Link href="/login">Masuk</Link>
      </Button>
    );
  }

  const user = session.user;
  const initials = user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U";

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className="grid size-10 place-items-center overflow-hidden rounded-full bg-[var(--accent)] text-sm font-semibold text-[var(--foreground)] ring-2 ring-transparent transition-all hover:ring-[var(--primary)]/40"
          aria-label="Menu pengguna"
        >
          {user?.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.image}
              alt={user?.name || "User"}
              className="size-full object-cover"
            />
          ) : (
            initials
          )}
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className="z-50 w-56 overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--popover)] p-1 text-[var(--popover-foreground)] shadow-xl"
        >
          <div className="border-b border-[var(--border)] p-3 pb-2">
            <p className="text-sm font-semibold leading-tight">
              {user?.name || "Pengguna"}
            </p>
            {user?.email && (
              <p className="truncate text-xs text-[var(--muted-foreground)]">
                {user.email}
              </p>
            )}
          </div>
          <DropdownMenu.Item asChild className="outline-none">
            <Link
              href="/watchlist"
              className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-[var(--accent)]"
            >
              <Bookmark className="size-4" /> Watchlist
            </Link>
          </DropdownMenu.Item>
          <DropdownMenu.Item asChild className="outline-none">
            <Link
              href="/history"
              className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-[var(--accent)]"
            >
              <History className="size-4" /> Riwayat
            </Link>
          </DropdownMenu.Item>
          <DropdownMenu.Item asChild className="outline-none">
            <Link
              href="/profile"
              className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-[var(--accent)]"
            >
              <User className="size-4" /> Profil
            </Link>
          </DropdownMenu.Item>
          <DropdownMenu.Separator className="my-1 h-px bg-[var(--border)]" />
          <DropdownMenu.Item
            onSelect={() => signOut({ callbackUrl: "/" })}
            className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm outline-none hover:bg-[var(--destructive)]/10 hover:text-[var(--destructive)]"
          >
            <LogOut className="size-4" /> Keluar
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
