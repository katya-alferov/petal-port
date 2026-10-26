// Harbour Loft room (scene canvas 1170×2532). Wall/floor/trim colors come from the chosen theme;
// furniture renders into the 8 slot anchors from content.
import type { ReactNode } from 'react';
import type { RoomSpec } from '../../content/resolve';
import type { HomeSlot } from '../../content/types';
import { OUTLINE, Shaded } from '../kit';
import { FURN_ART } from '../furn';

export const FLOOR_Y = 1680;
/** The part of the 1170×2532 canvas that holds the room: window top to just under the rug. */
const VIEW_TOP = 480;
const VIEW_BOTTOM = 2380;
const BLEED = 1200;

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
  /** Drawn on top of the table (the cooked dish). */
  onTable?: ReactNode;
  /** Decorate mode: dashed outline on every slot. */
  editing?: boolean;
}

export function HarbourLoft({ room, children, lampOn = true, onSlotTap, tappable = [], onTable, editing = false }: HarbourLoftProps) {
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
        {editing && (
          <rect
            x={0}
            y={0}
            width={300}
            height={300}
            rx={24}
            fill="#FFFFFF"
            fillOpacity={0.25}
            stroke={OUTLINE}
            strokeWidth={6}
            strokeDasharray="18 14"
          />
        )}
        <Art main={main} accent={accent} />
      </svg>
    );
  };

  return (
    <svg
      viewBox={`0 ${VIEW_TOP} 1170 ${VIEW_BOTTOM - VIEW_TOP}`}
      preserveAspectRatio="xMidYMax meet"
      style={{ overflow: 'visible' }}
      role="group"
      aria-label={`${room.name}, ${room.themeName} theme`}
      data-testid="room-harbour-loft"
    >
      {/* Walls and floor run past the canvas so any screen shape shows a whole room (visual-design §15). */}
      <rect x={-BLEED} y={-BLEED} width={1170 + BLEED * 2} height={FLOOR_Y + BLEED} fill={room.walls} />
      {room.pattern === 'leaf' &&
        Array.from({ length: 9 }).flatMap((_, row) =>
          Array.from({ length: 15 }).map((__, col) => (
            <g key={`${row}-${col}`} transform={`translate(${90 + (col - 4) * 170 + (row % 2) * 85} ${400 + row * 150})`} opacity={0.55}>
              <path d="M0,-12 C6,-4 6,4 0,12 C-6,4 -6,-4 0,-12 Z" fill={wallLine} />
            </g>
          )),
        )}
      {room.pattern === 'dots' &&
        Array.from({ length: 13 }).flatMap((_, row) =>
          Array.from({ length: 20 }).map((__, col) => (
            <circle
              key={`${row}-${col}`}
              cx={40 + (col - 5) * 120 + (row % 2) * 60}
              cy={360 + row * 100}
              r={row % 3 === 1 ? 10 : 16}
              fill={row % 3 === 1 ? trim.base : '#FFFFFF'}
              opacity={0.8}
            />
          )),
        )}
      {room.pattern === 'quilt' && (
        <g opacity={0.7}>
          {/* Tufted quilting: 45° diamonds with a button at every crossing. */}
          {Array.from({ length: 31 }).map((_, i) => (
            <path key={`a${i}`} d={`M${-1820 + i * 140},${FLOOR_Y} l1300,-1300`} stroke={wallLine} strokeWidth={4} />
          ))}
          {Array.from({ length: 31 }).map((_, i) => (
            <path key={`b${i}`} d={`M${-560 + i * 140},${FLOOR_Y} l-1300,-1300`} stroke={wallLine} strokeWidth={4} />
          ))}
          {Array.from({ length: 19 }).flatMap((_, k) =>
            Array.from({ length: 34 })
              .map((__, c) => c - 8)
              .filter((c) => (c + k) % 2 === 0)
              .map((c) => (
                <circle key={`q${k}-${c}`} cx={c * 70} cy={FLOOR_Y - k * 70} r={7} fill="#FFFFFF" stroke={wallLine} strokeWidth={2} />
              )),
          )}
        </g>
      )}
      <rect x={620} y={580} width={440} height={580} rx={30} fill={trim.base} stroke={OUTLINE} strokeWidth={6} />
      <WindowView night={night} />
      <path d="M840,600 L840,1140 M640,870 L1040,870" stroke={trim.base} strokeWidth={14} />
      <rect x={640} y={600} width={400} height={540} rx={20} fill="none" stroke={OUTLINE} strokeWidth={5} />
      <Shaded d="M600,1150 L1080,1150 L1080,1190 L600,1190 Z" shade={trim} depth={4} />

      <rect x={-BLEED} y={FLOOR_Y} width={1170 + BLEED * 2} height={2532 - FLOOR_Y + BLEED} fill={floor.base} />
      {Array.from({ length: 9 }).map((_, i) => (
        <path
          key={i}
          d={`M${-BLEED},${FLOOR_Y + 90 + i * 140} L${1170 + BLEED},${FLOOR_Y + 90 + i * 140}`}
          stroke={floor.shadow}
          strokeWidth={4}
          opacity={0.5}
        />
      ))}
      {Array.from({ length: 30 }).map((_, i) => (
        <path
          key={i}
          d={`M${((i * 233) % 2340) - 585},${FLOOR_Y + 90 + (i % 8) * 140} l0,140`}
          stroke={floor.shadow}
          strokeWidth={4}
          opacity={0.4}
        />
      ))}
      <Shaded
        d={`M${-BLEED},${FLOOR_Y - 34} L${1170 + BLEED},${FLOOR_Y - 34} L${1170 + BLEED},${FLOOR_Y + 6} L${-BLEED},${FLOOR_Y + 6} Z`}
        shade={trim}
        depth={4}
        outline={false}
      />
      <path d={`M${-BLEED},${FLOOR_Y + 6} L${1170 + BLEED},${FLOOR_Y + 6}`} stroke={OUTLINE} strokeWidth={5} />

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
      {onTable && (
        <svg
          x={anchors.table.x + anchors.table.w / 2 - 110}
          y={anchors.table.y + anchors.table.h * 0.47 - 120}
          width={220}
          height={147}
          viewBox="0 0 300 200"
          pointerEvents="none"
        >
          {onTable}
        </svg>
      )}
    </svg>
  );
}
