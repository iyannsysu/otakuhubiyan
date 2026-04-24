// Free translation via Google Translate's unauthenticated public endpoint.
// This is the same endpoint used by Google's own client-side translate widget
// and many OSS projects; it has no SLA, so we treat failures gracefully.
//
// Endpoint returns a JSON-ish array structure. We extract the translated
// segments and concatenate them.

const TRANSLATE_ENDPOINT = "https://translate.googleapis.com/translate_a/single";

// In-memory cache keyed by lang + text. Synopses are long so we also persist
// successful translations to localStorage for cross-session reuse.
const mem = new Map<string, string>();

type GTResponse = [Array<[string, string, ...unknown[]]>, ...unknown[]];

function storageKey(lang: string, text: string) {
  // djb2-ish hash – enough to avoid localStorage key bloat.
  let h = 5381;
  for (let i = 0; i < text.length; i++) h = ((h << 5) + h + text.charCodeAt(i)) | 0;
  return `otakuhub.tr.${lang}.${h}`;
}

function readStore(lang: string, text: string): string | null {
  try {
    return localStorage.getItem(storageKey(lang, text));
  } catch {
    return null;
  }
}
function writeStore(lang: string, text: string, value: string) {
  try {
    localStorage.setItem(storageKey(lang, text), value);
  } catch {
    // ignore
  }
}

export async function translate(
  text: string,
  targetLang: "id" | "en",
  sourceLang: "en" | "auto" = "auto"
): Promise<string> {
  const trimmed = text.trim();
  if (!trimmed) return "";
  if (targetLang === "en" && sourceLang === "en") return text;

  const key = `${sourceLang}->${targetLang}::${trimmed}`;
  const mh = mem.get(key);
  if (mh) return mh;
  const sh = readStore(targetLang, trimmed);
  if (sh) {
    mem.set(key, sh);
    return sh;
  }

  // Google Translate rejects requests above ~5k chars; chunk at paragraph boundaries.
  const chunks = chunkText(trimmed, 4500);
  const outs: string[] = [];
  for (const chunk of chunks) {
    const params = new URLSearchParams({
      client: "gtx",
      sl: sourceLang,
      tl: targetLang,
      dt: "t",
      q: chunk,
    });
    const res = await fetch(`${TRANSLATE_ENDPOINT}?${params.toString()}`);
    if (!res.ok) throw new Error(`translate http ${res.status}`);
    const data = (await res.json()) as GTResponse;
    const segments = data[0] ?? [];
    outs.push(segments.map((s) => s[0]).join(""));
  }
  const joined = outs.join("");
  mem.set(key, joined);
  writeStore(targetLang, trimmed, joined);
  return joined;
}

function chunkText(text: string, max: number): string[] {
  if (text.length <= max) return [text];
  const out: string[] = [];
  const paras = text.split(/\n\s*\n/);
  let buf = "";
  for (const p of paras) {
    if ((buf + "\n\n" + p).length > max) {
      if (buf) out.push(buf);
      if (p.length > max) {
        for (let i = 0; i < p.length; i += max) out.push(p.slice(i, i + max));
        buf = "";
      } else {
        buf = p;
      }
    } else {
      buf = buf ? buf + "\n\n" + p : p;
    }
  }
  if (buf) out.push(buf);
  return out;
}
