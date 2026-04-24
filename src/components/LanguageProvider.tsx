import { useEffect, useMemo, useState } from "react";
import { DICTS, LanguageContext, type Lang } from "../lib/i18n";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof window === "undefined") return "id";
    const saved = localStorage.getItem("otakuhub.lang") as Lang | null;
    if (saved === "id" || saved === "en") return saved;
    const browser = navigator.language?.toLowerCase() ?? "";
    return browser.startsWith("en") ? "en" : "id";
  });

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem("otakuhub.lang", l);
    } catch {
      // ignore storage errors (private mode, etc.)
    }
  };

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const value = useMemo(
    () => ({
      lang,
      setLang,
      t: (key: string) => DICTS[lang][key] ?? DICTS.en[key] ?? key,
    }),
    [lang]
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}
