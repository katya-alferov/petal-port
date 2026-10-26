// Sticker UI kit (visual-design §6). Pure presentation: no game knowledge.
import { useEffect, useState, type ReactNode } from 'react';
import { Icon } from './icons';

type Tone = 'primary' | 'secondary' | 'confirm';

export function Button({
  children,
  tone = 'secondary',
  onClick,
  disabledReason,
  testId,
  icon,
}: {
  children: ReactNode;
  tone?: Tone;
  onClick?: () => void;
  /** Disabled buttons still respond: tapping explains why (visual-design §6). */
  disabledReason?: string;
  testId?: string;
  icon?: string;
}) {
  const [explain, setExplain] = useState(false);
  const cls = tone === 'primary' ? 'btn btn-primary' : tone === 'confirm' ? 'btn btn-secondary btn-confirm' : 'btn btn-secondary';
  return (
    <span style={{ position: 'relative', display: 'inline-flex' }}>
      <button
        type="button"
        className={cls}
        data-testid={testId}
        aria-disabled={disabledReason ? 'true' : undefined}
        onClick={() => {
          if (disabledReason) {
            setExplain(true);
            window.setTimeout(() => setExplain(false), 2000);
            return;
          }
          onClick?.();
        }}
      >
        {icon && <Icon name={icon} />}
        {children}
      </button>
      {explain && disabledReason && (
        <span
          role="status"
          className="panel pop-in"
          style={{
            position: 'absolute',
            bottom: '110%',
            left: '50%',
            transform: 'translateX(-50%)',
            whiteSpace: 'nowrap',
            padding: '8px 12px',
          }}
        >
          {disabledReason}
        </span>
      )}
    </span>
  );
}

export function IconButton({ icon, label, onClick, testId }: { icon: string; label: string; onClick?: () => void; testId?: string }) {
  return (
    <button type="button" className="icon-btn" aria-label={label} title={label} onClick={onClick} data-testid={testId}>
      <Icon name={icon} />
    </button>
  );
}

export function Panel({ children, className = '', style }: { children: ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`panel ${className}`} style={style}>
      {children}
    </div>
  );
}

export function Tabs<T extends string>({
  tabs,
  value,
  onChange,
  label,
}: {
  tabs: { id: T; label: string }[];
  value: T;
  onChange: (id: T) => void;
  label: string;
}) {
  return (
    <div className="tabs" role="tablist" aria-label={label}>
      {tabs.map((t) => (
        <button
          key={t.id}
          type="button"
          role="tab"
          className="tab"
          aria-selected={t.id === value}
          data-testid={`tab-${t.id}`}
          onClick={() => onChange(t.id)}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

export function Carousel({ children, label }: { children: ReactNode; label: string }) {
  return (
    <div
      className="carousel"
      role="group"
      aria-label={label}
      onKeyDown={(e) => {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        const items = Array.from(e.currentTarget.querySelectorAll<HTMLButtonElement>('button'));
        const i = items.indexOf(document.activeElement as HTMLButtonElement);
        const next = items[Math.max(0, Math.min(items.length - 1, i + (e.key === 'ArrowRight' ? 1 : -1)))];
        next?.focus();
        next?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
      }}
    >
      {children}
    </div>
  );
}

export function Tile({
  children,
  label,
  selected,
  onClick,
  testId,
  badge,
}: {
  children: ReactNode;
  label: string;
  selected?: boolean;
  onClick?: () => void;
  testId?: string;
  badge?: string;
}) {
  return (
    <button type="button" className="tile" aria-label={label} aria-pressed={selected} onClick={onClick} data-testid={testId}>
      {children}
      {badge && <span className="badge">{badge}</span>}
    </button>
  );
}

export function Swatch({ color, label, selected, onClick }: { color: string; label: string; selected?: boolean; onClick?: () => void }) {
  return (
    <button type="button" className="swatch" aria-label={label} aria-pressed={selected} onClick={onClick}>
      <span style={{ background: color }} />
    </button>
  );
}

export function Toast({ message, icon = 'sparkle', onDone }: { message: string; icon?: string; onDone: () => void }) {
  useEffect(() => {
    const t = window.setTimeout(onDone, 2500);
    return () => window.clearTimeout(t);
  }, [message, onDone]);
  return (
    <div className="toast panel" role="status" aria-live="polite" style={{ padding: '8px 14px' }}>
      <span style={{ width: 28, height: 28, display: 'inline-block' }}>
        <Icon name={icon} />
      </span>
      {message}
    </div>
  );
}

export function Sheet({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  return (
    <div className="sheet-scrim" onClick={onClose}>
      <div className="sheet" role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()}>
        <div className="sheet-grabber" />
        <h2 className="display" style={{ marginBottom: 12 }}>
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
}

export function ProgressRing({ value, size = 40 }: { value: number; size?: number }) {
  const r = (size - 6) / 2;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`${Math.round(value * 100)} percent`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#FFEBD2" strokeWidth={4} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="#FFC94A"
        strokeWidth={4}
        strokeDasharray={`${c * Math.max(0, Math.min(1, value))} ${c}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </svg>
  );
}

export function CoinPill({ coins, goal }: { coins: number; goal?: number }) {
  return (
    <div className="coin-pill" data-testid="coin-pill" aria-label={`${coins} coins`}>
      <span style={{ width: 34, height: 34, display: 'inline-block' }}>
        <Icon name="coin" />
      </span>
      {coins}
      {goal !== undefined && <ProgressRing value={coins / goal} size={30} />}
    </div>
  );
}

export interface DockItem {
  id: string;
  label: string;
  icon: string;
}

export function Dock({ items, current, onSelect }: { items: DockItem[]; current: string; onSelect: (id: string) => void }) {
  return (
    <nav className="dock" aria-label="Main">
      {items.map((it) => (
        <button
          key={it.id}
          type="button"
          className="dock-btn"
          aria-current={it.id === current ? 'page' : undefined}
          onClick={() => onSelect(it.id)}
          data-testid={`dock-${it.id}`}
        >
          <span className="dock-icon">
            <Icon name={it.icon} />
          </span>
          {it.label}
        </button>
      ))}
    </nav>
  );
}

/** Grown-up gate: a sum a 7-year-old is unlikely to answer by accident. */
export function MathGate({ onPass, onCancel }: { onPass: () => void; onCancel: () => void }) {
  const [q] = useState(() => {
    const a = 6 + Math.floor(Math.random() * 7);
    const b = 7 + Math.floor(Math.random() * 6);
    return { a, b };
  });
  const [value, setValue] = useState('');
  const [wrong, setWrong] = useState(false);
  return (
    <Sheet title="For grown-ups" onClose={onCancel}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (Number(value) === q.a * q.b) onPass();
          else {
            setWrong(true);
            setValue('');
          }
        }}
        style={{ display: 'grid', gap: 12 }}
      >
        <label className="label" htmlFor="gate-answer">
          What is {q.a} × {q.b}?
        </label>
        <input
          id="gate-answer"
          inputMode="numeric"
          autoComplete="off"
          value={value}
          onChange={(e) => setValue(e.target.value.replace(/\D/g, ''))}
          style={{ font: 'inherit', fontSize: '1.5rem', padding: 12, borderRadius: 16, border: '3px solid #5B4A6E', userSelect: 'text' }}
          data-testid="gate-input"
        />
        {wrong && <p role="status">Not quite. Ask a grown-up to help!</p>}
        <button type="submit" className="btn btn-primary" data-testid="gate-submit">
          Continue
        </button>
      </form>
    </Sheet>
  );
}
