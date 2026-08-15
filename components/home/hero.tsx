"use client";

import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { useRef } from "react";
import { ActionButton } from "@/components/ui/magnetic";
import { Plate } from "@/components/ui/plate";
import { EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";

const ORBIT = [
  "You'll notice the difference.",
  "Let the details speak.",
  "The quieter the better.",
  "Less to prove. More to wear.",
  "Quietly different.",
  "Chapter 01",
];

/* Broken across three lines so the stagger still reads as a build, and so the
   payoff word lands alone on the last line in the italic silver treatment. */
const HEADLINE = ["T'LBESS WHAT", "THEY'LL", "REMEMBER"];

/**
 * HERO — the opening frame of the fashion film.
 *
 * Four depth planes: haze, a collage of three plates, the headline, and an
 * orbiting label ring. Scroll drives the planes apart at different rates;
 * the pointer adds a slow lean. Everything is transform/opacity only, and the
 * whole depth system collapses to a static composition under reduced motion.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yBack = useTransform(scrollYProgress, [0, 1], ["0%", "26%"]);
  const yMid = useTransform(scrollYProgress, [0, 1], ["0%", "48%"]);
  const yType = useTransform(scrollYProgress, [0, 1], ["0%", "-18%"]);
  const fade = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const scaleBack = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  // Pointer lean — small, slow, and never enough to fight the scroll.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const lx = useSpring(mx, { stiffness: 60, damping: 22, mass: 0.9 });
  const ly = useSpring(my, { stiffness: 60, damping: 22, mass: 0.9 });
  const leanA = useTransform(lx, [-1, 1], [26, -26]);
  const leanB = useTransform(lx, [-1, 1], [-38, 38]);
  const leanAY = useTransform(ly, [-1, 1], [18, -18]);
  const leanBY = useTransform(ly, [-1, 1], [-22, 22]);

  function onPointerMove(e: React.PointerEvent) {
    if (reduced || e.pointerType !== "mouse") return;
    mx.set((e.clientX / window.innerWidth) * 2 - 1);
    my.set((e.clientY / window.innerHeight) * 2 - 1);
  }

  return (
    <section
      ref={ref}
      onPointerMove={onPointerMove}
      className="relative min-h-[78svh] overflow-hidden pb-6 pt-6 md:pb-8"
      aria-label="Clothsomnia — Autumn/Winter after-hours campaign"
    >
      {/* Plane 1 — atmosphere */}
      <motion.div
        aria-hidden
        style={reduced ? undefined : { y: yBack, scale: scaleBack }}
        className="pointer-events-none absolute inset-0 -z-10"
      >
        {/* Restrained on purpose. At full strength these wash the whole hero
            violet and the page reads as a gradient, not as a dark room with
            light in it. Accents are meant to be occasional. */}
        <div className="bloom left-[-14%] top-[-8%] size-[38rem] bg-pine/25 animate-drift" />
        <div className="bloom right-[-18%] top-[26%] size-[30rem] bg-wine/20 animate-drift [animation-delay:-8s]" />
        <div className="bloom bottom-[-12%] left-[38%] size-[22rem] bg-cream/[0.05] animate-drift [animation-delay:-15s]" />
      </motion.div>

      {/* Plane 2 — the collage.
          Hidden below lg: there is not enough width for plates and a giant
          headline to coexist, and overlapping the type is worse than losing
          the collage. Above lg it lives in the right third only. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-[5] hidden lg:block">
        <motion.div
          style={reduced ? undefined : { y: yMid, x: leanA, translateY: leanAY }}
          className="absolute right-[3%] top-[11%] w-[24vw] max-w-[21rem]"
        >
          <motion.div
            initial={{ opacity: 0, clipPath: "inset(100% 0% 0% 0%)" }}
            animate={{ opacity: 1, clipPath: "inset(0% 0% 0% 0%)" }}
            transition={{ duration: 1.6, ease: EASE_OUT, delay: 0.2 }}
          >
            <Plate
              seed="hero-primary"
              tone="pine"
              alt="Dreams Hoodie in pine, front"
              priority
              sizes="(max-width: 768px) 40vw, 26rem"
              className="aspect-[3/4] w-full"
            />
          </motion.div>
        </motion.div>

        <motion.div
          style={reduced ? undefined : { y: yBack, x: leanB, translateY: leanBY }}
          className="absolute bottom-[13%] right-[22%] w-[13vw] max-w-[11rem]"
        >
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, ease: EASE_OUT, delay: 0.55 }}
          >
            <Plate
              seed="hero-secondary"
              tone="wine"
              alt="Dreams Hoodie in wine, front"
              sizes="(max-width: 768px) 26vw, 15rem"
              className="aspect-[4/5] w-full"
            />
          </motion.div>
        </motion.div>

        <motion.div
          style={reduced ? undefined : { y: yMid, x: leanB }}
          className="absolute left-[2%] top-[46%] hidden w-[14vw] max-w-[11rem] lg:block"
        >
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.3, ease: EASE_OUT, delay: 0.85 }}
          >
            <Plate
              seed="hero-tertiary"
              tone="cream"
              variant="field"
              alt=""
              sizes="11rem"
              className="aspect-square w-full"
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Plane 3 — type */}
      <motion.div
        style={reduced ? undefined : { y: yType, opacity: fade }}
        /* Starts at the top rather than centring in an 80svh box — centring
           left a large dead band between the header and the first line. */
        className="relative mx-auto flex max-w-[1600px] flex-col justify-start px-4 md:px-8"
      >
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="label mb-8 flex items-start gap-3 text-lime"
        >
          <span className="mt-1 inline-block size-1.5 shrink-0 rounded-full bg-lime animate-flicker" />
          {/* Held on one line from sm up — the type scales with the viewport so
              it always fits. Below sm there is no size that keeps 57 characters
              on one line and still readable, so it wraps there. */}
          <span className="whitespace-normal text-[clamp(8px,0.82vw,11px)] leading-[1.7] tracking-[0.16em] sm:whitespace-nowrap">
            It&apos;s not necessary tlbess qadek iwatik, sometimes khassek
          </span>
        </motion.p>

        {/* Capped on lg+ so the headline and the collage occupy separate
            columns rather than fighting for the same pixels. */}
        <h1 className="display text-mega">
          {HEADLINE.map((line, i) => (
            <span key={line} className="clip-line">
              <motion.span
                className={
                  i === 2
                    ? "block italic font-light text-silver"
                    : "block"
                }
                initial={{ y: "112%", rotate: 2 }}
                animate={{ y: "0%", rotate: 0 }}
                transition={{ duration: 1.25, ease: EASE_OUT, delay: 0.25 + i * 0.11 }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        <div className="mt-10 grid gap-10 md:mt-9 md:grid-cols-[minmax(0,26rem)_auto] md:items-end md:gap-16">
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE_OUT, delay: 0.8 }}
            className="max-w-[40ch] text-base leading-relaxed text-silver md:text-lg"
          >
            Kolchi kaylbes. Machi kolchi kay3ref ykhtar.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE_OUT, delay: 0.95 }}
            className="flex flex-wrap items-center gap-3"
          >
            {/* Single CTA — one unambiguous next step out of the hero. */}
            <ActionButton href="/collections/new">Meet the drop</ActionButton>
          </motion.div>
        </div>
      </motion.div>

      {/* The same composition, rebuilt for a phone.
          It cannot overlap the headline at this width, so it is given its own
          band underneath instead of being cut. */}
      <MobileComposition reduced={Boolean(reduced)} />

      {/* Plane 4 — the orbit */}
      <motion.div
        aria-hidden
        style={reduced ? undefined : { opacity: fade }}
        className="pointer-events-none absolute right-[8%] top-1/2 hidden -translate-y-1/2 lg:block"
      >
        <div className={cn("relative size-[22rem]", !reduced && "animate-orbit")}>
          <div className="absolute inset-0 rounded-full border border-dashed border-bone/15" />
          {ORBIT.map((word, i) => {
            const angle = (i / ORBIT.length) * 360;
            return (
              <span
                key={word}
                className="absolute left-1/2 top-1/2 origin-[0_0]"
                style={{ transform: `rotate(${angle}deg) translate(11rem)` }}
              >
                <span className="block -translate-x-1/2 -translate-y-1/2">
                  {/* Undoes the tilt this label inherits from its position on
                      the ring, so it starts horizontal. */}
                  <span className="block" style={{ transform: `rotate(${-angle}deg)` }}>
                    <span
                      /* Runs the ring's own animation in reverse, cancelling
                         the rotation frame for frame. Smaller than the house
                         label because these lines are full sentences. */
                      className={cn(
                        "label block whitespace-nowrap rounded-full bg-ink/75 px-2.5 py-1.5 text-[9px] tracking-[0.08em] text-silver backdrop-blur-sm",
                        !reduced && "animate-orbit [animation-direction:reverse]",
                      )}
                    >
                      {word}
                    </span>
                  </span>
                </span>
              </span>
            );
          })}
        </div>
      </motion.div>

    </section>
  );
}

