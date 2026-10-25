// Small original icon set, drawn in the sticker style (plum outline, palette fills).
import type { ReactElement } from 'react';

const S = { stroke: '#5B4A6E', strokeWidth: 2.5, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const };

export const ICONS: Record<string, ReactElement> = {
  map: (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path d="M4,8 L11,5 L21,8 L28,5 L28,24 L21,27 L11,24 L4,27 Z" fill="#7ED6A7" {...S} />
      <path d="M11,5 L11,24 M21,8 L21,27" {...S} fill="none" />
      <path d="M16,10 C19,10 20,12 20,13.5 C20,16 16,20 16,20 C16,20 12,16 12,13.5 C12,12 13,10 16,10 Z" fill="#FF7BA9" {...S} />
    </svg>
  ),
  home: (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path d="M5,15 L16,5 L27,15 L27,27 L5,27 Z" fill="#FFC94A" {...S} />
      <path d="M13,27 L13,19 L19,19 L19,27" fill="#3BB7C4" {...S} />
      <path d="M3,16 L16,4 L29,16" fill="none" {...S} stroke="#5B4A6E" strokeWidth={3} />
    </svg>
  ),
  closet: (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path d="M16,9 C16,6 19,5.5 19.5,8 C20,10 16,11 16,13 L28,22 C29,23 28.5,25 27,25 L5,25 C3.5,25 3,23 4,22 L16,13" fill="none" {...S} />
      <path d="M8,25 L10,18 L22,18 L24,25 Z" fill="#FF7BA9" {...S} />
    </svg>
  ),
  album: (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <rect x="4" y="9" width="24" height="18" rx="4" fill="#B39DFF" {...S} />
      <path d="M11,9 L13,5 L19,5 L21,9" fill="#FFF7EC" {...S} />
      <circle cx="16" cy="18" r="5" fill="#FFF7EC" {...S} />
      <circle cx="16" cy="18" r="2" fill="#3BB7C4" />
    </svg>
  ),
  palette: (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path d="M16,4 C24,4 29,9 28,15 C27,19 22,18 20,20 C18,22 21,26 17,27 C9,28 4,22 4,15 C4,9 9,4 16,4 Z" fill="#FFF7EC" {...S} />
      <circle cx="10" cy="14" r="2.5" fill="#FF7BA9" />
      <circle cx="14" cy="9" r="2.5" fill="#FFC94A" />
      <circle cx="21" cy="10" r="2.5" fill="#3BB7C4" />
      <circle cx="11" cy="21" r="2.5" fill="#7ED6A7" />
    </svg>
  ),
  back: (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path d="M19,7 L10,16 L19,25" fill="none" {...S} strokeWidth={4} />
    </svg>
  ),
  gear: (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path
        d="M14,3 L18,3 L19,7 L22,8.5 L25.5,6.5 L28,9.5 L26,13 L27,16 L29,18 L28,22 L24.5,22 L22.5,24.5 L23,28 L19,29 L17,26 L15,26 L13,29 L9,28 L9.5,24.5 L7.5,22 L4,22 L3,18 L5,16 L6,13 L4,9.5 L6.5,6.5 L10,8.5 L13,7 Z"
        fill="#FFC94A"
        {...S}
      />
      <circle cx="16" cy="16" r="4.5" fill="#FFF7EC" {...S} />
    </svg>
  ),
  coin: (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <circle cx="16" cy="16" r="12" fill="#FFC94A" {...S} />
      <circle cx="16" cy="16" r="7.5" fill="none" stroke="#E8A93A" strokeWidth={2.5} />
      <path d="M16,11.5 L17.4,14.6 L20.6,14.9 L18.2,17 L18.9,20.2 L16,18.5 L13.1,20.2 L13.8,17 L11.4,14.9 L14.6,14.6 Z" fill="#FFF7EC" />
    </svg>
  ),
  sparkle: (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path d="M16,3 C17,12 20,15 29,16 C20,17 17,20 16,29 C15,20 12,17 3,16 C12,15 15,12 16,3 Z" fill="#FFC94A" {...S} />
    </svg>
  ),
  wave: (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path d="M11,27 C7,23 6,18 7,14 L9,9 C9.5,7.5 11.5,8 11.3,9.6 L10.8,13 L14,5 C14.6,3.6 16.6,4.2 16.2,5.8 L14,13 L18,4 C18.6,2.6 20.6,3.2 20.2,4.8 L17,13 L20.6,6.5 C21.4,5.2 23.2,6 22.6,7.5 L19,15.5 C21,14.5 23.5,15.5 24,17 C21,18 19,21 18,24 C17,27 14,28.5 11,27 Z" fill="#FFD9C9" {...S} />
    </svg>
  ),
};

export function Icon({ name }: { name: keyof typeof ICONS | string }) {
  return ICONS[name] ?? null;
}
