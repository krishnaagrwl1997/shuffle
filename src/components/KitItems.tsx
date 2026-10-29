import { useId, type CSSProperties } from 'react';
import type { EventKit, Guest, StickerKind } from '../lib/types';
import { PALETTES, cardFor, cardLine, firstName, initials, monogram, prettyDate, prettyTime } from '../lib/kit';
import { t } from '../lib/i18n';
import { Mascot } from './Mascot';

function vars(event: EventKit): CSSProperties {
  const p = PALETTES[event.style];
  return { '--p': p.paper, '--i': p.ink, '--a': p.accent, '--a2': p.accent2 } as CSSProperties;
}

interface CardProps {
  event: EventKit;
  guest: Guest;
  index: number;
  small?: boolean;
}

/** A personal playing card. Standard poker size: 63 × 88 mm. */
export function PlayingCard({ event, guest, index, small }: CardProps) {
  const face = cardFor(index);
  return (
    <div className={`pcard ${face.red ? 'red' : ''} ${small ? 'sm' : ''}`} style={vars(event)}>
      <div className="corner tl"><span>{face.rank}</span><span>{face.suit}</span></div>
      <div className="ini">{initials(guest.name)}</div>
      <div className="nm">{guest.name}</div>
      <div className="role">{cardLine(guest, index)}</div>
      <div className="evs">{event.name || 'Your event'}</div>
      <div className="corner br"><span>{face.rank}</span><span>{face.suit}</span></div>
    </div>
  );
}

/** Back of every card in the deck: the mascot if there is one, otherwise a monogram. */
export function CardBack({ event, small }: { event: EventKit; small?: boolean }) {
  const p = PALETTES[event.style];
  return (
    <div className={`pcard back ${small ? 'sm' : ''}`} style={vars(event)}>
      {event.mascot.enabled ? (
        <div className="back-mascot"><Mascot mascot={event.mascot} size={small ? 56 : 96} accent={p.accent} /></div>
      ) : (
        <div className="mono">{monogram(event.name)}</div>
      )}
    </div>
  );
}

interface StickerProps {
  event: EventKit;
  kind: StickerKind;
  size?: number;
}