/**
 * THE COLLAGE AND ORBIT, ON A PHONE
 *
 * The desktop version overlays the headline because there is a spare third of
 * the screen to put it in. There is no spare third at 390px, so the same three
 * elements — the two plates and the labelled ring — get their own band below
 * the call to action, at a radius chosen so the widest label still clears the
 * edge of the screen.
 *
 * Sized in rem against the ring rather than in viewport units: the labels are
 * a fixed physical width, so a ring that scaled with the viewport would push
 * them off the side of the smallest phones.
 */
function MobileComposition({ reduced }: { reduced: boolean }) {
  return (
    <div
      aria-hidden
      className="relative mx-auto mt-14 grid h-[24rem] w-full max-w-[26rem] place-items-center lg:hidden"
    >
      {/* The plates sit behind the ring, off-centre, so the composition reads
          as a collage rather than as a target. */}
      <motion.div
        initial={{ opacity: 0, clipPath: "inset(100% 0% 0% 0%)" }}
        whileInView={{ opacity: 1, clipPath: "inset(0% 0% 0% 0%)" }}
        viewport={{ once: true, margin: "-15%" }}
        transition={{ duration: 1.4, ease: EASE_OUT }}
        className="absolute left-1/2 top-[8%] w-[42%] -translate-x-[36%]"
      >
        <Plate
          seed="hero-primary"
          tone="pine"
          alt="Dreams Hoodie in pine, front"
          priority
          sizes="45vw"
          className="aspect-[3/4] w-full"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-15%" }}
        transition={{ duration: 1.2, ease: EASE_OUT, delay: 0.25 }}
        className="absolute bottom-[10%] left-1/2 w-[27%] translate-x-[10%]"
      >
        <Plate
          seed="hero-secondary"
          tone="wine"
          alt="Dreams Hoodie in wine, front"
          sizes="30vw"
          className="aspect-[4/5] w-full"
        />
      </motion.div>

      {/* Radius 6rem, not the desktop 11rem.
          The longest label measures ~153px, so its far edge sits 96 + 77 =
          173px from the centre. A 360px phone gives 180px, which clears it.
          The labels sweep as the ring turns, so this has to hold at every
          angle, not just the one it happens to load at. */}
      <div className={cn("relative size-[12rem]", !reduced && "animate-orbit")}>
        <div className="absolute inset-0 rounded-full border border-dashed border-bone/15" />
        {ORBIT.map((word, i) => {
          const angle = (i / ORBIT.length) * 360;
          return (
            <span
              key={word}
              className="absolute left-1/2 top-1/2 origin-[0_0]"
              style={{ transform: `rotate(${angle}deg) translate(6rem)` }}
            >
              <span className="block -translate-x-1/2 -translate-y-1/2">
                <span className="block" style={{ transform: `rotate(${-angle}deg)` }}>
                  <span
                    /* Solid, not backdrop-blurred. A backdrop filter makes the
                       browser re-sample everything behind the element each
                       frame, and these move every frame — six of them turning
                       continuously is a cost a phone pays for an effect nobody
                       can see behind an opaque pill anyway. */
                    className={cn(
                      "label block whitespace-nowrap rounded-full bg-ink/90 px-2 py-1 text-[8px] tracking-[0.07em] text-silver",
                      !reduced && "animate-orbit [animation-direction:reverse]",
                    )}
                  >
                    {word}
                  </span>
                </span>
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
