import Image from "next/image";
import type { ReactNode } from "react";
import type { Tone } from "@/lib/catalog";
import { cn, hash, rand } from "@/lib/utils";

/**
 * PLATE — the site's image system.
 *
 * Campaign photography does not exist yet, and stock imagery would flatten the
 * art direction. So a plate is *composed*: the seed string is hashed into a
 * deterministic layout of haze fields, an abstract garment figure with a rim
 * light, and blueprint linework. Same seed always renders the same frame, on
 * server and client alike.
 *
 * When real photography arrives, pass `src` — everything else stays put.
 */

type PlateProps = {
  /** Any stable string. Product slug, look id, frame id. */
  seed: string;
  tone?: Tone;
  /** `figure` draws a garment silhouette. `field` is atmosphere only. */
  variant?: "figure" | "field";
  /** Real photography. Supplying this bypasses the procedural composition. */
  src?: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
  children?: ReactNode;
};

const TONES: Record<Tone, { key: string; edge: string; deep: string }> = {
  violet: { key: "#7C3BFF", edge: "#C9B0FF", deep: "#1A0B3D" },
  cobalt: { key: "#1B3BFF", edge: "#8FA6FF", deep: "#060F3A" },
  magenta: { key: "#FF2FA0", edge: "#FFB0D8", deep: "#3B0722" },
  lime: { key: "#C6FF3D", edge: "#E8FFAE", deep: "#1B2A05" },
  silver: { key: "#C9D2E3", edge: "#F2F5FA", deep: "#171A22" },
  navy: { key: "#2B48B8", edge: "#93A9F0", deep: "#060A1E" },
};

/**
 * Abstract garment figures. Drawn on a 400×620 stage, bottom-anchored so the
 * frame crops at the shin the way a lookbook plate would.
 */
const FIGURES: { body: string; layer?: string; note?: string }[] = [
  {
    // Long trench — flared hem, belted
    body: "M200 126 L266 158 L292 306 L276 470 L262 588 L200 596 L138 588 L124 470 L108 306 L134 158 Z",
    layer: "M126 330 H274 M200 150 V596",
    note: "M120 322 H280 L278 348 H122 Z",
  },
  {
    // Hooded fleece + wide leg
    body: "M200 128 L260 158 L276 258 L270 344 L130 344 L124 258 L140 158 Z",
    layer:
      "M132 350 L268 350 L276 476 L266 596 L214 596 L200 438 L186 596 L134 596 L124 476 Z",
    note: "M166 128 Q200 104 234 128 Q200 152 166 128 Z",
  },
  {
    // Bias slip — narrow shoulder, long fall
    body: "M200 132 L238 158 L250 312 L268 540 L200 572 L132 540 L150 312 L162 158 Z",
    layer: "M200 158 V572 M176 320 L224 320",
    note: "M232 400 L252 560",
  },
  {
    // Boxy track set
    body: "M200 128 L268 160 L282 300 L268 320 L132 320 L118 300 L132 160 Z",
    layer: "M134 328 L266 328 L262 590 L208 590 L200 420 L192 590 L138 590 Z",
    note: "M150 160 V320 M250 160 V320",
  },
  {
    // Pleated skirt + fitted top
    body: "M200 132 L250 158 L258 296 L142 296 L150 158 Z",
    layer: "M144 300 L256 300 L306 540 L94 540 Z",
    note: "M170 302 L146 538 M200 302 V538 M230 302 L254 538",
  },
  {
    // Overcoat — squared shoulder, single closure
    body: "M200 124 L272 156 L286 320 L272 500 L258 594 L200 600 L142 594 L128 500 L114 320 L128 156 Z",
    layer: "M200 156 L200 600 M164 190 L200 168 L236 190",
    note: "M186 300 L214 300",
  },
];

