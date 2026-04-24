# OtakuHub — Anime Discovery Website

Modern, fast, and beautiful anime discovery site. Powered by the [Jikan API](https://jikan.moe) (unofficial MyAnimeList API — no API key required).

## Features

- **Hero carousel** with auto-rotating featured anime
- **Top Anime** browser with filters (airing / upcoming / popular / favorites)
- **Search** with full filters: type, status, rating, genre, min score, sort
- **Anime detail** page with synopsis, trailer, episodes, characters, recommendations
- **Browse by Genre**
- **Seasonal** (now & upcoming)
- **Weekly Schedule** by day
- **Top Characters** ranking with favorites count
- **Character detail** pages
- Responsive, dark-mode-first UI with subtle motion via Framer Motion
- Built-in request **throttling + caching** to respect Jikan rate limits

## Tech stack

- React 19 + Vite + TypeScript
- React Router 7
- TailwindCSS 3
- Framer Motion
- Axios
- Lucide icons

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build
npm run lint
```

## Project structure

```
src/
├── App.tsx
├── main.tsx
├── index.css
├── lib/
│   ├── api.ts           # Jikan API client (throttled + cached)
│   └── utils.ts
├── hooks/
│   └── useAsync.ts
├── components/          # Navbar, Footer, Layout, AnimeCard, HeroCarousel, ...
└── pages/               # Home, Search, AnimeDetail, Genres, Top, Seasonal, ...
```

## Credits

Anime data © MyAnimeList, accessed through the [Jikan](https://jikan.moe) REST API. Not affiliated with MyAnimeList.
