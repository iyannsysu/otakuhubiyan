import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({
  page,
  hasNext,
  onChange,
  totalPages,
}: {
  page: number;
  hasNext: boolean;
  totalPages?: number;
  onChange: (next: number) => void;
}) {
  return (
    <div className="mt-8 flex items-center justify-center gap-2">
      <button
        className="btn-ghost disabled:opacity-40 disabled:cursor-not-allowed"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
      >
        <ChevronLeft size={16} /> Prev
      </button>
      <div className="px-3 text-sm text-slate-300">
        Page <span className="font-bold text-white">{page}</span>
        {totalPages ? ` / ${totalPages}` : null}
      </div>
      <button
        className="btn-ghost disabled:opacity-40 disabled:cursor-not-allowed"
        disabled={!hasNext}
        onClick={() => onChange(page + 1)}
      >
        Next <ChevronRight size={16} />
      </button>
    </div>
  );
}
