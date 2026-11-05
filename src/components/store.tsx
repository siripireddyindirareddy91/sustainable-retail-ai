"use client";
import { browserDatabase } from "@/lib/browser";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
type State = {
  wishlist: string[];
  compare: string[];
  cart: string[];
  recent: string[];
  history: string[];
};
const initial: State = {
  wishlist: [],
  compare: [],
  cart: [],
  recent: [],
  history: [],
};
const Context = createContext<{
  state: State;
  toggle: (key: keyof State, id: string) => void;
  track: (id: string) => void;
  clear: (key: keyof State) => void;
  ready: boolean;
  notice: string;
}>({
  state: initial,
  toggle: () => {},
  track: () => {},
  clear: () => {},
  ready: false,
  notice: "",
});
export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(initial);
  const [ready, setReady] = useState(false);
  const [notice, setNotice] = useState("");
  useEffect(() => {
    const db = browserDatabase();
    if (!db) return;
    const { data } = db.auth.onAuthStateChange((_event, session) => {
      if (session) {
        localStorage.setItem("eco-token", session.access_token);
        localStorage.setItem(
          "eco-user",
          JSON.stringify({ email: session.user.email, id: session.user.id }),
        );
      } else {
        localStorage.removeItem("eco-token");
        localStorage.removeItem("eco-user");
      }
    });
    return () => data.subscription.unsubscribe();
  }, []);
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("eco-state") || "null");
      if (stored)
        setState(
          Object.fromEntries(
            Object.keys(initial).map((k) => [
              k,
              Array.isArray(stored[k])
                ? stored[k].filter((v: unknown) => typeof v === "string")
                : [],
            ]),
          ) as State,
        );
    } catch {}
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready) localStorage.setItem("eco-state", JSON.stringify(state));
  }, [state, ready]);
  function toggle(key: keyof State, id: string) {
    if (
      key === "compare" &&
      !state.compare.includes(id) &&
      state.compare.length === 4
    ) {
      setNotice("You can compare up to four products.");
      return;
    }
    setState((s) => ({
      ...s,
      [key]: s[key].includes(id)
        ? s[key].filter((x) => x !== id)
        : [...s[key], id],
    }));
    const token = localStorage.getItem("eco-token");
    if (key === "wishlist" && token) {
      fetch(`/api/wishlist${state.wishlist.includes(id) ? `/${id}` : ""}`, {
        method: state.wishlist.includes(id) ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: state.wishlist.includes(id)
          ? undefined
          : JSON.stringify({ productId: id }),
      })
        .then((r) => {
          if (!r.ok)
            setNotice(
              "Saved on this device. Cloud sync is currently unavailable.",
            );
        })
        .catch(() =>
          setNotice(
            "Saved on this device. Cloud sync is currently unavailable.",
          ),
        );
    }
  }
  return (
    <Context.Provider
      value={{
        state,
        toggle,
        clear: (key) => setState((s) => ({ ...s, [key]: [] })),
        track: (id) =>
          setState((s) => ({
            ...s,
            recent: [id, ...s.recent.filter((x) => x !== id)].slice(0, 12),
          })),
        ready,
        notice,
      }}
    >
      {children}
      {notice && (
        <button className="toast" onClick={() => setNotice("")}>
          {notice} ×
        </button>
      )}
    </Context.Provider>
  );
}
export const useStore = () => useContext(Context);
