"use client";

import { useCallback, useRef } from "react";
import { useSession } from "next-auth/react";
import { VideoPlayer } from "@/components/video-player";

export function WatchClient({
  anilistId,
  title,
  image,
  episode,
  episodeId,
  src,
  subtitles,
  headers,
  poster,
}: {
  anilistId: number;
  title: string;
  image?: string;
  episode: number;
  episodeId: string;
  src: string;
  subtitles?: { url: string; lang: string }[];
  headers?: Record<string, string>;
  poster?: string;
}) {
  const { data: session } = useSession();
  const lastSent = useRef(0);

  const onTime = useCallback(
    (position: number, duration: number) => {
      if (!session || !episodeId) return;
      if (!duration) return;
      const now = Date.now();
      if (now - lastSent.current < 10_000) return;
      lastSent.current = now;
      fetch("/api/history", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          anilistId,
          title,
          image,
          episode,
          episodeId,
          position,
          duration,
        }),
      }).catch(() => void 0);
    },
    [session, anilistId, title, image, episode, episodeId],
  );

  return (
    <VideoPlayer
      src={src}
      poster={poster}
      subtitles={subtitles}
      headers={headers}
      onTime={onTime}
    />
  );
}
