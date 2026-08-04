# Clothsomnia

**Made for the hours that never end.**

An animated fashion-commerce front end for Clothsomnia — a brand universe built
around late-night energy, sleepless creativity and runway fantasy.
Art direction: *Midnight Runway Dreamworld*.

---

## Run it

```bash
npm install
npm run dev
```

Then open <http://localhost:3000>.

> **Note:** don't run `npm run build` while `npm run dev` is running — they
> share the `.next` directory and the dev server's chunks get clobbered
> (symptom: `Internal Server Error`, `Cannot find module './xxx.js'`).
> If that happens: stop the server, `rm -rf .next`, start again.

## Stack

Next.js 15 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS v4
(CSS-first `@theme` tokens) · Framer Motion 12 · lucide-react.

## Structure

```
app/                  routes — home, collections/[slug], product/[slug], lookbook, about, intro-lab
components/chrome/    intro · header · mobile menu · search · bag drawer · type field · footer · cursor
components/home/      hero · manifesto · runway · collection worlds · new drop · lookbook · teaser
components/product/   product detail (powers both the PDP and the homepage teaser)
components/ui/        plate · product card · reveal · magnetic · marquee · wordmark
lib/                  catalog · worlds · nav · motion (shared variant library) · intro config
providers/            store — bag, wishlist, overlay state (localStorage-persisted)
demos/                three standalone HTML design directions (no build needed)
```

## Two things worth knowing

**There are no image assets.** `components/ui/plate.tsx` is a procedural visual
engine: it hashes a seed string into a layered composition — haze fields, an
abstract garment silhouette with a rim light, blueprint linework, grain. The
same seed always renders the same frame, on server and client. When real
campaign photography exists, pass `src` to `<Plate>` and nothing else changes.

**The intro is swappable.** Four opening sequences live in
`components/chrome/intro/`. Change one line in `lib/intro.ts`:

```ts
export const INTRO_VARIANT: IntroVariant = "slats";
```

Options: `slats` (live) · `blink` · `iris` · `typesweep`.
Compare them at [/intro-lab](http://localhost:3000/intro-lab).

## Motion

One shared vocabulary in `lib/motion.ts` — entrances use `[0.16, 1, 0.3, 1]`,
scene changes use `[0.83, 0, 0.17, 1]`. Scroll work is transform/opacity only.
Every animated component reads `useReducedMotion` and degrades gracefully; the
background type field falls back to static text.

The type field behind the site never pauses — not on hover, not on touch. That
is deliberate, so there is no `:hover { animation-play-state: paused }` rule on
`.marquee-track`.

## Design system

Tokens are defined once in `app/globals.css` under `@theme`.

| | |
|---|---|
| Surfaces | `ink` `#05060A` · `navy` `#0A1030` · `charcoal` `#14161C` · `smoke` `#6E7280` |
| Text | `bone` `#EDEAE4` · `silver` `#C9D2E3` |
| Accents | `violet` `#7C3BFF` · `cobalt` `#1B3BFF` · `magenta` `#FF2FA0` · `lime` `#C6FF3D` |

Accents are used sparingly on purpose — lime is reserved for signal (active
state, focus ring, confirmation), magenta for wishlist.

Type: **Bodoni Moda** for editorial display, **Inter Tight** for everything you
actually have to read.

## Placeholder content

The catalog in `lib/catalog.ts` is shaped like a real commerce payload so it can
be swapped for a Shopify/commerce API response without touching the UI.
Products, copy, prices and imagery are fictional.
