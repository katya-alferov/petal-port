// Harbour Loft room (scene canvas 1170×2532). Wall/floor/trim colors come from the chosen theme;
// furniture renders into the 8 slot anchors from content.
import type { ReactNode } from 'react';
import type { RoomSpec } from '../../content/resolve';
import type { HomeSlot } from '../../content/types';
import { OUTLINE, Shaded } from '../kit';
import { FURN_ART } from '../furn';

export const FLOOR_Y = 1680;

function WindowView({ night }: { night: boolean }) {
  // The window frame is part of the room; the harbour view behind it changes with the theme's mood.
  return (
    <g>
      <defs>
        <clipPath id="loft-window">
          <rect x={640} y={600} width={400} height={540} rx={20} />
        </clipPath>
      </defs>
      <g clipPath="url(#loft-window)">
        <rect x={640} y={600} width={400} height={540} fill={night ? '#2B2950' : '#BDE8EC'} />
        {night ? (
          [
            [700, 660],
            [760, 720],
            [960, 650],
            [1000, 760],
            [880, 690],
          ].map(([x, y]) => <circle key={x} cx={x} cy={y} r={4} fill="#FFE08A" />)
        ) : (
          <circle cx={950} cy={700} r={46} fill="#FFC94A" />
        )}
        <path d="M640,900 C700,880 760,890 820,870 C880,850 960,880 1040,860 L1040,940 L640,940 Z" fill={night ? '#3D3A6B' : '#7ED6A7'} />
        <rect x={670} y={850} width={36} height={60} fill="#FFF7EC" stroke={OUTLINE} strokeWidth={3} />
        <path d="M664,852 L688,826 L712,852 Z" fill="#FF8A65" stroke={OUTLINE} strokeWidth={3} strokeLinejoin="round" />
        <rect x={680} y={866} width={14} height={14} fill={night ? '#FFE08A' : '#3BB7C4'} />
        <rect x={640} y={930} width={400} height={210} fill={night ? '#1F4F6B' : '#3BB7C4'} />
        {[960, 1000, 1040, 1080].map((y, i) => (
          <path
            key={y}
            d={`M${660 + i * 30},${y} q20,-10 40,0 q20,10 40,0`}
            fill="none"
            stroke="#FFF7EC"
            strokeWidth={4}
            opacity={0.6}
            strokeLinecap="round"
          />
        ))}
        <g className="loft-boat">
          <path d="M860,960 L940,960 L928,984 L872,984 Z" fill="#FF7BA9" stroke={OUTLINE} strokeWidth={3} strokeLinejoin="round" />
          <path d="M898,956 L898,880 L936,952 Z" fill="#FFF7EC" stroke={OUTLINE} strokeWidth={3} strokeLinejoin="round" />
        </g>
      </g>
    </g>
  );
}

export interface HarbourLoftProps {
  room: RoomSpec;
  /** Drawn between the back furniture (z ≤ 3) and the front furniture. */
  children?: ReactNode;
  lampOn?: boolean;
  /** Makes furniture tappable (scene hotspots). */
  onSlotTap?: (slot: HomeSlot) => void;
  tappable?: HomeSlot[];
}

