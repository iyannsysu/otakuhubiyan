import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "OtakuHub — Nonton Anime",
    short_name: "OtakuHub",
    description:
      "Nonton anime streaming dengan subtitle, update harian, ringan di HP.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#0b0812",
    theme_color: "#0b0812",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Jadwal", url: "/schedule" },
      { name: "Cari", url: "/search" },
      { name: "Watchlist", url: "/watchlist" },
    ],
  };
}