/** A 50 mm die-cut sticker. The dashed grey line is the cut path the printer follows. */
export function Sticker({ event, kind, size = 130 }: StickerProps) {
  const p = PALETTES[event.style];
  const pathId = useId().replace(/:/g, '');
  const name = (event.name || 'Your event').toUpperCase().slice(0, 28);
  const year = event.date.slice(0, 4);
  const cut = { fill: 'none', stroke: '#9A9A9A', strokeDasharray: '3 3', strokeWidth: 1 };
  const display = { fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 800 };
  const mono = { fontFamily: 'JetBrains Mono, monospace', fontWeight: 700 };
  let body;
  switch (kind) {
    case 'badge':
      body = (
        <>
          <circle cx="60" cy="60" r="56" fill={p.ink} />
          <circle cx="60" cy="60" r="56" {...cut} />
          <circle cx="60" cy="60" r="36" fill={p.accent} />
          <path id={pathId} d="M60 60 m-44 0 a44 44 0 1 1 88 0 a44 44 0 1 1 -88 0" fill="none" />
          <text {...mono} fontSize="9" letterSpacing="1.2" fill={p.paper}><textPath href={`#${pathId}`}>{`${name} · ${name}`}</textPath></text>
          <text x="60" y="66" textAnchor="middle" {...display} fontSize="18" fill={p.paper}>{year}</text>
        </>
      );
      break;
    case 'burst': {
      const pts = Array.from({ length: 24 }, (_, k) => {
        const r = k % 2 ? 44 : 56, a = (Math.PI * 2 * k) / 24;
        return `${(60 + r * Math.cos(a)).toFixed(1)},${(60 + r * Math.sin(a)).toFixed(1)}`;
      }).join(' ');
      body = (
        <>
          <polygon points={pts} fill={p.accent2} />
          <polygon points={pts} {...cut} />
          <text x="60" y="56" textAnchor="middle" {...display} fontSize="16" fill={p.ink}>I WAS</text>
          <text x="60" y="74" textAnchor="middle" {...display} fontSize="16" fill={p.ink}>THERE</text>
        </>
      );
      break;
    }
    case 'ticket': {
      const d = 'M14 34 h92 v14 a12 12 0 0 0 0 24 v14 h-92 v-14 a12 12 0 0 0 0 -24 z';
      body = (
        <>
          <path d={d} fill={p.paper} stroke={p.ink} strokeWidth="3" />
          <path d={d} {...cut} transform="translate(-4 -4) scale(1.066)" />
          <text x="60" y="58" textAnchor="middle" {...mono} fontSize="9" fill={p.accent}>ADMIT ONE</text>
          <text x="60" y="76" textAnchor="middle" {...display} fontSize="13" fill={p.ink}>{(event.name || 'Event').split(/\s+/)[0].slice(0, 12)}</text>
        </>
      );
      break;
    }
    case 'heart':
      body = (
        <>
          <path d="M60 102 C20 76 10 56 10 40 a24 24 0 0 1 50 -6 a24 24 0 0 1 50 6 c0 16 -10 36 -50 62z" fill={p.accent} />
          <path d="M60 102 C20 76 10 56 10 40 a24 24 0 0 1 50 -6 a24 24 0 0 1 50 6 c0 16 -10 36 -50 62z" {...cut} />
          <text x="60" y="58" textAnchor="middle" {...display} fontSize="12" fill={p.paper}>BEST.</text>
          <text x="60" y="74" textAnchor="middle" {...display} fontSize="12" fill={p.paper}>CREW.</text>
        </>
      );
      break;
    case 'mascot':
      body = (
        <>
          <circle cx="60" cy="60" r="56" fill={p.paper} stroke={p.ink} strokeWidth="2" />
          <circle cx="60" cy="60" r="56" {...cut} />
          <g transform="translate(18 8) scale(0.7)"><MascotInline event={event} /></g>
          <rect x="22" y="88" width="76" height="18" rx="9" fill={p.ink} />
          <text x="60" y="100.5" textAnchor="middle" {...display} fontSize="10" fill={p.paper}>
            {(event.mascot.name || 'Hello').slice(0, 12).toUpperCase()}
          </text>
        </>
      );
      break;
  }
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="sticker-svg" viewBox="0 0 120 120" width={size} height={size} role="img" aria-label={`${kind} sticker`}>
      {body}
    </svg>
  );
}

/** The mascot drawn inside the sticker's SVG (a nested <svg> is valid and keeps its own viewBox). */
function MascotInline({ event }: { event: EventKit }) {
  return <Mascot mascot={event.mascot} size={120} accent={PALETTES[event.style].accent} />;
}

interface InviteProps {
  event: EventKit;
  guest: Pick<Guest, 'name'> & Partial<Pick<Guest, 'functionIds'>>;
  cta?: string;
  /** Let the mascot dance when the invite opens. */
  animate?: boolean;
}

/** The personal invite a guest opens from WhatsApp, in the event's invite language. */
export function Invite({ event, guest, cta, animate }: InviteProps) {
  const p = PALETTES[event.style];
  const s = t(event.language);
  const fns = event.functions.length
    ? (guest.functionIds?.length ? event.functions.filter((f) => guest.functionIds!.includes(f.id)) : event.functions)
    : [];
  return (
    <div className="invite" style={vars(event)}>
      <div className="band" />
      {event.logo && <img className="logo" src={event.logo} alt="Event logo" />}
      <div className="hey">{s.hey(firstName(guest.name))}</div>
      <div className="ev">{event.name || 'Your event'}</div>
      <div className="meta">
        {fns.length ? (
          <b>{fns.map((f) => f.name).join(' · ')}</b>
        ) : (
          <b>{prettyDate(event.date)}{event.time ? ` · ${prettyTime(event.time)}` : ''}</b>
        )}
        <span>{event.venue || (fns.length ? '' : 'Venue to be set')}</span>
        {event.hosts.length > 0 && <span className="hosts">{s.hostedBy} {event.hosts.join(' & ')}</span>}
      </div>
      <div className="cta">{cta ?? s.revealCta}</div>
      {event.mascot.enabled && (
        <div className={`peek ${animate ? 'dance' : ''}`} aria-hidden="true"><Mascot mascot={event.mascot} size={92} accent={p.accent} /></div>
      )}
    </div>
  );
}
