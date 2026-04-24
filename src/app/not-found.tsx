import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 py-16 text-center">
      <p className="text-6xl font-black text-[var(--primary)]">404</p>
      <h1 className="mt-2 text-2xl font-bold">Halaman tidak ditemukan</h1>
      <p className="mt-2 text-sm text-[var(--muted-foreground)]">
        Anime atau halaman yang kamu cari tidak ada.
      </p>
      <Button asChild className="mt-6">
        <Link href="/">Kembali ke Home</Link>
      </Button>
    </div>
  );
}
