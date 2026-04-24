"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function WatchlistButton({
  anilistId,
  title,
  image,
}: {
  anilistId: number;
  title: string;
  image?: string;
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const [inList, setInList] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!session) return;
    let cancelled = false;
    fetch(`/api/watchlist?anilistId=${anilistId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!cancelled && d) setInList(Boolean(d.exists));
      })
      .catch(() => void 0);
    return () => {
      cancelled = true;
    };
  }, [anilistId, session]);

  const toggle = async () => {
    if (!session) {
      router.push("/login");
      return;
    }
    setLoading(true);
    try {
      if (inList) {
        await fetch(`/api/watchlist?anilistId=${anilistId}`, {
          method: "DELETE",
        });
        setInList(false);
      } else {
        await fetch("/api/watchlist", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ anilistId, title, image }),
        });
        setInList(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant={inList ? "secondary" : "outline"}
      size="lg"
      onClick={toggle}
      disabled={loading}
    >
      {inList ? (
        <>
          <BookmarkCheck className="fill-current" /> Tersimpan
        </>
      ) : (
        <>
          <Bookmark /> Simpan
        </>
      )}
    </Button>
  );
}
