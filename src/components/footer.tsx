import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[var(--border)] bg-[var(--card)]/50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <div className="flex items-center gap-2 font-bold">
              <span className="grid size-8 place-items-center rounded-lg bg-gradient-to-br from-[var(--primary)] to-pink-500 text-white">
                O
              </span>
              OtakuHub
            </div>
            <p className="mt-3 text-sm text-[var(--muted-foreground)]">
              Nonton anime favorit kamu, update harian, ringan di HP, dengan
              subtitle multi-bahasa.
            </p>
          </div>
          <div>
            <p className="mb-3 text-sm font-semibold">Jelajah</p>
            <ul className="space-y-1.5 text-sm text-[var(--muted-foreground)]">
              <li>
                <Link href="/browse" className="hover:text-[var(--foreground)]">
                  Jelajah
                </Link>
              </li>
              <li>
                <Link href="/schedule" className="hover:text-[var(--foreground)]">
                  Jadwal
                </Link>
              </li>
              <li>
                <Link href="/search" className="hover:text-[var(--foreground)]">
                  Cari
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="mb-3 text-sm font-semibold">Legal</p>
            <ul className="space-y-1.5 text-sm text-[var(--muted-foreground)]">
              <li>Disclaimer: Konten disediakan pihak ketiga.</li>
              <li>Kami tidak meng-host file video.</li>
              <li>Data anime via AniList.co</li>
            </ul>
          </div>
        </div>
        <p className="mt-8 text-xs text-[var(--muted-foreground)]">
          © {new Date().getFullYear()} OtakuHub. Built for weebs with love.
        </p>
      </div>
    </footer>
  );
}
