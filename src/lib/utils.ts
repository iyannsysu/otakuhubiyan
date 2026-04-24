import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatSeason(season?: string | null, year?: number | null) {
  if (!season && !year) return "";
  const s = season ? season.charAt(0) + season.slice(1).toLowerCase() : "";
  return [s, year].filter(Boolean).join(" ");
}

export function stripHtml(html?: string | null) {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function episodeLabel(n: number | string) {
  return `EP ${n}`;
}

export const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export function getCurrentWeekday() {
  return WEEKDAYS[new Date().getDay()];
}

export function truncate(str: string, n: number) {
  if (str.length <= n) return str;
  return str.slice(0, n - 1).trimEnd() + "…";
}
