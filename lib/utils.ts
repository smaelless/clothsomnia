import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Deterministic 32-bit string hash (FNV-1a).
 * Every procedural visual in the site derives from this, so a given
 * product always renders the identical composition on server and client.
 */
export function hash(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Pull a stable pseudo-random float in [0,1) from a seed + salt. */
export function rand(seed: string, salt = 0): number {
  return (hash(seed + ":" + salt) % 10000) / 10000;
}

/** Pick a stable element from a list for a given seed. */
export function pick<T>(list: readonly T[], seed: string, salt = 0): T {
  return list[hash(seed + "#" + salt) % list.length];
}

/** Prices are stored in centimes and shown in dirhams. */
export function formatPrice(centimes: number): string {
  return `${new Intl.NumberFormat("fr-MA", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(centimes / 100)} DH`;
}
