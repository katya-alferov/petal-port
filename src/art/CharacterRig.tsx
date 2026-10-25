// The character rig (visual-design §7.1): viewBox 400×800, feet on y≈780, ~4.5 heads tall.
// Layer order follows game-systems §1.2, with arms split into back and front layers so poses that
// cross the body (hips, heart, point) draw above outerwear, bag and neck items.
import type { ReactElement } from 'react';
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
    left: { pts: [[162, 264], [142, 352], [137, 438]], layer: 'back', hand: 'rest' },
    right: { pts: [[238, 264], [258, 352], [263, 438]], layer: 'back', hand: 'rest' },
  },
  wave: {
    left: { pts: [[162, 264], [142, 352], [137, 438]], layer: 'back', hand: 'rest' },
    right: { pts: [[238, 264], [292, 230], [304, 150]], layer: 'back', hand: 'open' },
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
  const band = trim === 'cuff' ? polylineRange(arm, Math.max(0, len - 0.07), len) : trim === 'stripe' ? polylineRange(arm, len * 0.55, len * 0.7) : null;
  return (
    <g data-sleeve={type}>
      <Limb pts={part} width={SLEEVE_W} shade={main} />
      {band && band.length > 1 && (
        <g data-tint="accent">
          <Limb pts={band} width={SLEEVE_W} shade={accent} outline={false} />
        </g>
      )}
      {type === 'puff' && <Shaded d={scallopCircle(part[0][0] + (end[0] - part[0][0]) * 0.55, part[0][1] + (end[1] - part[0][1]) * 0.55, 18, 7, 2.5)} shade={main} depth={4} />}
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
          <ellipse key={i} cx={x + dx} cy={y - 14 + Math.abs(dx) * 0.4} rx={4.6} ry={9} fill={skin.base} stroke={OUTLINE} strokeWidth={2.5} />
        ))}
        <ellipse cx={x} cy={y} rx={14} ry={13} fill={skin.base} stroke={OUTLINE} strokeWidth={OUTLINE_W} />
        <ellipse cx={x - 15} cy={y + 2} rx={5} ry={8} fill={skin.base} stroke={OUTLINE} strokeWidth={2.5} transform={`rotate(-30 ${x - 15} ${y + 2})`} />
      </g>
    );
  }
  return (
    <g>
      <ellipse cx={x} cy={y + 6} rx={12.5} ry={15} fill={skin.base} stroke={OUTLINE} strokeWidth={OUTLINE_W} />
      <path d={`M${x - 4},${y + 12} Q${x},${y + 16} ${x + 4},${y + 12}`} fill="none" stroke={skin.shadow} strokeWidth={2} strokeLinecap="round" />
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

const HEAD = 'M200,48 C247,48 273,84 273,136 C273,177 246,212 200,212 C154,212 127,177 127,136 C127,84 153,48 200,48 Z';
const TORSO =
  'M182,240 C164,242 150,248 146,262 C142,290 152,330 160,372 C150,396 146,412 146,430 L254,430 C254,412 250,396 240,372 C248,330 258,290 254,262 C250,248 236,242 218,240 Z';
const LEG_LEFT = 'M151,424 L198,424 C198,500 197,560 195,620 C193,680 192,720 191,752 L166,752 C164,720 161,680 159,620 C156,560 151,500 151,424 Z';

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
      <Shaded d="M184,192 L216,192 L218,248 L182,248 Z" shade={skin} depth={5} />
      <circle cx={130} cy={148} r={14} fill={skin.base} stroke={OUTLINE} strokeWidth={OUTLINE_W} />
      <circle cx={270} cy={148} r={14} fill={skin.shadow} stroke={OUTLINE} strokeWidth={OUTLINE_W} />
      <Shaded d={HEAD} shade={skin} depth={9} />
    </g>
  );
}

function Face({ spec }: { spec: RigSpec }) {
  const { iris, blush, skin } = spec;
  const browColor = spec.hair.shadow;
  const almond = spec.eyeStyle === 'eyes.almond';
  return (
    <g>
      <ellipse cx={154} cy={172} rx={13} ry={7.5} fill={blush} opacity={0.55} />
      <ellipse cx={246} cy={172} rx={13} ry={7.5} fill={blush} opacity={0.55} />
      <g className="rig-blink">
        {[170, 230].map((cx) => (
          <g key={cx}>
            <ellipse cx={cx} cy={142} rx={almond ? 12 : 10.5} ry={almond ? 10 : 13} fill={iris} stroke="#2A2033" strokeWidth={2} />
            <ellipse cx={cx} cy={143} rx={almond ? 6 : 5.5} ry={almond ? 6 : 7.5} fill="#2A2033" />
            <circle cx={cx - 4} cy={136} r={3.6} fill="#FFFFFF" />
            <circle cx={cx + 4} cy={148} r={1.6} fill="#FFFFFF" opacity={0.85} />
            <path
              d={`M${cx - 13},${almond ? 139 : 136} Q${cx},${almond ? 127 : 124} ${cx + 13},${almond ? 139 : 136}`}
              fill="none"
              stroke="#2A2033"
              strokeWidth={3.5}
              strokeLinecap="round"
            />
            <path
              d={cx < 200 ? `M${cx - 12},${137} L${cx - 17},${132}` : `M${cx + 12},${137} L${cx + 17},${132}`}
              stroke="#2A2033"
              strokeWidth={3}
              strokeLinecap="round"
            />
          </g>
        ))}
      </g>
      <path d="M156,116 Q170,108 184,114" fill="none" stroke={browColor} strokeWidth={5} strokeLinecap="round" />
      <path d="M216,114 Q230,108 244,116" fill="none" stroke={browColor} strokeWidth={5} strokeLinecap="round" />
      <path d="M195,162 Q200,168 205,162" fill="none" stroke={skin.shadow} strokeWidth={3} strokeLinecap="round" />
      <path d="M185,178 Q200,197 215,178 Q200,185 185,178 Z" fill="#B5485F" stroke={OUTLINE} strokeWidth={2.5} strokeLinejoin="round" />
      <path d="M193,186 Q200,191 207,186" fill="none" stroke="#F49AAE" strokeWidth={3} strokeLinecap="round" />
      {spec.freckles &&
        [[178, 162], [170, 168], [184, 170], [222, 162], [230, 168], [216, 170]].map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r={1.8} fill={skin.shadow} />
        ))}
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
    <svg viewBox={crop ?? '0 0 400 800'} className={className} {...frame} role="img" aria-label={title} data-testid="character-rig" data-pose={pose}>
      <ellipse cx={200} cy={781} rx={70} ry={10} fill="#3A2E4F" opacity={0.12} />
      <g className={animate ? 'rig-breathe' : undefined}>
        <g data-layer="hair-back">{HairBack && <HairBack shade={hair} />}</g>
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
        <g data-layer="face">
          <Face spec={spec} />
        </g>
        <WearLayer items={items} slot="eyewear" />
        <g data-layer="hair-front">{HairFront && !hat?.hidesHairFront && <HairFront shade={hair} />}</g>
        <WearLayer items={items} slot="headwear" />
      </g>
    </svg>
  );
}
