"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import {
  SOUNDTRACK,
  getSoundtrackPlaying,
  getSoundtrackServerSnapshot,
  setSoundtrackPlaying,
  subscribeSoundtrack,
} from "@/lib/soundtrack";
import { cn } from "@/lib/utils";

/** Live playing state, for anything outside this component. */
export function useSoundtrackPlaying(): boolean {
  return useSyncExternalStore(
    subscribeSoundtrack,
    getSoundtrackPlaying,
    getSoundtrackServerSnapshot,
  );
}

/**
 * THE SOUNDTRACK — one track, looping, for the whole site.
 *
 * On autoplay, honestly: every current browser refuses to start audible sound
 * before the visitor has interacted with the page. Chrome, Safari and Firefox
 * all enforce it, and iOS most strictly of all. There is no flag or trick that
 * defeats it — a page that could blast sound at you unprompted is exactly what
 * the rule exists to stop.
 *
 * So this tries to play immediately, and when it is refused it arms a set of
 * one-shot listeners and starts on the very first thing the visitor does:
 * a tap, a scroll, a key, a move of the mouse. In practice that is the first
 * second of the visit, and it is the closest thing to automatic that exists.
 *
 * A choice to mute is remembered, because a visitor who turned the music off
 * and got it back on the next page would simply leave.
 */

/** The five bars. Shared with the loading screen so the two always match. */
export function Equaliser({ playing, className }: { playing: boolean; className?: string }) {
  return (
    <span aria-hidden className={cn("flex h-3.5 items-end gap-[2px]", className)}>
      {[0, 1, 2, 3, 4].map((i) => (
        <span
          key={i}
          className={cn(
            "w-[2px] rounded-full bg-current",
            playing ? "eq-bar" : "h-[3px] opacity-40",
          )}
          style={playing ? { animationDelay: `${i * 0.13}s` } : undefined}
        />
      ))}
    </span>
  );
}

export function Soundtrack() {
  const ref = useRef<HTMLAudioElement>(null);
  const playing = useSoundtrackPlaying();
  const setPlaying = setSoundtrackPlaying;
  const [muted, setMuted] = useState(false);
  const [ready, setReady] = useState(false);

  // Restore the previous choice before doing anything noisy.
  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = window.localStorage.getItem(SOUNDTRACK.storageKey);
    } catch {
      /* private mode — default to sound on */
    }
    setMuted(stored === "off");
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const audio = ref.current;
    if (!audio) return;

    if (muted) {
      audio.pause();
      setPlaying(false);
      return;
    }

    let armed = false;

    const start = () => {
      audio
        .play()
        .then(() => {
          setPlaying(true);
          disarm();
        })
        .catch(() => {
          // Refused — wait for a gesture. This is the expected path on a first
          // visit, not an error.
          arm();
        });
    };

    // `once` is not enough on its own: the first event that fires might be one
    // the browser does not count as activation (a passive scroll on iOS), so
    // every listener stays until a play() actually resolves.
    const events = ["pointerdown", "touchstart", "keydown", "scroll", "mousemove"] as const;

    function arm() {
      if (armed) return;
      armed = true;
      for (const type of events) {
        window.addEventListener(type, start, { passive: true });
      }
    }

    function disarm() {
      if (!armed) return;
      armed = false;
      for (const type of events) {
        window.removeEventListener(type, start);
      }
    }

    start();
    return disarm;
  }, [ready, muted]);

  function toggleMute() {
    const next = !muted;
    setMuted(next);
    try {
      window.localStorage.setItem(SOUNDTRACK.storageKey, next ? "off" : "on");
    } catch {
      /* nothing to do — the session still behaves */
    }
  }

  function togglePlay() {
    const audio = ref.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    } else {
      audio.pause();
      setPlaying(false);
    }
  }

  return (
    <>
      <audio
        ref={ref}
        src={SOUNDTRACK.src}
        loop
        // Metadata only: 4MB fetched eagerly on a phone data plan, for something
        // that may never be allowed to play, is not a good trade.
        preload="metadata"
        playsInline
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />

      {/* The control. Small, out of the way, and never hidden — sound the
          visitor cannot find the switch for is the reason people close tabs. */}
      <div className="fixed bottom-4 left-4 z-[88] flex items-center gap-1 rounded-full border border-bone/15 bg-ink/90 px-2 py-1.5">
        <button
          type="button"
          onClick={togglePlay}
          aria-label={playing ? "Pause the music" : "Play the music"}
          className="grid size-8 place-items-center rounded-full text-silver transition-colors hover:text-lime"
        >
          {playing ? (
            <Pause className="size-3.5" strokeWidth={2} />
          ) : (
            <Play className="size-3.5" strokeWidth={2} />
          )}
        </button>

        <Equaliser playing={playing} className="text-lime" />

        {/* Named on the site itself, not only in the loading screen — most
            visitors never see a loading screen twice. */}
        <span className="label ml-1 hidden text-[9px] tracking-[0.12em] text-smoke sm:block">
          {SOUNDTRACK.title} — {SOUNDTRACK.artist}
        </span>

        <button
          type="button"
          onClick={toggleMute}
          aria-label={muted ? "Turn the music on" : "Turn the music off"}
          aria-pressed={muted}
          className="grid size-8 place-items-center rounded-full text-silver transition-colors hover:text-lime"
        >
          {muted ? (
            <VolumeX className="size-3.5" strokeWidth={1.75} />
          ) : (
            <Volume2 className="size-3.5" strokeWidth={1.75} />
          )}
        </button>
      </div>
    </>
  );
}
