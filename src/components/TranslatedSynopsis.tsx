import { useEffect, useState } from "react";
import { Languages, RefreshCw } from "lucide-react";
import { useLang } from "../lib/i18n";
import { translate } from "../lib/translate";

/**
 * Renders a long-form text (synopsis, background, about) and, when the UI
 * language is Indonesian, shows an on-the-fly Google Translate rendering.
 * Users can toggle back to the original English text at any time.
 */
export default function TranslatedSynopsis({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const { lang, t } = useLang();
  const [showOriginal, setShowOriginal] = useState(false);
  const [translated, setTranslated] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errored, setErrored] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (lang !== "id" || !text || showOriginal) {
      return;
    }
    setLoading(true);
    setErrored(false);
    translate(text, "id", "en")
      .then((out) => {
        if (cancelled) return;
        setTranslated(out);
      })
      .catch(() => {
        if (cancelled) return;
        setErrored(true);
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [text, lang, showOriginal]);

  const body =
    lang === "id" && !showOriginal && translated && !errored ? translated : text;

  return (
    <div>
      <p className={className}>{body}</p>
      {lang === "id" && (
        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-400">
          {loading && (
            <span className="inline-flex items-center gap-1.5">
              <RefreshCw size={12} className="animate-spin" />
              {t("detail.translate.loading")}
            </span>
          )}
          {errored && !loading && (
            <span className="text-amber-300">
              {t("detail.translate.failed")}
            </span>
          )}
          {!loading && (translated || showOriginal) && (
            <button
              type="button"
              onClick={() => setShowOriginal((v) => !v)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-white/5 border border-white/10 px-2.5 py-1 hover:bg-white/10 transition"
            >
              <Languages size={12} />
              {showOriginal
                ? t("detail.translate.toggleBack")
                : t("detail.translate.toggle")}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
