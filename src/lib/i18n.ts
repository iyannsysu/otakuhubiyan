import { createContext, useContext } from "react";

export type Lang = "id" | "en";

type Dict = Record<string, string>;

const en: Dict = {
  "nav.home": "Home",
  "nav.browse": "Browse",
  "nav.genres": "Genres",
  "nav.seasonal": "Seasonal",
  "nav.schedule": "Schedule",
  "nav.characters": "Characters",
  "nav.search.placeholder": "Search anime…",
  "nav.toggle.lang": "Language",

  "common.loading": "Loading…",
  "common.retry": "Retry",
  "common.error": "Something went wrong.",
  "common.empty": "No results.",
  "common.search": "Search",
  "common.apply": "Apply",
  "common.reset": "Reset",
  "common.viewAll": "View details",
  "common.next": "Next",
  "common.prev": "Previous",
  "common.page": "Page",

  "home.top.title": "Top Anime",
  "home.top.subtitle": "The highest rated series of all time",
  "home.airing.title": "Currently Airing",
  "home.airing.subtitle": "Now streaming this season",
  "home.season.title": "This Season",
  "home.season.subtitle": "Fresh drops you shouldn't miss",
  "home.upcoming.title": "Upcoming",
  "home.upcoming.subtitle": "Coming soon to a screen near you",

  "search.title": "Browse Anime",
  "search.subtitle": "Fine-tune with filters to find your next obsession",
  "filter.type": "Type",
  "filter.status": "Status",
  "filter.rating": "Rating",
  "filter.genre": "Genre",
  "filter.minScore": "Min Score",
  "filter.orderBy": "Order by",
  "filter.sort": "Sort",
  "filter.any": "Any",
  "filter.asc": "Ascending",
  "filter.desc": "Descending",

  "detail.synopsis": "Synopsis",
  "detail.background": "Background",
  "detail.characters": "Characters",
  "detail.characters.sub": "Main and supporting cast",
  "detail.episodes": "Episodes",
  "detail.episodes.sub": "First episodes list",
  "detail.recs": "Recommendations",
  "detail.recs.sub": "If you liked this, you might enjoy…",
  "detail.watchNow": "Watch Now",
  "detail.translate.loading": "Translating synopsis…",
  "detail.translate.toggle": "Show original (English)",
  "detail.translate.toggleBack": "Show in Indonesian",
  "detail.translate.failed": "Failed to translate. Showing original.",
  "detail.stat.type": "Type",
  "detail.stat.episodes": "Episodes",
  "detail.stat.aired": "Aired",
  "detail.stat.duration": "Duration",
  "detail.stat.status": "Status",
  "detail.stat.source": "Source",
  "detail.stat.rating": "Rating",
  "detail.stat.studio": "Studio",
  "detail.stat.members": "members",

  "watch.title": "Watch",
  "watch.subtitle": "Where to watch this anime",
  "watch.back": "Back to details",
  "watch.providers.title": "Streaming Providers",
  "watch.providers.sub": "Official streaming platforms for this title",
  "watch.providers.empty":
    "No official streaming providers listed for this title yet. Try the external sites below.",
  "watch.episodes.title": "Episodes",
  "watch.episodes.sub": "Episode thumbnails link to MyAnimeList",
  "watch.pv.title": "Trailers & PVs",
  "watch.pv.sub": "Official promos and music videos",
  "watch.external.title": "External Links",
  "watch.disclaimer":
    "OtakuHub does not host or stream anime content. Links above point to third-party services.",

  "schedule.title": "Weekly Schedule",
  "schedule.subtitle": "Currently airing anime by broadcast day",

  "seasonal.title": "Seasonal Anime",
  "seasonal.subtitle": "Catch up on this season's lineup",

  "genres.title": "Genres",
  "genres.subtitle": "Browse anime by genre",

  "characters.title": "Top Characters",
  "characters.subtitle": "The most beloved characters of all time",

  "top.title": "Top Anime",
  "top.subtitle": "The highest rated anime on MyAnimeList",
  "top.filter.all": "All",
  "top.filter.airing": "Airing",
  "top.filter.upcoming": "Upcoming",
  "top.filter.popular": "Popular",
  "top.filter.favorite": "Favorite",

  "footer.tagline": "Discover your next favorite anime.",
  "footer.credit": "Data by Jikan (MyAnimeList). Not affiliated.",

  "notfound.title": "Lost in the anime multiverse",
  "notfound.desc": "The page you're looking for doesn't exist.",
  "notfound.back": "Back to Home",
};

