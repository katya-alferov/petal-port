// Bandstand piano (game-systems §22): eight keys and a song book. In a song the next key glows; a wrong key
// still plays its note and the song waits. A song pays once, the first time it is played to the end.
export const KEYS = 8;
export const KEY_NAMES = ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C'] as const;
/** Note frequencies of a C major scale from middle C. */
export const KEY_FREQ = [261.63, 293.66, 329.63, 349.23, 392.0, 440.0, 493.88, 523.25] as const;

export interface Song {
  id: string;
  name: string;
  notes: number[];
}
export const SONGS: Song[] = [
  { id: 'song.twinkle', name: 'Twinkle Star', notes: [0, 0, 4, 4, 5, 5, 4, 3, 3, 2, 2, 1, 1, 0] },
  { id: 'song.joy', name: 'Happy Tune', notes: [2, 2, 3, 4, 4, 3, 2, 1, 0, 0, 1, 2, 2, 1, 1] },
  { id: 'song.lamb', name: 'Little Lamb', notes: [2, 1, 0, 1, 2, 2, 2, 1, 1, 1, 2, 4, 4] },
];
export const SONG_PAY = 15;

export type Press = { ok: true; done: boolean } | { ok: false; expected: number };
export function press(song: Song, played: number, key: number): Press {
  const expected = song.notes[played];
  if (key !== expected) return { ok: false, expected };
  return { ok: true, done: played + 1 >= song.notes.length };
}