export function HarbourLoft({ room, children, lampOn = true, onSlotTap, tappable = [] }: HarbourLoftProps) {
  const { night, floor, trim, anchors } = room;
  const wallLine = room.wallPattern;
  const ordered = (Object.keys(anchors) as HomeSlot[]).sort((a, b) => anchors[a].z - anchors[b].z);

  const renderSlot = (slot: HomeSlot) => {
    const def = room.slots[slot];
    const Art = def && FURN_ART[def.art];
    if (!def || !Art) return null;
    const a = anchors[slot];
    const { main, accent } = def;
    const hot = onSlotTap && tappable.includes(slot);
    return (
      <svg
        key={slot}
        x={a.x}
        y={a.y}
        width={a.w}
        height={a.h}
        viewBox="0 0 300 300"
        overflow="visible"
        data-slot={slot}
        data-item={def.id}
        data-testid={hot ? `hotspot-${slot}` : undefined}
        role={hot ? 'button' : undefined}
        tabIndex={hot ? 0 : undefined}
        aria-label={hot ? def.name : undefined}
        style={hot ? { cursor: 'pointer' } : undefined}
        onClick={hot ? () => onSlotTap(slot) : undefined}
        onKeyDown={hot ? (e) => (e.key === 'Enter' || e.key === ' ') && onSlotTap(slot) : undefined}
      >
        <Art main={main} accent={accent} />
      </svg>
    );
  };

  return (
    <svg
      viewBox="0 0 1170 2532"
      preserveAspectRatio="xMidYMid slice"
      role="group"
      aria-label={`${room.name}, ${room.themeName} theme`}
      data-testid="room-harbour-loft"
    >
      <rect width={1170} height={FLOOR_Y} fill={room.walls} />
      {Array.from({ length: 9 }).flatMap((_, row) =>
        Array.from({ length: 7 }).map((__, col) => (
          <g key={`${row}-${col}`} transform={`translate(${90 + col * 170 + (row % 2) * 85} ${400 + row * 150})`} opacity={0.55}>
            <path d="M0,-12 C6,-4 6,4 0,12 C-6,4 -6,-4 0,-12 Z" fill={wallLine} />
          </g>
        )),
      )}
      <rect x={620} y={580} width={440} height={580} rx={30} fill={trim.base} stroke={OUTLINE} strokeWidth={6} />
      <WindowView night={night} />
      <path d="M840,600 L840,1140 M640,870 L1040,870" stroke={trim.base} strokeWidth={14} />
      <rect x={640} y={600} width={400} height={540} rx={20} fill="none" stroke={OUTLINE} strokeWidth={5} />
      <Shaded d="M600,1150 L1080,1150 L1080,1190 L600,1190 Z" shade={trim} depth={4} />

      <rect y={FLOOR_Y} width={1170} height={2532 - FLOOR_Y} fill={floor.base} />
      {Array.from({ length: 6 }).map((_, i) => (
        <path
          key={i}
          d={`M0,${FLOOR_Y + 90 + i * 140} L1170,${FLOOR_Y + 90 + i * 140}`}
          stroke={floor.shadow}
          strokeWidth={4}
          opacity={0.5}
        />
      ))}
      {Array.from({ length: 12 }).map((_, i) => (
        <path
          key={i}
          d={`M${(i * 233) % 1170},${FLOOR_Y + 90 + (i % 6) * 140} l0,140`}
          stroke={floor.shadow}
          strokeWidth={4}
          opacity={0.4}
        />
      ))}
      <Shaded
        d={`M0,${FLOOR_Y - 34} L1170,${FLOOR_Y - 34} L1170,${FLOOR_Y + 6} L0,${FLOOR_Y + 6} Z`}
        shade={trim}
        depth={4}
        outline={false}
      />
      <path d={`M0,${FLOOR_Y + 6} L1170,${FLOOR_Y + 6}`} stroke={OUTLINE} strokeWidth={5} />

      {ordered.filter((s) => anchors[s].z <= 3).map(renderSlot)}
      {lampOn && (
        <g pointerEvents="none">
          <defs>
            <radialGradient id="loft-glow">
              <stop offset="0" stopColor="#FFE08A" stopOpacity={night ? 0.45 : 0.25} />
              <stop offset="1" stopColor="#FFE08A" stopOpacity={0} />
            </radialGradient>
          </defs>
          <circle cx={900} cy={1290} r={260} fill="url(#loft-glow)" />
        </g>
      )}
      {ordered.filter((s) => anchors[s].z === 4).map(renderSlot)}
      {children}
      {ordered.filter((s) => anchors[s].z > 4).map(renderSlot)}
    </svg>
  );
}
