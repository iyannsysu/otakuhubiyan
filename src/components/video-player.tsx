"use client";

import { useEffect, useRef } from "react";
import Hls from "hls.js";

type Subtitle = { url: string; lang: string };

export function VideoPlayer({
  src,
  poster,
  subtitles,
  headers,
  onTime,
}: {
  src: string;
  poster?: string;
  subtitles?: Subtitle[];
  headers?: Record<string, string>;
  onTime?: (current: number, duration: number) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const artRef = useRef<unknown>(null);

  useEffect(() => {
    let destroyed = false;
    let art: {
      destroy: (all?: boolean) => void;
      on: (ev: string, fn: (...a: unknown[]) => void) => void;
      currentTime: number;
      duration: number;
    } | null = null;

    (async () => {
      if (!containerRef.current) return;
      const { default: Artplayer } = await import("artplayer");
      if (destroyed || !containerRef.current) return;

      const isHls = src.endsWith(".m3u8") || src.includes(".m3u8?");

      art = new Artplayer({
        container: containerRef.current,
        url: src,
        poster,
        type: isHls ? "m3u8" : undefined,
        volume: 0.8,
        autoplay: false,
        pip: true,
        setting: true,
        playbackRate: true,
        aspectRatio: true,
        fullscreen: true,
        fullscreenWeb: true,
        miniProgressBar: true,
        mutex: true,
        playsInline: true,
        autoSize: false,
        autoMini: true,
        airplay: true,
        lock: true,
        theme: "#a855f7",
        subtitle: subtitles?.length
          ? {
              url: subtitles[0].url,
              type: subtitles[0].url.endsWith(".ass") ? "ass" : "vtt",
              style: {
                color: "#fff",
                fontSize: "18px",
                textShadow: "0 0 4px rgba(0,0,0,0.9)",
              },
              encoding: "utf-8",
            }
          : undefined,
        customType: isHls
          ? {
              m3u8: (video: HTMLVideoElement, url: string) => {
                if (Hls.isSupported()) {
                  const hls = new Hls({
                    xhrSetup: headers
                      ? (xhr) => {
                          for (const [k, v] of Object.entries(headers)) {
                            try {
                              xhr.setRequestHeader(k, v);
                            } catch {
                              /* browser may block protected headers */
                            }
                          }
                        }
                      : undefined,
                  });
                  hls.loadSource(url);
                  hls.attachMedia(video);
                } else if (
                  video.canPlayType("application/vnd.apple.mpegurl")
                ) {
                  video.src = url;
                }
              },
            }
          : undefined,
      });

      artRef.current = art;

      if (onTime) {
        art.on("video:timeupdate", () => {
          if (art) onTime(art.currentTime, art.duration);
        });
      }
    })();

    return () => {
      destroyed = true;
      try {
        art?.destroy(true);
      } catch {
        /* noop */
      }
      artRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  return (
    <div
      ref={containerRef}
      className="relative aspect-video w-full overflow-hidden rounded-xl bg-black"
    />
  );
}
