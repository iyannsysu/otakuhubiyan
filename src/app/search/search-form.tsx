"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { Search as SearchIcon, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const GENRES = [
  "Action",
  "Adventure",
  "Comedy",
  "Drama",
  "Ecchi",
  "Fantasy",
  "Horror",
  "Mahou Shoujo",
  "Mecha",
  "Music",
  "Mystery",
  "Psychological",
  "Romance",
  "Sci-Fi",
  "Slice of Life",
  "Sports",
  "Supernatural",
  "Thriller",
];
const SEASONS = ["WINTER", "SPRING", "SUMMER", "FALL"];
const FORMATS = ["TV", "TV_SHORT", "MOVIE", "SPECIAL", "OVA", "ONA"];

export function SearchForm({
  initial,
}: {
  initial: {
    q?: string;
    genre?: string;
    year?: string;
    season?: string;
    format?: string;
  };
}) {
  const router = useRouter();
  const sp = useSearchParams();
  const [, start] = useTransition();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState(initial.q || "");

  const submit = (patch: Record<string, string | null>) => {
    const url = new URLSearchParams(sp.toString());
    for (const [k, v] of Object.entries(patch)) {
      if (v == null || v === "") url.delete(k);
      else url.set(k, v);
    }
    start(() => {
      router.push(`/search?${url.toString()}`);
    });
  };

  return (
    <div className="space-y-3">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit({ q });
        }}
        className="flex gap-2"
      >
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari judul, karakter, atau kata kunci..."
            className="h-11 pl-9 text-base"
            autoFocus
          />
        </div>
        <Button type="submit" size="lg">
          Cari
        </Button>
        <Button
          type="button"
          size="lg"
          variant="outline"
          onClick={() => setOpen((v) => !v)}
          aria-label="Filter"
        >
          <SlidersHorizontal />
        </Button>
      </form>

      {open && (
        <div className="grid gap-3 rounded-xl border border-[var(--border)] bg-[var(--card)] p-3 sm:grid-cols-4 sm:gap-4 sm:p-4">
          <LabeledSelect
            label="Genre"
            value={initial.genre || ""}
            onChange={(v) => submit({ genre: v })}
            options={[{ value: "", label: "Semua" }, ...GENRES.map((g) => ({ value: g, label: g }))]}
          />
          <LabeledSelect
            label="Musim"
            value={initial.season || ""}
            onChange={(v) => submit({ season: v })}
            options={[
              { value: "", label: "Semua" },
              ...SEASONS.map((s) => ({
                value: s,
                label: s[0] + s.slice(1).toLowerCase(),
              })),
            ]}
          />
          <LabeledSelect
            label="Tahun"
            value={initial.year || ""}
            onChange={(v) => submit({ year: v })}
            options={[
              { value: "", label: "Semua" },
              ...Array.from({ length: 40 }).map((_, i) => {
                const y = new Date().getFullYear() - i;
                return { value: String(y), label: String(y) };
              }),
            ]}
          />
          <LabeledSelect
            label="Format"
            value={initial.format || ""}
            onChange={(v) => submit({ format: v })}
            options={[
              { value: "", label: "Semua" },
              ...FORMATS.map((f) => ({ value: f, label: f.replace("_", " ") })),
            ]}
          />
        </div>
      )}
    </div>
  );
}

function LabeledSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="block text-xs font-medium text-[var(--muted-foreground)]">
      {label}
      <select
        className="mt-1 block h-9 w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-2 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
