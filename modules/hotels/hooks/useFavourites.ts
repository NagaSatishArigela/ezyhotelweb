"use client";

import { useCallback, useSyncExternalStore } from "react";

const KEY = "pph_favourites";
const CHANGE_EVENT = "pph-favourites-change";
type FavouriteId = number | string;

function snapshot(): string {
  try { return localStorage.getItem(KEY) ?? "[]"; } catch { return "[]"; }
}
function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(CHANGE_EVENT, callback);
  };
}
function parse(raw: string): FavouriteId[] {
  try {
    const value: unknown = JSON.parse(raw);
    return Array.isArray(value) ? value.filter((id): id is FavouriteId => typeof id === "string" || typeof id === "number") : [];
  } catch { return []; }
}
export function useFavourites() {
  const raw = useSyncExternalStore(subscribe, snapshot, () => "[]");
  const favourites = parse(raw);
  const toggle = useCallback((id: FavouriteId) => {
    const previous = parse(snapshot());
    const next = previous.includes(id) ? previous.filter((item) => item !== id) : [...previous, id];
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
      window.dispatchEvent(new Event(CHANGE_EVENT));
    } catch { /* Storage may be disabled or full. */ }
  }, []);
  return { favourites, toggle, isFavourite: (id: FavouriteId) => favourites.includes(id) };
}
