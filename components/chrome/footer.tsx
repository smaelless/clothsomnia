import Link from "next/link";
import { Marquee } from "@/components/ui/marquee";
import { Wordmark } from "@/components/ui/wordmark";
import { FOOTER_NAV, SOCIALS } from "@/lib/nav";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    // No opaque background here — it lets the moving type field show through.
    <footer className="relative border-t border-bone/10">
      {/* Closing statement — the last thing the site says */}
      <div className="border-b border-bone/10 py-6">
        <Marquee duration={52}>
          <span className="display flex shrink-0 items-center gap-8 whitespace-nowrap pr-8 text-[clamp(2rem,6vw,4.5rem)] leading-none text-bone/[0.14]">
            Sleep can wait.
            <span className="text-lime/40">✦</span>
            Made for the hours that never end.
            <span className="text-violet/40">✦</span>
            Dress the static.
            <span className="text-magenta/40">✦</span>
          </span>
        </Marquee>
      </div>

      <div className="mx-auto max-w-[1600px] px-4 py-16 md:px-8 md:py-14">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_2fr]">
          {/* Identity */}
          <div>
            <Wordmark className="text-[clamp(2.5rem,6vw,4rem)]" />
            <p className="mt-6 max-w-[34ch] text-sm leading-relaxed text-smoke">
              Clothing for the sleepless. Made in Morocco, worn wherever the night is still
              going. Chapter 1 drops 27 September.
            </p>

            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
              {SOCIALS.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group relative block overflow-hidden py-1"
                  >
                    <span className="label block text-silver transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full">
                      {s.label}
                    </span>
                    <span
                      aria-hidden
                      className="label absolute inset-0 block translate-y-full text-lime transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0"
                    >
                      {s.label}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Directory */}
          <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {FOOTER_NAV.map((col) => (
              <div key={col.title}>
                <h2 className="label-wide mb-5 text-lime">{col.title}</h2>
                <ul className="space-y-3">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-smoke transition-colors duration-300 hover:text-bone"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="rule my-12" />

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="label-wide text-smoke">© {year} Clothsomnia — All hours reserved</p>
          <p className="label-wide text-smoke">
            Morocco <span className="text-lime">✦</span> Chapter 01 <span className="text-lime">✦</span> Awake
          </p>
        </div>
      </div>
    </footer>
  );
}
