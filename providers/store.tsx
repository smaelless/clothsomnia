"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type ReactNode,
} from "react";
import { getProduct, type Product } from "@/lib/catalog";
import { priceOf, type PriceMap } from "@/lib/offers";
import { unitPrice } from "@/lib/pricing";

export type BagLine = {
  /** Composite key — a product in two sizes is two lines. */
  id: string;
  slug: string;
  size: string;
  color: string;
  qty: number;
};

type State = {
  lines: BagLine[];
  wishlist: string[];
};

type Action =
  | { type: "hydrate"; state: State }
  | { type: "add"; slug: string; size: string; color: string; qty?: number }
  | { type: "setQty"; id: string; qty: number }
  | { type: "remove"; id: string }
  | { type: "toggleWish"; slug: string }
  | { type: "clear" };

const lineId = (slug: string, size: string, color: string) => `${slug}|${size}|${color}`;

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "hydrate":
      return action.state;
    case "add": {
      const id = lineId(action.slug, action.size, action.color);
      const existing = state.lines.find((l) => l.id === id);
      const qty = action.qty ?? 1;
      return {
        ...state,
        lines: existing
          ? state.lines.map((l) => (l.id === id ? { ...l, qty: Math.min(l.qty + qty, 10) } : l))
          : [...state.lines, { id, slug: action.slug, size: action.size, color: action.color, qty }],
      };
    }
    case "setQty":
      return {
        ...state,
        lines:
          action.qty <= 0
            ? state.lines.filter((l) => l.id !== action.id)
            : state.lines.map((l) =>
                l.id === action.id ? { ...l, qty: Math.min(action.qty, 10) } : l,
              ),
      };
    case "remove":
      return { ...state, lines: state.lines.filter((l) => l.id !== action.id) };
    case "toggleWish":
      return {
        ...state,
        wishlist: state.wishlist.includes(action.slug)
          ? state.wishlist.filter((s) => s !== action.slug)
          : [...state.wishlist, action.slug],
      };
    case "clear":
      return { ...state, lines: [] };
  }
}

export type Overlay = "bag" | "search" | "menu" | null;

