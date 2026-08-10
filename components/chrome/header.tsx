"use client";

import { motion, useMotionValueEvent, useScroll, useReducedMotion } from "framer-motion";
import { Heart, Menu, Search, ShoppingBag, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { HEADER_NAV } from "@/lib/nav";
import { EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { useStore } from "@/providers/store";
import { Wordmark } from "@/components/ui/wordmark";

export function Header() {
  const { count, wishlist, openOverlay, pulse } = useStore();
  const pathname = usePathname();
  const [condensed, setCondensed] = useState(false);
  const [bump, setBump] = useState(false);
  const { scrollY } = useScroll();
  const reduced = useReducedMotion();

  useMotionValueEvent(scrollY, "change", (y) => {
    setCondensed(y > 72);
  });

  // The bag mark reacts when a line is added, wherever the add came from.
  useEffect(() => {
    if (pulse === 0) return;
    setBump(true);
    const id = window.setTimeout(() => setBump(false), 600);
    return () => window.clearTimeout(id);
  }, [pulse]);

  return (
    <motion.header
      className={cn(
        "sticky top-0 z-50 w-full transition-[background-color,border-color,backdrop-filter] duration-500",
        condensed
          ? "border-b border-bone/10 bg-ink/72 backdrop-blur-xl backdrop-saturate-150"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div
        className={cn(
          "mx-auto flex max-w-[1600px] items-center justify-between gap-6 px-4 transition-all duration-500 md:px-8",
          condensed ? "h-16" : "h-24",
        )}
      >
        {/* Wordmark */}
        <Link
          href="/"
          className="shrink-0"
          aria-label="Clothsomnia — home"
        >
          <Wordmark
            className={cn(
              "transition-all duration-500",
              condensed ? "text-2xl" : "text-3xl md:text-[2rem]",
            )}
          />
        </Link>

        {/* Desktop navigation */}
        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {HEADER_NAV.map((link) => {
              const active =
                link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              return (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className="group relative block overflow-hidden px-3 py-3"
                  >
                    {/* Label swaps upward on hover — the house motion signature */}
                    <span className="relative block h-3 overflow-hidden">
                      <span
                        className={cn(
                          "label block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full",
                          active ? "text-lime" : "text-silver",
                        )}
                      >
                        {link.label}
                      </span>
                      <span
                        aria-hidden
                        className="label absolute inset-0 block translate-y-full text-bone transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0"
                      >
                        {link.label}
                      </span>
                    </span>
                    {active && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-x-3 bottom-1.5 h-px bg-lime"
                        transition={reduced ? { duration: 0 } : { duration: 0.5, ease: EASE_OUT }}
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-0.5">
          <IconAction label="Search" onClick={() => openOverlay("search")}>
            <Search className="size-[18px]" strokeWidth={1.5} />
          </IconAction>

          <IconAction label="Account" href="/about">
            <User className="size-[18px]" strokeWidth={1.5} />
          </IconAction>

          <IconAction
            label={`Wishlist, ${wishlist.length} saved`}
            href="/lookbook"
            badge={wishlist.length || undefined}
            badgeTone="magenta"
          >
            <Heart className="size-[18px]" strokeWidth={1.5} />
          </IconAction>

          <IconAction
            label={`Bag, ${count} ${count === 1 ? "item" : "items"}`}
            onClick={() => openOverlay("bag")}
            badge={count || undefined}
            bump={bump}
          >
            <ShoppingBag className="size-[18px]" strokeWidth={1.5} />
          </IconAction>

          <div className="lg:hidden">
            <IconAction label="Open menu" onClick={() => openOverlay("menu")}>
              <Menu className="size-5" strokeWidth={1.5} />
            </IconAction>
          </div>
        </div>
      </div>
    </motion.header>
  );
}

function IconAction({
  children,
  label,
  onClick,
  href,
  badge,
  badgeTone = "lime",
  bump,
}: {
  children: React.ReactNode;
  label: string;
  onClick?: () => void;
  href?: string;
  badge?: number;
  badgeTone?: "lime" | "magenta";
  bump?: boolean;
}) {
  const inner = (
    <>
      <span className="transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-0.5">
        {children}
      </span>
      {badge !== undefined && (
        <motion.span
          animate={bump ? { scale: [1, 1.5, 1] } : { scale: 1 }}
          transition={{ duration: 0.55, ease: EASE_OUT }}
          className={cn(
            "absolute right-1.5 top-1.5 grid min-w-4 place-items-center rounded-full px-1 text-[9px] font-semibold leading-4 text-ink",
            badgeTone === "magenta" ? "bg-magenta" : "bg-lime",
          )}
        >
          {badge}
        </motion.span>
      )}
    </>
  );

  const classes =
    "group relative grid size-11 place-items-center rounded-full text-silver transition-colors duration-300 hover:text-bone";

  if (href) {
    return (
      <Link href={href} aria-label={label} className={classes}>
        {inner}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} aria-label={label} className={classes}>
      {inner}
    </button>
  );
}
