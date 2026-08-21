/**
 * Turns the Clothsomnia wordmark into vector outlines.
 *
 * Canva's insert_shape takes an SVG path, so the wordmark can go in as real
 * geometry rather than as a picture of type — it stays sharp at any size and
 * does not depend on Bodoni Moda being installed anywhere.
 *
 * Two things this has to get right:
 *
 *   Canva accepts only M/L/H/V/C/S/A/Z. TrueType outlines are quadratic, so
 *   every Q is converted to the equivalent cubic. That conversion is exact,
 *   not an approximation: a quadratic is a cubic whose control points sit two
 *   thirds of the way from each end toward the quadratic's control point.
 *
 *   The tracking is -0.04em, which the site applies between every pair of
 *   letters. Advance widths are reduced by the same fraction so the spacing
 *   matches the site rather than the font's defaults.
 *
 * Usage: node scripts/wordmark-paths.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import opentype from "opentype.js";

const FONT_DIR = process.env.FONT_DIR ?? "/tmp/fonts";
const SIZE = 1000; // em size to lay out at; everything scales from here
const TRACKING = -0.04; // matches tracking-[-0.04em] on the wordmark

const regular = opentype.parse(readFileSync(`${FONT_DIR}/bodoni-600.ttf`).buffer);
const italic = opentype.parse(readFileSync(`${FONT_DIR}/bodoni-italic-400.ttf`).buffer);

/** Quadratic → cubic, exactly. */
function toCubic(x0, y0, cx, cy, x, y) {
  const c1x = x0 + (2 / 3) * (cx - x0);
  const c1y = y0 + (2 / 3) * (cy - y0);
  const c2x = x + (2 / 3) * (cx - x);
  const c2y = y + (2 / 3) * (cy - y);
  return `C${r(c1x)} ${r(c1y)} ${r(c2x)} ${r(c2y)} ${r(x)} ${r(y)}`;
}

/** Three decimals is well under a printed pixel at any size this is used at. */
const r = (n) => Math.round(n); // 1 unit = 0.16px at the size this is placed — sub-pixel

/**
 * Lays out a word and returns its outline as one compound path.
 * Returns the advance too, so the next word starts in the right place.
 */
function wordToPath(font, text, fontSize, startX, baselineY) {
  let x = startX;
  let d = "";

  for (const ch of text) {
    const glyph = font.charToGlyph(ch);
    const path = glyph.getPath(x, baselineY, fontSize);

    let cx = 0;
    let cy = 0;
    for (const cmd of path.commands) {
      if (cmd.type === "M") {
        d += `M${r(cmd.x)} ${r(cmd.y)}`;
        cx = cmd.x;
        cy = cmd.y;
      } else if (cmd.type === "L") {
        d += `L${r(cmd.x)} ${r(cmd.y)}`;
        cx = cmd.x;
        cy = cmd.y;
      } else if (cmd.type === "C") {
        d += `C${r(cmd.x1)} ${r(cmd.y1)} ${r(cmd.x2)} ${r(cmd.y2)} ${r(cmd.x)} ${r(cmd.y)}`;
        cx = cmd.x;
        cy = cmd.y;
      } else if (cmd.type === "Q") {
        d += toCubic(cx, cy, cmd.x1, cmd.y1, cmd.x, cmd.y);
        cx = cmd.x;
        cy = cmd.y;
      } else if (cmd.type === "Z") {
        d += "Z";
      }
    }

    // Advance, tightened by the site's tracking.
    x += (glyph.advanceWidth / font.unitsPerEm) * fontSize + TRACKING * fontSize;
  }

  return { d, endX: x };
}

const baseline = SIZE; // put the baseline low; we crop to the real ink after

const cloth = wordToPath(regular, "Cloth", SIZE, 0, baseline);
const somnia = wordToPath(italic, "somnia", SIZE, cloth.endX, baseline);

/* The dot: 0.14em across, 0.12em after the last letter, lifted 0.06em. */
const dotD = SIZE * 0.14;
const dotR = dotD / 2;
const dotCx = somnia.endX + SIZE * 0.12 + dotR;
const dotCy = baseline - dotR - SIZE * 0.06;

const out = {
  note: "Bodoni Moda — 600 normal for Cloth, 400 italic for somnia, tracking -0.04em",
  em: SIZE,
  cloth: cloth.d,
  somnia: somnia.d,
  dot: { cx: r(dotCx), cy: r(dotCy), r: r(dotR) },
  advanceEnd: r(dotCx + dotR),
  colours: { cloth: "#EDEAE4", somnia: "#C9D2E3", dot: "#C6FF3D", ink: "#05060A" },
};

const OUT = process.env.OUT ?? ".fontcache/wordmark.json";
writeFileSync(OUT, JSON.stringify(out, null, 2));

console.log("cloth path chars :", cloth.d.length);
console.log("somnia path chars:", somnia.d.length);
console.log("Q commands left  :", /[QT]/.test(cloth.d + somnia.d) ? "YES — problem" : "none");
console.log("dot              :", out.dot);
console.log("total advance    :", out.advanceEnd);

/* ------------------------------------------------------------------ *
 * Canva placement
 *
 * insert_shape takes a viewBox but no viewBox origin, so the outlines are
 * translated until the ink starts at 0,0. All three shapes then share one
 * viewBox and one box on the page, which is what keeps them in register.
 * ------------------------------------------------------------------ */
function translate(d, dx, dy) {
  // Every command here takes plain x y pairs except A, whose first five
  // numbers are radii and flags — handled separately below.
  return d.replace(/([MLC])([^MLCZA]*)/g, (_, cmd, nums) => {
    const parts = nums.trim().split(/[\s,]+/).map(Number);
    const moved = parts.map((n, i) => r(i % 2 === 0 ? n + dx : n + dy));
    return cmd + moved.join(" ");
  });
}

const box = { x: 51, y: 240, w: 5504, h: 770 };

const placed = {
  viewBox: { width: box.w, height: box.h },
  cloth: translate(out.cloth, -box.x, -box.y),
  somnia: translate(out.somnia, -box.x, -box.y),
  dot: (() => {
    const cx = out.dot.cx - box.x;
    const cy = out.dot.cy - box.y;
    const rad = out.dot.r;
    // Two arcs make a full circle; A is supported, and a single arc cannot
    // close on itself.
    return `M${r(cx - rad)} ${r(cy)}A${rad} ${rad} 0 1 0 ${r(cx + rad)} ${r(cy)}A${rad} ${rad} 0 1 0 ${r(cx - rad)} ${r(cy)}Z`;
  })(),
  colours: out.colours,
};

writeFileSync(".fontcache/placed.json", JSON.stringify(placed, null, 2));
console.log("translated. viewBox:", placed.viewBox);
console.log("dot path:", placed.dot);
