"use client";

import { useState, useEffect, useCallback } from "react";

const KEY = "pph_favourites";

type FavouriteId = number | string;

function readStorage(): FavouriteId[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(KEY) ?? "[]"); } catch { return []; }
}

export function useFavourites() {
  const [favourites, setFavourites] = useState<FavouriteId[]>([]);

  useEffect(() => { setFavourites(readStorage()); }, []);

  const toggle = useCallback((id: FavouriteId) => {
    setFavourites((prev) => {
      const next = prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id];
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const isFavourite = useCallback((id: FavouriteId) => favourites.includes(id), [favourites]);

  return { favourites, toggle, isFavourite };
}
