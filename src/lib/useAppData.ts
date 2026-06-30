"use client";

import { useEffect, useState } from "react";
import type { BrawlerBase, GameMap } from "@/types";

interface AppData {
  brawlers: BrawlerBase[];
  maps: GameMap[];
  rankedRotation: GameMap[];
  loading: boolean;
  error: string | null;
}

export function useAppData(): AppData {
  const [brawlers, setBrawlers] = useState<BrawlerBase[]>([]);
  const [maps, setMaps] = useState<GameMap[]>([]);
  const [rankedRotation, setRankedRotation] = useState<GameMap[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/brawlers").then((r) => r.json()),
      fetch("/api/maps").then((r) => r.json()),
      fetch("/api/ranked-rotation").then((r) => r.json()),
    ])
      .then(([b, m, rr]) => {
        setBrawlers(b);
        setMaps(m);
        setRankedRotation(Array.isArray(rr) ? rr : []);
      })
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false));
  }, []);

  return { brawlers, maps, rankedRotation, loading, error };
}
