// Airport (game-systems §7.1): ticket desk, departures board and luggage trolley. The ticket is a
// one-time 400 coin goal; Fly! is free once it is yours.
import { useState } from 'react';
import { PARIS_TICKET } from '../game/travel';
import { play } from '../platform/audio';
import { useGame } from '../state/store';
import { Button, Sheet } from '../ui/kit';
import { Icon } from '../ui/icons';
import { ActivityBar } from './common';
import { OUTLINE } from '../art/kit';

const sw = { stroke: OUTLINE, strokeWidth: 4, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const };

export function AirportScene() {
  const setScene = useGame((s) => s.setScene);
  const coins = useGame((s) => s.save.wallet.coins);
  const travel = useGame((s) => s.save.progress.travel);
  const buyTicket = useGame((s) => s.buyTicket);
  const flyToParis = useGame((s) => s.flyToParis);
  const showToast = useGame((s) => s.showToast);
  const [desk, setDesk] = useState(false);
  const [board, setBoard] = useState(false);
  const [trolley, setTrolley] = useState(false);
  const missing = Math.max(0, PARIS_TICKET - coins);

  return (
    <section className="scene" aria-label="Airport" style={{ background: 'linear-gradient(#BFE6FF, #E7F6FF 55%, #FFF0D6)' }}>
      <ActivityBar title="Airport" onBack={() => setScene('town')} />
      <div className="airport-art">
        <svg viewBox="0 0 400 560" preserveAspectRatio="xMidYMax meet" aria-label="The airport hall">
          <rect x={0} y={330} width={400} height={230} fill="#F3D9B1" />
          <rect x={0} y={320} width={400} height={16} fill="#EBC995" stroke={OUTLINE} strokeWidth={3} />
          <path d="M40,120 h320 v200 h-320 Z" fill="#E7F6FF" {...sw} />
          <path d="M60,250 C120,230 200,236 360,214" stroke="#8EC9FF" strokeWidth={6} fill="none" />
          <g transform="translate(262 232)">
            <ellipse cx={0} cy={0} rx={70} ry={20} fill="#FFF7EC" {...sw} />
            <path d="M-12,-4 L-52,-44 L-26,-44 L26,-6 Z" fill="#FF7BA9" {...sw} />
            <path d="M-58,0 l-14,-22 h20 l20,22 Z" fill="#FF7BA9" {...sw} />
            {[-30, -10, 10, 30].map((x) => (
              <circle key={x} cx={x} cy={-2} r={5} fill="#8EC9FF" {...sw} />
            ))}
          </g>
          <g
            role="button"
            tabIndex={0}

            aria-label="PARIS ON TIME"
            data-testid="airport-board"
            style={{ cursor: 'pointer' }}
            onClick={() => (play('pop'), setBoard(true))}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (play('pop'), setBoard(true))}
          >
            <rect x={60} y={28} width={150} height={78} rx={10} fill="#3A2E4F" {...sw} />
            <text
              aria-hidden="true"
              x={135}
              y={74}
              textAnchor="middle"
              fontFamily="Fredoka, sans-serif"
              fontWeight={600}
              fontSize={20}
              fill="#FFE08A"
            >
              PARIS ON TIME
            </text>
          </g>
          <g
            role="button"
            tabIndex={0}

            aria-label="TICKETS"
            data-testid="airport-desk"
            style={{ cursor: 'pointer' }}
            onClick={() => (play('pop'), setDesk(true))}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (play('pop'), setDesk(true))}
          >
            <rect x={60} y={380} width={170} height={110} rx={14} fill="#B692F6" {...sw} />
            <rect x={52} y={366} width={186} height={26} rx={10} fill="#FFC94A" {...sw} />
            <rect x={96} y={330} width={100} height={30} rx={8} fill="#FFF7EC" {...sw} />
            <text
              aria-hidden="true"
              x={146}
              y={352}
              textAnchor="middle"
              fontFamily="Fredoka, sans-serif"
              fontWeight={600}
              fontSize={18}
              fill={OUTLINE}
            >
              TICKETS
            </text>
          </g>
          <g
            role="button"
            tabIndex={0}
            aria-label="Luggage trolley"
            data-testid="airport-trolley"
            style={{ cursor: 'pointer' }}
            onClick={() => (play('pop'), setTrolley(true))}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (play('pop'), setTrolley(true))}
          >
            <rect x={280} y={420} width={86} height={58} rx={10} fill="#FF7BA9" {...sw} />
            <path d="M310,420 v-18 h26 v18" fill="none" {...sw} />
            <circle cx={296} cy={496} r={9} fill="#8E78D8" {...sw} />
            <circle cx={350} cy={496} r={9} fill="#8E78D8" {...sw} />
          </g>
        </svg>
      </div>
      <p
        className="panel"
        style={{ margin: '0 12px', padding: '6px 12px', textAlign: 'center', fontWeight: 800 }}
        data-testid="airport-line"
      >
        {travel.ticket
          ? 'You have a ticket to Paris!'
          : `A Paris ticket costs ${PARIS_TICKET} coins. ${missing > 0 ? `${missing} to go.` : 'You can buy it now!'}`}
      </p>
      <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 12px 14px' }}>
        <Button tone="primary" icon="star" onClick={() => (play('chime'), setDesk(true))} testId="airport-open-desk">
          {travel.ticket ? 'Go to the gate' : 'Ticket desk'}
        </Button>
      </div>
      {desk && (
        <Sheet title="Ticket desk" onClose={() => setDesk(false)}>
          <div style={{ display: 'grid', gap: 10, justifyItems: 'center', textAlign: 'center' }} data-testid="ticket-card">
            <p className="display" style={{ fontSize: '1.4rem', margin: 0 }}>
              One ticket to Paris
            </p>
            <span className="price-tag">
              <Icon name="coin" />
              {PARIS_TICKET}
            </span>
            {travel.ticket ? (
              <>
                <p style={{ margin: 0 }}>Your ticket is stamped. Ready to fly?</p>
                <Button tone="primary" icon="star" testId="airport-fly" onClick={() => (play('chime'), setDesk(false), flyToParis())}>
                  Fly to Paris!
                </Button>
              </>
            ) : (
              <>
                <p style={{ margin: 0 }}>
                  {missing > 0
                    ? `Earn ${missing} more coins at the café, salon, kitchen or stage. Nothing runs out, so take your time.`
                    : 'You have enough coins!'}
                </p>
                <Button
                  tone="primary"
                  icon="coin"
                  disabledReason={missing > 0 ? `You need ${missing} more coins.` : undefined}
                  testId="airport-buy"
                  onClick={() => {
                    if (buyTicket()) {
                      play('chime');
                      showToast('Your ticket to Paris!', 'sparkle');
                    }
                  }}
                >
                  Buy the ticket
                </Button>
              </>
            )}
          </div>
        </Sheet>
      )}
      {board && (
        <Sheet title="Departures" onClose={() => setBoard(false)}>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 6, fontWeight: 800 }} data-testid="board-card">
            <li className="panel" style={{ padding: '6px 12px' }}>
              PARIS: ON TIME
            </li>
            {['…', '…', '…'].map((x, i) => (
              <li key={i} className="panel" style={{ padding: '6px 12px', opacity: 0.5 }}>
                {x} (a new place is coming)
              </li>
            ))}
          </ul>
        </Sheet>
      )}
      {trolley && (
        <Sheet title="Your suitcase" onClose={() => setTrolley(false)}>
          <p style={{ margin: 0, textAlign: 'center', fontWeight: 800 }} data-testid="trolley-card">
            Everything is packed, and your outfit is folded on top. Ready when you are!
          </p>
        </Sheet>
      )}
    </section>
  );
}
