import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function SectionHeader({
  title,
  subtitle,
  to,
  ctaLabel = "See all",
}: {
  title: string;
  subtitle?: string;
  to?: string;
  ctaLabel?: string;
}) {
  return (
    <div className="mb-4 flex items-end justify-between gap-3">
      <div>
        <h2 className="font-display text-2xl md:text-3xl font-extrabold tracking-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1 text-sm text-slate-400">{subtitle}</p>
        )}
      </div>
      {to && (
        <Link
          to={to}
          className="text-sm text-slate-300 hover:text-white inline-flex items-center gap-1"
        >
          {ctaLabel} <ArrowRight size={14} />
        </Link>
      )}
    </div>
  );
}
