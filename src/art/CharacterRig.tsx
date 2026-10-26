// The character rig (visual-design §7.1): viewBox 400×800, feet on y≈780, ~4.5 heads tall.
// Layer order follows game-systems §1.2, with arms split into back and front layers so poses that
// cross the body (hips, heart, point) draw above outerwear, bag and neck items.
import { useId, type ReactElement } from 'react';
import type { Shade } from '../content/palette';
import type { RigItem, RigSpec } from '../content/resolve';
import type { SleeveTrim, SleeveType, WearSlot } from '../content/types';
import { Limb, OUTLINE, OUTLINE_W, polylineRange, polylineUpTo, Shaded, scallopCircle, type Pt } from './kit';
import { HAIR_BACK, HAIR_FRONT } from './parts/hair';
import { WEAR_ART } from './wear';

export type PoseId = 'idle' | 'wave';
export const POSES: PoseId[] = ['idle', 'wave'];

interface ArmPose {
  pts: [Pt, Pt, Pt]; // shoulder, elbow, wrist
  layer: 'back' | 'front';
  hand: 'rest' | 'open';
}

// "left"/"right" are the viewer's left/right.
const ARM_POSES: Record<PoseId, { left: ArmPose; right: ArmPose }> = {
  idle: {
    left: {
      pts: [
        [162, 264],
        [142, 352],
        [137, 438],
      ],
      layer: 'back',
      hand: 'rest',
    },
    right: {
      pts: [
        [238, 264],
        [258, 352],
        [263, 438],
      ],
      layer: 'back',
      hand: 'rest',
    },
  },
  wave: {
    left: {
      pts: [
        [162, 264],
        [142, 352],
        [137, 438],
      ],
      layer: 'back',
      hand: 'rest',
    },
    right: {
      pts: [
        [238, 264],
        [292, 230],
        [304, 150],
      ],
      layer: 'back',
      hand: 'open',
    },
  },
};

const SLEEVE_LENGTH: Record<SleeveType, number> = { none: 0, cap: 0.16, short: 0.38, puff: 0.3, long: 0.95 };

const ARM_W = 24;
const SLEEVE_W = 29;

function Sleeve({ arm, type, trim, main, accent }: { arm: Pt[]; type: SleeveType; trim?: SleeveTrim; main: Shade; accent: Shade }) {
  if (type === 'none') return null;
  const len = SLEEVE_LENGTH[type];
  const part = polylineUpTo(arm, len);
  const end = part[part.length - 1];
  const band =
    trim === 'cuff'
      ? polylineRange(arm, Math.max(0, len - 0.07), len)
      : trim === 'stripe'
        ? polylineRange(arm, len * 0.55, len * 0.7)
        : null;
  return (
    <g data-sleeve={type}>
      <Limb pts={part} width={SLEEVE_W} shade={main} />
      {band && band.length > 1 && (
        <g data-tint="accent">
          <Limb pts={band} width={SLEEVE_W} shade={accent} outline={false} />
        </g>
      )}
      {type === 'puff' && (
        <Shaded
          d={scallopCircle(part[0][0] + (end[0] - part[0][0]) * 0.55, part[0][1] + (end[1] - part[0][1]) * 0.55, 18, 7, 2.5)}
          shade={main}
          depth={4}
        />
      )}
      {trim === 'cuff' && <circle cx={end[0]} cy={end[1]} r={SLEEVE_W / 2} fill="none" stroke={OUTLINE} strokeWidth={2} opacity={0.6} />}
    </g>
  );
}

function Hand({ at, kind, skin }: { at: Pt; kind: ArmPose['hand']; skin: Shade }) {
  const [x, y] = at;
  if (kind === 'open') {
    return (
      <g>
        {[-10, -3, 4, 11].map((dx, i) => (
          <ellipse
            key={i}
            cx={x + dx}
            cy={y - 14 + Math.abs(dx) * 0.4}
            rx={4.6}
            ry={9}
            fill={skin.base}
            stroke={OUTLINE}
            strokeWidth={2.5}
          />
        ))}
        <ellipse cx={x} cy={y} rx={14} ry={13} fill={skin.base} stroke={OUTLINE} strokeWidth={OUTLINE_W} />
        <ellipse
          cx={x - 15}
          cy={y + 2}
          rx={5}
          ry={8}
          fill={skin.base}
          stroke={OUTLINE}
          strokeWidth={2.5}
          transform={`rotate(-30 ${x - 15} ${y + 2})`}
        />
      </g>
    );
  }
  return (
    <g>
      <ellipse cx={x} cy={y + 6} rx={12.5} ry={15} fill={skin.base} stroke={OUTLINE} strokeWidth={OUTLINE_W} />
      <path
        d={`M${x - 4},${y + 12} Q${x},${y + 16} ${x + 4},${y + 12}`}
        fill="none"
        stroke={skin.shadow}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </g>
  );
}

