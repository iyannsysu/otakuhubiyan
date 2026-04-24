import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Search, Menu, X, Sparkles, Languages } from "lucide-react";
import { cn } from "../lib/utils";
import { useLang } from "../lib/i18n";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const nav = useNavigate();
  const { lang, setLang, t } = useLang();

  const links = [
    { to: "/", label: t("nav.home") },
    { to: "/search", label: t("nav.browse") },
    { to: "/genres", label: t("nav.genres") },
    { to: "/seasonal", label: t("nav.seasonal") },
    { to: "/schedule", label: t("nav.schedule") },
    { to: "/characters", label: t("nav.characters") },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!q.trim()) return;
    nav(`/search?q=${encodeURIComponent(q.trim())}`);
    setOpen(false);
  };

  const toggleLang = () => setLang(lang === "id" ? "en" : "id");

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-all duration-300",
        scrolled
          ? "backdrop-blur-xl bg-bg/70 border-b border-white/5"
          : "bg-transparent"
      )}
    >
      <div className="container-page flex h-16 items-center gap-4">
        <Link to="/" className="flex items-center gap-2 font-display">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand to-accent shadow-glow">
            <Sparkles size={18} className="text-white" />
          </span>
          <span className="text-lg font-extrabold tracking-tight">
            Otaku<span className="text-brand">Hub</span>
          </span>
        </Link>

        <nav className="ml-4 hidden md:flex items-center gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "text-white bg-white/10"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <form onSubmit={submit} className="ml-auto hidden md:flex items-center gap-2">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t("nav.search.placeholder")}
              className="w-64 rounded-xl bg-white/5 border border-white/10 pl-9 pr-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-brand/60 focus:bg-white/10 transition"
            />
          </div>
          <button
            type="button"
            onClick={toggleLang}
            aria-label={t("nav.toggle.lang")}
            title={t("nav.toggle.lang")}
            className="inline-flex items-center gap-1.5 rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-200 hover:bg-white/10 transition"
          >
            <Languages size={14} />
            {lang.toUpperCase()}
          </button>
        </form>

        <div className="ml-auto flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={toggleLang}
            aria-label={t("nav.toggle.lang")}
            className="inline-flex items-center gap-1 rounded-lg bg-white/5 border border-white/10 px-2.5 py-1.5 text-[11px] font-bold tracking-wider text-slate-200"
          >
            <Languages size={12} />
            {lang.toUpperCase()}
          </button>
          <button
            onClick={() => setOpen((v) => !v)}
            className="btn-ghost p-2"
            aria-label="Toggle menu"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-white/5 bg-bg/95 backdrop-blur-xl">
          <div className="container-page py-3 space-y-2">
            <form onSubmit={submit} className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={t("nav.search.placeholder")}
                className="w-full rounded-xl bg-white/5 border border-white/10 pl-9 pr-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-brand/60"
              />
            </form>
            <div className="grid grid-cols-2 gap-1">
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.to === "/"}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "rounded-lg px-3 py-2 text-sm font-medium",
                      isActive
                        ? "text-white bg-white/10"
                        : "text-slate-300 hover:bg-white/5"
                    )
                  }
                >
                  {l.label}
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