type StoreValue = {
  lines: BagLine[];
  wishlist: string[];
  /** Bag lines joined to their product records, sold-out safe. */
  detailedLines: (BagLine & { product: Product })[];
  count: number;
  /** The bag at list price, before any offer. */
  fullSubtotal: number;
  /** What the item-level offers take off. */
  discount: number;
  /** What the pieces cost after offers, before any coupon. */
  subtotal: number;
  /** Live prices from the server. Null until the first fetch lands. */
  prices: PriceMap | null;
  /** The applied coupon, checked by the server. */
  coupon: { code: string; discount: number } | null;
  applyCoupon: (code: string) => Promise<string | null>;
  clearCoupon: () => void;
  couponPending: boolean;
  /** What they actually pay. */
  total: number;
  priceFor: (product: Product) => { list: number; price: number; label: string | null };
  add: (slug: string, size: string, color: string, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  toggleWish: (slug: string) => void;
  isWished: (slug: string) => boolean;
  overlay: Overlay;
  openOverlay: (o: Exclude<Overlay, null>) => void;
  closeOverlay: () => void;
  /** Fires when something is added — drives the header bag pulse. */
  pulse: number;
};

const StoreContext = createContext<StoreValue | null>(null);

const STORAGE_KEY = "clothsomnia.store.v1";

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { lines: [], wishlist: [] });
  const [overlay, setOverlay] = useState<Overlay>(null);
  const [pulse, setPulse] = useState(0);
  const [hydrated, setHydrated] = useState(false);
  const [prices, setPrices] = useState<PriceMap | null>(null);
  const [coupon, setCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [couponPending, setCouponPending] = useState(false);

  /**
   * Live prices, fetched after mount rather than rendered on the server.
   * Reading offers during render would make every page on the site dynamic;
   * this way the shop stays static and the price corrects itself immediately.
   * The server reprices the whole bag before saving an order regardless, so a
   * stale map here can never become a wrong charge.
   */
  useEffect(() => {
    let cancelled = false;
    fetch("/api/pricing")
      .then((r) => (r.ok ? r.json() : null))
      .then((map: PriceMap | null) => {
        if (!cancelled && map) setPrices(map);
      })
      .catch(() => {
        /* Offline or blocked — the pre-launch fallback still applies. */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Restore after mount so server and first client render match.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as State;
        if (Array.isArray(parsed.lines) && Array.isArray(parsed.wishlist)) {
          dispatch({ type: "hydrate", state: parsed });
        }
      }
    } catch {
      // Corrupt or unavailable storage is not a reason to break the store.
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* quota or private mode — silently continue */
    }
  }, [state, hydrated]);

  // Lock the page behind any overlay, and restore scroll precisely on close.
  useEffect(() => {
    if (!overlay) return;
    const { body } = document;
    const previous = body.style.overflow;
    body.style.overflow = "hidden";
    return () => {
      body.style.overflow = previous;
    };
  }, [overlay]);

  useEffect(() => {
    if (!overlay) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOverlay(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [overlay]);

  /**
   * Ask the server whether a code is good for this bag.
   *
   * Returns null on success, or the reason to show. Nothing is decided here —
   * the order API checks the code again from scratch, so a shopper who edits
   * this response cannot pay less than the coupon is worth.
   */
  const applyCoupon = useCallback(
    async (code: string): Promise<string | null> => {
      setCouponPending(true);
      try {
        const res = await fetch("/api/coupon", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code,
            items: state.lines.map((l) => ({ slug: l.slug, qty: l.qty })),
          }),
        });
        const data = (await res.json()) as
          | { ok: true; code: string; discount: number }
          | { ok: false; reason: string };

        if (!data.ok) {
          setCoupon(null);
          return data.reason;
        }
        setCoupon({ code: data.code, discount: data.discount });
        return null;
      } catch {
        return "Could not check that code. Check your connection.";
      } finally {
        setCouponPending(false);
      }
    },
    [state.lines],
  );

  // A coupon checked against an older bag is stale the moment the bag changes.
  useEffect(() => {
    setCoupon(null);
  }, [state.lines]);

  const add = useCallback((slug: string, size: string, color: string, qty = 1) => {
    dispatch({ type: "add", slug, size, color, qty });
    setPulse((p) => p + 1);
    setOverlay("bag");
  }, []);

  const value = useMemo<StoreValue>(() => {
    const detailedLines = state.lines
      .map((l) => {
        const product = getProduct(l.slug);
        return product ? { ...l, product } : null;
      })
      .filter((l): l is BagLine & { product: Product } => l !== null);

    /**
     * Until the price map arrives, fall back to the built-in pre-launch offer.
     * It is the same rule the server applies when it has no other offer, so the
     * number rarely changes when the map lands.
     */
    const priceFor = (product: Product) =>
      prices
        ? priceOf(prices, product.slug, product.price)
        : { list: product.price, price: unitPrice(product.price), label: null };

    // What the bag would cost at list price, and what it costs today. The
    // server recomputes both before saving an order — these numbers exist to
    // show the shopper the saving, not to decide it.
    const fullSubtotal = detailedLines.reduce((sum, l) => sum + l.product.price * l.qty, 0);
    const subtotal = detailedLines.reduce((sum, l) => sum + priceFor(l.product).price * l.qty, 0);

    // A coupon checked against a bag that has since changed must not outlive
    // it: clamped here so an edited bag can never go negative on screen.
    const couponOff = Math.min(coupon?.discount ?? 0, subtotal);

    return {
      prices,
      priceFor,
      coupon,
      couponPending,
      applyCoupon,
      clearCoupon: () => setCoupon(null),
      total: subtotal - couponOff,
      lines: state.lines,
      wishlist: state.wishlist,
      detailedLines,
      count: state.lines.reduce((n, l) => n + l.qty, 0),
      fullSubtotal,
      discount: fullSubtotal - subtotal,
      subtotal,
      add,
      setQty: (id, qty) => dispatch({ type: "setQty", id, qty }),
      remove: (id) => dispatch({ type: "remove", id }),
      clear: () => dispatch({ type: "clear" }),
      toggleWish: (slug) => dispatch({ type: "toggleWish", slug }),
      isWished: (slug) => state.wishlist.includes(slug),
      overlay,
      openOverlay: (o) => setOverlay(o),
      closeOverlay: () => setOverlay(null),
      pulse,
    };
  }, [state, overlay, pulse, add, prices, coupon, couponPending, applyCoupon]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside <StoreProvider>");
  return ctx;
}
