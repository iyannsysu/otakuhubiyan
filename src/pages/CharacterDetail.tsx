import { useParams } from "react-router-dom";
import { Heart } from "lucide-react";
import { useAsync } from "../hooks/useAsync";
import { api } from "../lib/api";
import ErrorState from "../components/ErrorState";
import { formatNumber, imageOf } from "../lib/utils";

export default function CharacterDetail() {
  const { id } = useParams();
  const charId = Number(id);
  const { data, loading, error, reload } = useAsync(
    () => api.character(charId),
    [charId]
  );

  if (loading) {
    return (
      <div className="container-page py-10 grid md:grid-cols-[280px_1fr] gap-6">
        <div className="aspect-[3/4] skeleton rounded-2xl" />
        <div className="space-y-3">
          <div className="h-8 w-1/2 skeleton" />
          <div className="h-4 w-1/3 skeleton" />
          <div className="h-40 skeleton" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="container-page py-10">
        <ErrorState onRetry={reload} />
      </div>
    );
  }

  return (
    <div className="container-page py-10 grid md:grid-cols-[280px_1fr] gap-8">
      <div>
        <div className="aspect-[3/4] overflow-hidden rounded-2xl border border-white/10 shadow-soft">
          <img
            src={imageOf(data.images)}
            alt={data.name}
            className="h-full w-full object-cover"
          />
        </div>
        {typeof data.favorites === "number" && (
          <div className="mt-3 inline-flex items-center gap-1 chip chip-active">
            <Heart size={12} fill="currentColor" />{" "}
            {formatNumber(data.favorites)} favorites
          </div>
        )}
      </div>
      <div>
        <h1 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight">
          {data.name}
        </h1>
        {data.name_kanji && (
          <p className="text-slate-400 mt-1">{data.name_kanji}</p>
        )}
        {data.nicknames && data.nicknames.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {data.nicknames.map((n) => (
              <span key={n} className="chip">
                {n}
              </span>
            ))}
          </div>
        )}
        {data.about && (
          <div className="mt-6 card p-5">
            <h3 className="text-lg font-bold mb-2">About</h3>
            <p className="text-slate-300 whitespace-pre-line leading-relaxed text-sm">
              {data.about}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
