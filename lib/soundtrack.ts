/**
 * THE SOUNDTRACK.
 *
 * One record, so the loading screen, the floating control and the audio element
 * itself all name the same track.
 */
export const SOUNDTRACK = {
  src: "/audio/7elmetado-v.mp3",
  title: "7elmetAdo V",
  artist: "ElGrandeToto",
  /** Where the site remembers whether you muted it. */
  storageKey: "clothsomnia.sound.v1",
} as const;

/**
 * Whether the track is actually sounding, shared without a provider.
 *
 * The loading screen and the floating control both need this, and they sit in
 * different branches of the tree with the whole page between them. A context
 * would mean wrapping the entire site to pass one boolean; this is the same
 * subscription React uses internally, in a dozen lines.
 */
let playing = false;
const listeners = new Set<() => void>();

export function setSoundtrackPlaying(next: boolean): void {
  if (playing === next) return;
  playing = next;
  for (const notify of listeners) notify();
}

export function subscribeSoundtrack(notify: () => void): () => void {
  listeners.add(notify);
  return () => listeners.delete(notify);
}

export function getSoundtrackPlaying(): boolean {
  return playing;
}

/** The server has no audio, so it always renders the paused state. */
export function getSoundtrackServerSnapshot(): boolean {
  return false;
}