export function Plate({
  seed,
  tone = "violet",
  variant = "figure",
  src,
  alt,
  sizes = "(max-width: 768px) 100vw, 50vw",
  priority,
  className,
  children,
}: PlateProps) {
  const t = TONES[tone];
  const uid = `p${hash(seed).toString(36)}`;
  const figure = FIGURES[hash(seed + "fig") % FIGURES.length];

  // Deterministic haze placement — three light sources, never the same twice.
  const hx1 = 12 + rand(seed, 1) * 40;
  const hy1 = 8 + rand(seed, 2) * 34;
  const hx2 = 52 + rand(seed, 3) * 42;
  const hy2 = 48 + rand(seed, 4) * 44;
  const tilt = -8 + rand(seed, 5) * 16;
  const scale = 0.94 + rand(seed, 6) * 0.14;

  return (
    <div
      className={cn(
        "grain relative overflow-hidden bg-ink",
        // The plate itself is the hover surface — children animate against it.
        className,
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      ) : (
        <>
          {/* Layer 1 — atmospheric haze fields */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(46% 40% at 50% 46%, ${t.key}4d 0%, transparent 68%),
                radial-gradient(70% 55% at ${hx1}% ${hy1}%, ${t.key}55 0%, transparent 62%),
                radial-gradient(60% 60% at ${hx2}% ${hy2}%, ${t.deep} 0%, transparent 70%),
                linear-gradient(${160 + tilt}deg, #0A1030 0%, #05060A 55%, ${t.deep} 100%)
              `,
            }}
          />

          {/* Layer 2 — the figure, or an abstract field */}
          <svg
            aria-hidden
            viewBox="0 0 400 620"
            preserveAspectRatio="xMidYMax slice"
            className="absolute inset-0 h-full w-full"
          >
            <defs>
              <linearGradient id={`${uid}rim`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={t.edge} stopOpacity="0.95" />
                <stop offset="45%" stopColor={t.key} stopOpacity="0.45" />
                <stop offset="100%" stopColor={t.key} stopOpacity="0" />
              </linearGradient>
              <linearGradient id={`${uid}fill`} x1="0" y1="0" x2="0.6" y2="1">
                <stop offset="0%" stopColor="#0C0E16" />
                <stop offset="100%" stopColor="#05060A" />
              </linearGradient>
              {/* No feGaussianBlur here on purpose. A blur filter per plate ×
                  46 plates on the homepage was the dominant paint cost; the
                  halo is done with a radial gradient in CSS instead, which
                  composites for free. */}
              <pattern
                id={`${uid}grid`}
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path d="M40 0H0V40" fill="none" stroke={t.edge} strokeWidth="0.4" />
              </pattern>
            </defs>

            {/* Blueprint linework — reads as a technical drawing under the light */}
            <rect width="400" height="620" fill={`url(#${uid}grid)`} opacity="0.07" />

            {variant === "figure" ? (
              <g
                transform={`translate(200 320) rotate(${tilt * 0.25}) scale(${scale}) translate(-200 -320)`}
              >
                {/* Head */}
                <circle cx="200" cy="88" r="33" fill={`url(#${uid}fill)`} />
                <circle
                  cx="200"
                  cy="88"
                  r="33"
                  fill="none"
                  stroke={`url(#${uid}rim)`}
                  strokeWidth="1.4"
                />

                {figure.layer && (
                  <path
                    d={figure.layer}
                    fill={`url(#${uid}fill)`}
                    stroke={`url(#${uid}rim)`}
                    strokeWidth="1.2"
                    strokeLinejoin="round"
                  />
                )}
                <path
                  d={figure.body}
                  fill={`url(#${uid}fill)`}
                  stroke={`url(#${uid}rim)`}
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
                {figure.note && (
                  <path
                    d={figure.note}
                    fill="none"
                    stroke={t.edge}
                    strokeOpacity="0.5"
                    strokeWidth="1"
                  />
                )}
              </g>
            ) : (
              <g opacity="0.9">
                <path
                  d={`M0 ${430 + tilt * 4} Q200 ${330 - tilt * 8} 400 ${450 + tilt * 3}`}
                  fill="none"
                  stroke={t.edge}
                  strokeOpacity="0.4"
                  strokeWidth="1"
                />
                <path
                  d={`M0 ${470 + tilt * 4} Q200 ${370 - tilt * 8} 400 ${490 + tilt * 3}`}
                  fill="none"
                  stroke={t.edge}
                  strokeOpacity="0.22"
                  strokeWidth="1"
                />
              </g>
            )}
          </svg>

          {/* Layer 3 — vignette keeps the type legible over any composition */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(5,6,10,0.88) 0%, rgba(5,6,10,0.15) 42%, rgba(5,6,10,0.35) 100%)",
            }}
          />
        </>
      )}

      {children}
    </div>
  );
}
