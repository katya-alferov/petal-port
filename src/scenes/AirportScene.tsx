// Airport (game-systems §7.1): ticket desk, departures board and luggage trolley. The ticket is a
// one-time 400 coin goal; Fly! is free once it is yours.
import { useState } from 'react';
import { hasTicket, PARIS_TICKET, ticketPrice } from '../game/travel';
import { NEWYORK_TICKET, type DestId } from '../game/trips';
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
  const flyTo = useGame((s) => s.flyTo);
  const flyToParis = useGame((s) => s.flyToParis);
  const showToast = useGame((s) => s.showToast);
  const [desk, setDesk] = useState(false);
  const [board, setBoard] = useState(false);
  const [trolley, setTrolley] = useState(false);
  const missing = Math.max(0, PARIS_TICKET - coins);
  const nyMissing = Math.max(0, NEWYORK_TICKET - coins);
  const cities: { id: DestId; name: string; line: string; testSuffix: string }[] = [
    { id: 'paris', name: 'Paris, France', line: 'Cafés, a tower and a sparkle train to Storybook Kingdom.', testSuffix: '' },
    {
      id: 'newyork',
      name: 'New York, USA',
      line: 'Skyscrapers, yellow cabs and a ferry to the Boardwalk Funfair.',
      testSuffix: '-newyork',
    },
  ];

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

            aria-label="DEPARTURES"
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
              DEPARTURES
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
        {!travel.ticket
          ? `A Paris ticket costs ${PARIS_TICKET} coins. ${missing > 0 ? `${missing} to go.` : 'You can buy it now!'}`
          : !hasTicket(travel, 'newyork')
            ? `You can fly to Paris! A New York ticket costs ${NEWYORK_TICKET} coins${nyMissing > 0 ? `, ${nyMissing} to go.` : '. You can buy it now!'}`
            : 'You have tickets to Paris and New York!'}
      </p>
      <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 12px 14px' }}>
        <Button tone="primary" icon="star" onClick={() => (play('chime'), setDesk(true))} testId="airport-open-desk">
          {travel.ticket ? 'Go to the gate' : 'Ticket desk'}
        </Button>
      </div>
      {desk && (
        <Sheet title="Ticket desk" onClose={() => setDesk(false)}>
          <div style={{ display: 'grid', gap: 12 }} data-testid="ticket-card">
            {cities.map((c) => {
              const own = hasTicket(travel, c.id);
              const price = ticketPrice(c.id);
              const need = Math.max(0, price - coins);
              return (
                <div
                  key={c.id}
                  className="panel"
                  style={{ display: 'grid', gap: 8, justifyItems: 'center', textAlign: 'center' }}
                  data-testid={`dest-${c.id}`}
                >
                  <p className="display" style={{ fontSize: '1.3rem', margin: 0 }}>
                    {c.name}
                  </p>
                  <p style={{ margin: 0 }}>{c.line}</p>
                  <span className="price-tag">
                    <Icon name="coin" />
                    {price}
                  </span>
                  {own ? (
                    <Button
                      tone="primary"
                      icon="star"
                      testId={`airport-fly${c.testSuffix}`}
                      onClick={() => (play('chime'), setDesk(false), c.id === 'paris' ? flyToParis() : flyTo(c.id))}
                    >
                      {c.id === 'paris' ? 'Fly to Paris!' : 'Fly to New York!'}
                    </Button>
                  ) : (
                    <Button
                      tone="primary"
                      icon="coin"
                      disabledReason={need > 0 ? `You need ${need} more coins.` : undefined}
                      testId={`airport-buy${c.testSuffix}`}
                      onClick={() => {
                        if (buyTicket(c.id)) {
                          play('chime');
                          showToast(`Your ticket to ${c.id === 'paris' ? 'Paris' : 'New York'}!`, 'sparkle');
                        }
                      }}
                    >
                      Buy the ticket
                    </Button>
                  )}
                </div>
              );
            })}
            <p style={{ margin: 0, textAlign: 'center', fontSize: '0.95rem' }}>
              Earn coins at the café, salon, kitchen or stage. Nothing runs out, so take your time.
            </p>
          </div>
        </Sheet>
      )}
      {board && (
        <Sheet title="Departures" onClose={() => setBoard(false)}>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 6, fontWeight: 800 }} data-testid="board-card">
            <li className="panel" style={{ padding: '6px 12px' }}>
              PARIS: ON TIME
            </li>
            <li className="panel" style={{ padding: '6px 12px' }}>
              NEW YORK: ON TIME
            </li>
            {['…', '…'].map((x, i) => (
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
