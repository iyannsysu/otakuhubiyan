import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-white/5 bg-bg-soft/50">
      <div className="container-page py-10 grid gap-8 md:grid-cols-3">
        <div>
          <Link to="/" className="font-display text-xl font-extrabold">
            Otaku<span className="text-brand">Hub</span>
          </Link>
          <p className="mt-2 text-sm text-slate-400">
            Discover anime, browse genres, peek at upcoming seasons, and meet
            iconic characters. Powered by the Jikan API.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-slate-300 font-semibold mb-2">Browse</div>
            <ul className="space-y-1 text-slate-400">
              <li><Link to="/search" className="hover:text-white">Search</Link></li>
              <li><Link to="/genres" className="hover:text-white">Genres</Link></li>
              <li><Link to="/seasonal" className="hover:text-white">Seasonal</Link></li>
              <li><Link to="/schedule" className="hover:text-white">Schedule</Link></li>
            </ul>
          </div>
          <div>
            <div className="text-slate-300 font-semibold mb-2">Discover</div>
            <ul className="space-y-1 text-slate-400">
              <li><Link to="/top" className="hover:text-white">Top Anime</Link></li>
              <li><Link to="/characters" className="hover:text-white">Top Characters</Link></li>
              <li>
                <a
                  className="hover:text-white"
                  href="https://jikan.moe"
                  target="_blank"
                  rel="noreferrer"
                >
                  Jikan API
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="text-sm text-slate-400 md:text-right">
          <div className="inline-flex items-center gap-1">
            Made with <Heart size={14} className="text-brand" /> for anime fans
          </div>
          <div className="mt-1">
            <a
              href="https://github.com/iyannsysu"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 hover:text-white"
            >
              @iyannsysu
            </a>
          </div>
          <div className="mt-3 text-xs text-slate-500">
            Data © MyAnimeList via Jikan. Not affiliated with MAL.
          </div>
        </div>
      </div>
    </footer>
  );
}
