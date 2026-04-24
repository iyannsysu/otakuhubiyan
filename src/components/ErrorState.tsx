import { AlertTriangle, RotateCw } from "lucide-react";

export default function ErrorState({
  message = "Something went wrong loading data.",
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="card p-8 text-center">
      <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-brand/15 text-brand">
        <AlertTriangle size={22} />
      </div>
      <p className="text-slate-300">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-ghost mt-4">
          <RotateCw size={14} /> Try again
        </button>
      )}
    </div>
  );
}