function Arm({ pose, skin, items }: { pose: ArmPose; skin: Shade; items: RigSpec['items'] }) {
  const arm = pose.pts as Pt[];
  const base = items.dress ?? items.top;
  const outer = items.outerwear;
  return (
    <g>
      <Limb pts={arm} width={ARM_W} shade={skin} />
      <Hand at={arm[2]} kind={pose.hand} skin={skin} />
      {base && <Sleeve arm={arm} type={base.sleeve} trim={base.sleeveTrim} main={base.main} accent={base.accent} />}
      {outer && <Sleeve arm={arm} type={outer.sleeve} trim={outer.sleeveTrim} main={outer.main} accent={outer.accent} />}
    </g>
  );
}

const HEAD =
  'M200,46 C250,46 276,84 276,134 C276,172 258,199 230,210 C219,215 210,217 200,217 C190,217 181,215 170,210 C142,199 124,172 124,134 C124,84 150,46 200,46 Z';
const TORSO =
  'M182,240 C164,242 150,248 146,262 C142,290 152,330 160,372 C150,396 146,412 146,430 L254,430 C254,412 250,396 240,372 C248,330 258,290 254,262 C250,248 236,242 218,240 Z';
const LEG_LEFT =
  'M151,424 L198,424 C198,500 197,560 195,620 C193,680 192,720 191,752 L166,752 C164,720 161,680 160,640 C158,600 160,580 157,540 C154,500 151,470 151,424 Z';

/** Head layers are drawn a little larger than the body: big heads read as cute (visual-design §7.1). */
const HEAD_T = 'translate(200 226) scale(1.1) translate(-200 -226)';

function Body({ skin }: { skin: Shade }) {
  return (
    <g>
      <Shaded d={LEG_LEFT} shade={skin} depth={6} />
      <g transform="translate(400 0) scale(-1 1)">
        <Shaded d={LEG_LEFT} shade={skin} depth={-6} />
      </g>
      {[179, 221].map((x) => (
        <ellipse key={x} cx={x} cy={765} rx={20} ry={13} fill={skin.base} stroke={OUTLINE} strokeWidth={OUTLINE_W} />
      ))}
      <Shaded d={TORSO} shade={skin} />
      <Shaded d="M186,196 L214,196 L216,248 L184,248 Z" shade={skin} depth={5} />
    </g>
  );
}

function Head({ skin }: { skin: Shade }) {
  return (
    <g>
      <ellipse cx={127} cy={150} rx={12} ry={15} fill={skin.base} stroke={OUTLINE} strokeWidth={OUTLINE_W} />
      <ellipse cx={273} cy={150} rx={12} ry={15} fill={skin.shadow} stroke={OUTLINE} strokeWidth={OUTLINE_W} />
      <Shaded d={HEAD} shade={skin} depth={9} />
    </g>
  );
}

const LASH = '#2A2033';

/** Mixes a hex color toward another (t in 0..1); used for the two-tone doll iris. */
function tone(a: string, b: string, t: number): string {
  const n = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const [x, y] = [n(a), n(b)];
  return (
    '#' +
    x
      .map((v, i) =>
        Math.round(v + (y[i] - v) * t)
          .toString(16)
          .padStart(2, '0'),
      )
      .join('')
  );
}

/** Four-point sparkle, the classic glint of 2009 doll art. */
function Glint({ x, y, r }: { x: number; y: number; r: number }) {
  return (
    <path
      d={`M${x},${y - r} Q${x},${y} ${x + r},${y} Q${x},${y} ${x},${y + r} Q${x},${y} ${x - r},${y} Q${x},${y} ${x},${y - r} Z`}
      fill="#FFFFFF"
    />
  );
}

