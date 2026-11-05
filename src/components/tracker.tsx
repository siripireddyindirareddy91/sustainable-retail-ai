"use client";
import { useEffect } from "react";
import { useStore } from "./store";
export function TrackProduct({ id }: { id: string }) {
  const { track, ready } = useStore();
  useEffect(() => {
    if (ready) track(id);
  }, [id, ready]);
  return null;
}
