"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Search, Flame, Calendar, Bookmark, History, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";
import { UserMenu } from "./user-menu";

const NAV_LINKS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/browse", label: "Jelajah", icon: Flame },
  { href: "/schedule", label: "Jadwal", icon: Calendar },
  { href: "/watchlist", label: "Watchlist", icon: Bookmark },
  { href: "/history", label: "Riwayat", icon: History },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-200",
        scrolled || pathname !== "/"
          ? "border-b border-[var(--border)] bg-[var(--background)]/85 backdrop-blur-xl"
          : "bg-gradient-to-b from-black/70 to-transparent",
      )}
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-4 sm:h-16 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold tracking-tight"
        >
          <span className="relative grid size-8 place-items-center rounded-lg bg-gradient-to-br from-[var(--primary)] to-pink-500 font-black text-white shadow-lg">
            O
          </span>
          <span className="hidden text-lg sm:inline">OtakuHub</span>
        </Link>

        <nav className="ml-4 hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((l) => {
            const active =
              l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-[var(--accent)] text-[var(--accent-foreground)]"
                    : "text-[var(--muted-foreground)] hover:bg-[var(--accent)]/60 hover:text-[var(--foreground)]",
                )}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex flex-1 items-center justify-end gap-1 sm:gap-2">
          <Link
            href="/search"
            aria-label="Cari"
            className="inline-flex size-10 items-center justify-center rounded-lg text-[var(--muted-foreground)] transition-colors hover:bg-[var(--accent)] hover:text-[var(--foreground)]"
          >
            <Search className="size-5" />
          </Link>
          <ThemeToggle />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-[var(--border)] bg-[var(--background)]/95 backdrop-blur-xl md:hidden">
      <ul className="mx-auto grid max-w-2xl grid-cols-5">
        {NAV_LINKS.map((l) => {
          const Icon = l.icon;
          const active =
            l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
          return (
            <li key={l.href}>
              <Link
                href={l.href}
                className={cn(
                  "flex flex-col items-center gap-0.5 py-2 text-[10px] font-medium transition-colors",
                  active
                    ? "text-[var(--primary)]"
                    : "text-[var(--muted-foreground)]",
                )}
              >
                <Icon className="size-5" />
                {l.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
