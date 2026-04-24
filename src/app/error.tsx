"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center gap-3 px-4 py-16 text-center">
      <p className="text-6xl">💥</p>
      <h1 className="text-2xl font-bold">Terjadi kesalahan</h1>
      <p className="text-sm text-[var(--muted-foreground)]">
        Ada masalah saat memuat halaman. Silakan coba lagi.
      </p>
      <div className="flex gap-2">
        <Button onClick={() => reset()}>Coba lagi</Button>
        <Button asChild variant="outline">
          <Link href="/">Ke Home</Link>
        </Button>
      </div>
    </div>
  );
}