function Eye({ cx, iris, almond, side }: { cx: number; iris: string; almond: boolean; side: -1 | 1 }) {
  const clip = useId().replace(/:/g, '');
  const cy = 147;
  const rx = almond ? 17 : 15.5;
  const ry = almond ? 15 : 18.5;
  const top = cy - ry;
  // Outer corner is on the side away from the nose.
  const ox = cx + side * (rx + 2);
  return (
    <g>
      <defs>
        <clipPath id={clip}>
          <ellipse cx={cx} cy={cy} rx={rx} ry={ry} />
        </clipPath>
      </defs>
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={tone(iris, '#2A2033', 0.25)} />
      <g clipPath={`url(#${clip})`}>
        {/* Two-tone glassy iris: dark top under the lashes, bright glow at the bottom. */}
        <ellipse cx={cx} cy={cy + ry * 0.45} rx={rx * 0.95} ry={ry * 0.7} fill={iris} />
        <ellipse cx={cx} cy={cy + ry * 0.8} rx={rx * 0.75} ry={ry * 0.42} fill={tone(iris, '#FFFFFF', 0.45)} />
        <rect x={cx - rx} y={top} width={rx * 2} height={ry * 0.5} fill={LASH} opacity={0.45} />
        <ellipse cx={cx} cy={cy + 1} rx={rx * 0.42} ry={ry * 0.48} fill={LASH} />
      </g>
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none" stroke={LASH} strokeWidth={2} />
      <ellipse cx={cx - 5} cy={cy - 6} rx={6} ry={6.5} fill="#FFFFFF" />
      <circle cx={cx + 6} cy={cy + 8} r={2.6} fill="#FFFFFF" />
      <Glint x={cx + 7} y={cy - 6} r={4.5} />
      {/* Thick winged lash line with three lashes toward the outer corner. */}
      <path
        d={`M${cx - side * (rx + 1)},${cy - ry * 0.3} Q${cx - side * 2},${top - 6} ${ox + side * 3},${cy - ry * 0.55}`}
        fill="none"
        stroke={LASH}
        strokeWidth={6}
        strokeLinecap="round"
      />
      {[0, 1, 2].map((i) => (
        <path
          key={i}
          d={`M${ox - side * (2 + i * 7)},${cy - ry * (0.6 + i * 0.2)} q${side * 6},-3 ${side * 9},-${9 - i}`}
          fill="none"
          stroke={LASH}
          strokeWidth={3 - i * 0.3}
          strokeLinecap="round"
        />
      ))}
      <path
        d={`M${cx - side * 5},${cy + ry + 3} Q${cx + side * 6},${cy + ry + 4} ${ox - side * 2},${cy + ry * 0.5}`}
        fill="none"
        stroke={LASH}
        strokeWidth={1.8}
        strokeLinecap="round"
        opacity={0.6}
      />
    </g>
  );
}

function Face({ spec }: { spec: RigSpec }) {
  const { iris, blush, skin } = spec;
  const browColor = spec.hair.shadow;
  const almond = spec.eyeStyle === 'eyes.almond';
  return (
    <g>
      <ellipse cx={154} cy={182} rx={16} ry={9} fill={blush} opacity={0.6} />
      <ellipse cx={246} cy={182} rx={16} ry={9} fill={blush} opacity={0.6} />
      <path
        d="M146,184 l5,-7 M153,185 l5,-7 M160,185 l4,-6 M240,185 l4,-6 M247,185 l5,-7 M254,184 l5,-7"
        stroke="#FFFFFF"
        strokeWidth={1.8}
        strokeLinecap="round"
        opacity={0.75}
      />
      <g className="rig-blink">
        <Eye cx={167} iris={iris} almond={almond} side={-1} />
        <Eye cx={233} iris={iris} almond={almond} side={1} />
      </g>
      <path d="M152,113 Q166,105 182,110" fill="none" stroke={browColor} strokeWidth={4.5} strokeLinecap="round" />
      <path d="M218,110 Q234,105 248,113" fill="none" stroke={browColor} strokeWidth={4.5} strokeLinecap="round" />
      <path d="M196,170 Q200,174 204,170" fill="none" stroke={skin.shadow} strokeWidth={3} strokeLinecap="round" />
      {/* Glossy open smile: lip-gloss pink, a row of teeth, and a shine dot. */}
      <path d="M185,185 Q200,205 215,185 Q200,189 185,185 Z" fill="#C84B6E" stroke={OUTLINE} strokeWidth={2.2} strokeLinejoin="round" />
      <path d="M188,186.5 Q200,190 212,186.5 L210,190 Q200,193 190,190 Z" fill="#FFFFFF" />
      <path d="M193,197 Q200,201 207,197" fill="none" stroke="#FF8FB1" strokeWidth={3} strokeLinecap="round" />
      <circle cx={205} cy={196} r={1.5} fill="#FFFFFF" />
      {spec.freckles &&
        [
          [150, 168],
          [160, 173],
          [143, 174],
          [250, 168],
          [240, 173],
          [257, 174],
        ].map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r={1.8} fill={skin.shadow} />)}
    </g>
  );
}

