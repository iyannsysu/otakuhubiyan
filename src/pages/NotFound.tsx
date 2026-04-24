import { Link } from "react-router-dom";
import { useT } from "../lib/i18n";

export default function NotFound() {
  const t = useT();
  return (
    <div className="container-page py-24 text-center">
      <div className="font-display text-7xl font-extrabold bg-gradient-to-r from-brand to-accent bg-clip-text text-transparent">
        404
      </div>
      <h1 className="mt-4 text-2xl font-bold">{t("notfound.title")}</h1>
      <p className="mt-2 text-slate-400">{t("notfound.desc")}</p>
      <Link to="/" className="btn-primary mt-6">
        {t("notfound.back")}
      </Link>
    </div>
  );
}