const id: Dict = {
  "nav.home": "Beranda",
  "nav.browse": "Jelajah",
  "nav.genres": "Genre",
  "nav.seasonal": "Musiman",
  "nav.schedule": "Jadwal",
  "nav.characters": "Karakter",
  "nav.search.placeholder": "Cari anime…",
  "nav.toggle.lang": "Bahasa",

  "common.loading": "Memuat…",
  "common.retry": "Coba lagi",
  "common.error": "Terjadi kesalahan.",
  "common.empty": "Tidak ada hasil.",
  "common.search": "Cari",
  "common.apply": "Terapkan",
  "common.reset": "Atur ulang",
  "common.viewAll": "Lihat detail",
  "common.next": "Selanjutnya",
  "common.prev": "Sebelumnya",
  "common.page": "Halaman",

  "home.top.title": "Anime Teratas",
  "home.top.subtitle": "Seri dengan rating tertinggi sepanjang masa",
  "home.airing.title": "Sedang Tayang",
  "home.airing.subtitle": "Sedang disiarkan musim ini",
  "home.season.title": "Musim Ini",
  "home.season.subtitle": "Judul baru yang wajib kamu tonton",
  "home.upcoming.title": "Akan Datang",
  "home.upcoming.subtitle": "Segera tayang di layar favoritmu",

  "search.title": "Jelajah Anime",
  "search.subtitle": "Pakai filter untuk nemuin obsesi berikutnya",
  "filter.type": "Tipe",
  "filter.status": "Status",
  "filter.rating": "Rating",
  "filter.genre": "Genre",
  "filter.minScore": "Skor Minimum",
  "filter.orderBy": "Urut berdasarkan",
  "filter.sort": "Urutan",
  "filter.any": "Semua",
  "filter.asc": "Naik",
  "filter.desc": "Turun",

  "detail.synopsis": "Sinopsis",
  "detail.background": "Latar Belakang",
  "detail.characters": "Karakter",
  "detail.characters.sub": "Pemeran utama & pendukung",
  "detail.episodes": "Episode",
  "detail.episodes.sub": "Daftar episode awal",
  "detail.recs": "Rekomendasi",
  "detail.recs.sub": "Kalau kamu suka ini, mungkin suka juga…",
  "detail.watchNow": "Tonton Sekarang",
  "detail.translate.loading": "Menerjemahkan sinopsis…",
  "detail.translate.toggle": "Tampilkan asli (Inggris)",
  "detail.translate.toggleBack": "Tampilkan dalam Bahasa Indonesia",
  "detail.translate.failed": "Gagal menerjemahkan. Menampilkan versi asli.",
  "detail.stat.type": "Tipe",
  "detail.stat.episodes": "Episode",
  "detail.stat.aired": "Tayang",
  "detail.stat.duration": "Durasi",
  "detail.stat.status": "Status",
  "detail.stat.source": "Sumber",
  "detail.stat.rating": "Rating",
  "detail.stat.studio": "Studio",
  "detail.stat.members": "anggota",

  "watch.title": "Tonton",
  "watch.subtitle": "Tempat nonton anime ini",
  "watch.back": "Kembali ke detail",
  "watch.providers.title": "Penyedia Streaming",
  "watch.providers.sub": "Platform streaming resmi untuk judul ini",
  "watch.providers.empty":
    "Belum ada penyedia streaming resmi untuk judul ini. Coba tautan eksternal di bawah.",
  "watch.episodes.title": "Episode",
  "watch.episodes.sub": "Thumbnail episode tertaut ke MyAnimeList",
  "watch.pv.title": "Trailer & PV",
  "watch.pv.sub": "Promo dan video musik resmi",
  "watch.external.title": "Tautan Eksternal",
  "watch.disclaimer":
    "OtakuHub tidak meng-host atau menayangkan konten anime. Tautan di atas mengarah ke layanan pihak ketiga.",

  "schedule.title": "Jadwal Mingguan",
  "schedule.subtitle": "Anime yang sedang tayang berdasarkan hari siaran",

  "seasonal.title": "Anime Musiman",
  "seasonal.subtitle": "Telusuri daftar anime musim ini",

  "genres.title": "Genre",
  "genres.subtitle": "Jelajahi anime berdasarkan genre",

  "characters.title": "Karakter Teratas",
  "characters.subtitle": "Karakter paling dicintai sepanjang masa",

  "top.title": "Anime Teratas",
  "top.subtitle": "Anime dengan rating tertinggi di MyAnimeList",
  "top.filter.all": "Semua",
  "top.filter.airing": "Sedang Tayang",
  "top.filter.upcoming": "Akan Datang",
  "top.filter.popular": "Populer",
  "top.filter.favorite": "Favorit",

  "footer.tagline": "Temukan anime favorit berikutnya.",
  "footer.credit": "Data oleh Jikan (MyAnimeList). Tidak berafiliasi.",

  "notfound.title": "Tersesat di multiverse anime",
  "notfound.desc": "Halaman yang kamu cari tidak ada.",
  "notfound.back": "Kembali ke Beranda",
};

export const DICTS: Record<Lang, Dict> = { en, id };

export type LanguageCtx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
};

export const LanguageContext = createContext<LanguageCtx | null>(null);

export function useLang(): LanguageCtx {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used inside LanguageProvider");
  return ctx;
}

export function useT() {
  return useLang().t;
}