function WearLayer({ items, slot }: { items: RigSpec['items']; slot: WearSlot }): ReactElement | null {
  const t: RigItem | undefined = items[slot];
  if (!t) return null;
  const Art = WEAR_ART[t.art];
  return Art ? (
    <g data-slot={slot} data-item={t.id}>
      <Art main={t.main} accent={t.accent} />
    </g>
  ) : null;
}

export interface CharacterRigProps {
  spec: RigSpec;
  pose?: PoseId;
  title?: string;
  className?: string;
  animate?: boolean;
  /** Position inside a parent SVG scene (scene units). */
  frame?: { x: number; y: number; width: number; height: number };
  /** Crop for thumbnails, e.g. the head only: "110 20 180 200". */
  crop?: string;
}

export function CharacterRig({ spec, pose = 'idle', title = 'Your character', className, animate = true, frame, crop }: CharacterRigProps) {
  const { skin, hair, items } = spec;
  const HairBack = HAIR_BACK[spec.hairArt];
  const HairFront = HAIR_FRONT[spec.hairArt];
  const arms = ARM_POSES[pose];
  const backArms = [arms.left, arms.right].filter((a) => a.layer === 'back');
  const frontArms = [arms.left, arms.right].filter((a) => a.layer === 'front');
  const hat = items.headwear;

  return (
    <svg
      viewBox={crop ?? '0 0 400 800'}
      className={className}
      {...frame}
      role="img"
      aria-label={title}
      data-testid="character-rig"
      data-pose={pose}
    >
      <ellipse cx={200} cy={781} rx={70} ry={10} fill="#3A2E4F" opacity={0.12} />
      <g className={animate ? 'rig-breathe' : undefined}>
        <g data-layer="hair-back" transform={HEAD_T}>
          {HairBack && <HairBack shade={hair} />}
        </g>
        <g data-layer="body">
          <Body skin={skin} />
        </g>
        {items.dress ? (
          <>
            <WearLayer items={items} slot="shoes" />
            <WearLayer items={items} slot="dress" />
          </>
        ) : (
          <>
            <WearLayer items={items} slot="bottom" />
            <WearLayer items={items} slot="shoes" />
            <WearLayer items={items} slot="top" />
          </>
        )}
        <g data-layer="arms-back">
          {backArms.map((a, i) => (
            <Arm key={i} pose={a} skin={skin} items={items} />
          ))}
        </g>
        <WearLayer items={items} slot="outerwear" />
        <WearLayer items={items} slot="bag" />
        <WearLayer items={items} slot="neck" />
        <g data-layer="arms-front">
          {frontArms.map((a, i) => (
            <Arm key={i} pose={a} skin={skin} items={items} />
          ))}
        </g>
        <g data-layer="head" transform={HEAD_T}>
          <Head skin={skin} />
          <g data-layer="face">
            <Face spec={spec} />
          </g>
          <WearLayer items={items} slot="eyewear" />
          <g data-layer="hair-front">{HairFront && !hat?.hidesHairFront && <HairFront shade={hair} />}</g>
          <WearLayer items={items} slot="headwear" />
        </g>
      </g>
    </svg>
  );
}
