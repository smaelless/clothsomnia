"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useReducedMotion } from "framer-motion";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import {
  SOUNDTRACK,
  getSoundtrackPlaying,
  getSoundtrackServerSnapshot,
  registerSoundtrackStarter,
  setSoundtrackPlaying,
  subscribeSoundtrack,
} from "@/lib/soundtrack";
import { doorWillShow } from "@/lib/intro";
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
 * Autoplay, honestly: no browser will start *audible* sound before the visitor
 * has interacted with the page. Chrome, Safari and Firefox all enforce it and
 * iOS most strictly. There is no flag or trick that defeats it — a page that
 * could blast sound at you unprompted is the exact thing the rule exists to
 * prevent.
 *
 * What *is* universally allowed is muted playback. So the track starts muted
 * the moment the page parses, via the element's own autoplay attribute — before
 * React has hydrated, before the loading screen has finished. It is genuinely
 * running and in time from the first instant.
 *
 * The door then unmutes it. Because the audio is already playing and buffered,
 * pressing Enter is a fade-up rather than a start, and it is instant.
 *
 * Nothing else on the page starts the music. Sound that arrives because someone
 * happened to click is the behaviour the door exists to replace. The only
 * exception is a load with no door — reduced motion, or a reload after already
 * coming in — where there would otherwise be no way for it to begin at all.
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
  const [playing, setPlaying] = useState(false);
  const reduced = useReducedMotion();
  const [muted, setMuted] = useState(false);
  const [ready, setReady] = useState(false);
  /** Playing *and* actually making sound — false during the silent priming. */
  const [audible, setAudible] = useState(false);

  // The loading screen's equaliser reads this. It reflects audible rather than
  // merely playing, so the bars never dance over silence.
  useEffect(() => setSoundtrackPlaying(audible), [audible]);

  /**
   * The Enter button on the loading screen calls this, synchronously, from
   * inside its own click handler — the one moment sound is guaranteed to be
   * permitted. Someone who muted the site on a previous visit keeps their
   * silence: entering is not a request for music, it is a request to come in.
   */
  useEffect(
    () =>
      registerSoundtrackStarter(() => {
        const audio = ref.current;
        if (!audio || muted) return;
        audio.muted = false;
        audio.volume = 1;
        audio.play().then(
          () => {
            setPlaying(true);
            setAudible(true);
          },
          () => {},
        );
      }),
    [muted],
  );

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
      audio.muted = true;
      audio.pause();
      setPlaying(false);
      return;
    }

    /*
     * When there is a door, Enter owns the music.
     *
     * The track still runs, silently, so that it is buffered and in time and
     * the press is a fade-up rather than a load. But nothing else starts it:
     * no autoplay attempt, no listeners on the page. Sound arriving because
     * someone happened to click is exactly the behaviour a door is meant to
     * replace.
     */
    audio.muted = true;
    if (audio.paused) audio.play().then(() => setPlaying(true)).catch(() => {});
    if (doorWillShow(Boolean(reduced))) return;

    /*
     * No door on this load, so the music has no other way in. Ask outright —
     * Chrome allows it once someone has played audio on the site a few times —
     * and fall back to the first interaction if refused.
     */
    audio.muted = false;
    audio.volume = 1;

    audio
      .play()
      .then(() => {
        setPlaying(true);
        setAudible(true);
      })
      .catch(() => {
        audio.muted = true;
        audio.play().then(() => setPlaying(true)).catch(() => {});
      });

    /*
     * Everything a person does in their first second, not just a deliberate
     * click. Only some of these count as activation — a scroll does not unlock
     * audio in Chrome — but a rejected attempt costs nothing and re-arms, so
     * casting wide only helps. The aim is that sound arrives during a movement
     * the visitor was making anyway and never feels like a step they performed.
     */
    const events = [
      "pointerdown",
      "pointerup",
      "mousedown",
      "touchstart",
      "touchend",
      "click",
      "keydown",
      "scroll",
      "wheel",
      "mousemove",
    ] as const;

    const unmute = () => {
      /*
       * Everything here runs synchronously. Safari grants sound only to code
       * running inside the gesture's own task — resume it from a promise
       * callback and the permission has already expired.
       */
      audio.muted = false;
      audio.volume = 1;
      // Called even when it is already playing: on iOS a muted element that
      // began without a gesture still needs one before it will make a sound.
      const attempt = audio.play();

      setPlaying(true);
      // Drives muted={!audible} on the element, so React agrees with what was
      // just set by hand instead of overwriting it on the next render.
      setAudible(true);
      for (const type of events) window.removeEventListener(type, unmute);

      attempt?.catch(() => {
        // Still refused. Put the listeners back rather than leaving a control
        // that claims to be playing over silence.
        setAudible(false);
        for (const type of events) {
          window.addEventListener(type, unmute, { passive: true });
        }
      });
    };

    // Listeners stay until sound is genuinely audible, because the first event
    // to fire may be one the browser does not count as activation — a passive
    // scroll on iOS will not unlock audio on its own.
    for (const type of events) {
      window.addEventListener(type, unmute, { passive: true });
    }

    return () => {
      for (const type of events) window.removeEventListener(type, unmute);
    };
  }, [ready, muted, reduced]);

  function toggleMute() {
    const next = !muted;
    setMuted(next);
    setAudible(false);

    // This click is itself a gesture, so it is the one moment sound is
    // guaranteed to be allowed — take it rather than waiting for another.
    const audio = ref.current;
    if (audio && !next) {
      audio.muted = false;
      audio.volume = 1;
      audio.play().then(() => setAudible(true)).catch(() => {});
    }

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
      audio.muted = false;
      audio
        .play()
        .then(() => {
          setPlaying(true);
          setAudible(true);
        })
        .catch(() => setPlaying(false));
    } else {
      audio.pause();
      setPlaying(false);
      setAudible(false);
    }
  }

  return (
    <>
      <audio
        ref={ref}
        src={SOUNDTRACK.src}
        loop
        /* autoPlay + muted is the combination every browser permits. The track
           begins the instant the element parses — before hydration, before the
           loading screen clears — so the first gesture only has to unmute it.

           Bound to state rather than hard-coded: React treats `muted` as a
           property it owns and re-asserts on every commit, so a literal
           muted={true} here silently re-muted the audio on the very next
           render after a gesture had unmuted it by hand. That was the bug. */
        autoPlay
        muted={!audible}
        preload="auto"
        playsInline
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onVolumeChange={(e) => setAudible(!e.currentTarget.muted && !e.currentTarget.paused)}
      />

      {/* The control. Small, out of the way, and never hidden — sound the
          visitor cannot find the switch for is the reason people close tabs. */}
      <div className="fixed bottom-4 left-4 z-[88] flex items-center gap-1 rounded-full border border-bone/15 bg-ink/90 px-2 py-1.5">
        <button
          type="button"
          onClick={togglePlay}
          aria-label={audible ? "Pause the music" : "Play the music"}
          className="grid size-8 place-items-center rounded-full text-silver transition-colors hover:text-lime"
        >
          {audible ? (
            <Pause className="size-3.5" strokeWidth={2} />
          ) : (
            <Play className="size-3.5" strokeWidth={2} />
          )}
        </button>

        <Equaliser playing={audible} className="text-lime" />

        {/* Just the track. No instruction to tap: the sound arrives on its own
            the moment the visitor touches anything, so telling them to do it
            only draws attention to a step that should go unnoticed. */}
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
