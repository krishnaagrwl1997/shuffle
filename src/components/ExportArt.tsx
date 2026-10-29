import type { EventKit, Guest, Mascot as MascotT } from '../lib/types';
import { PALETTES, cardFor, cardLine, initials } from '../lib/kit';
import { Mascot } from './Mascot';

const DISPLAY = 'Bricolage Grotesque, Avenir Next, Segoe UI, sans-serif';
const MONO = 'JetBrains Mono, Menlo, monospace';

/** Break a short line into at most two lines of about `max` characters. */
function twoLines(text: string, max: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [''];
  for (const w of words) {
    const cur = lines[lines.length - 1];
    if ((cur + ' ' + w).trim().length > max && cur && lines.length < 2) lines.push(w);
    else lines[lines.length - 1] = (cur + ' ' + w).trim();
  }
  return lines;
}

/**
 * The playing card as one SVG, for saving as an image.
 * 630 × 880 units = 63 × 88 mm at 10 units per mm.
 */
export function CardArt({ event, guest, index }: { event: EventKit; guest: Guest; index: number }) {
  const p = PALETTES[event.style];
  const f = cardFor(index);
  const suit = f.red ? p.accent : p.ink;
  const line = twoLines(cardLine(guest, index), 22);
  const corner = (x: number, y: number, rot = 0) => (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <text x="0" y="0" textAnchor="middle" fontFamily={MONO} fontWeight="700" fontSize="56" fill={suit}>{f.rank}</text>
      <text x="0" y="58" textAnchor="middle" fontFamily={MONO} fontSize="48" fill={suit}>{f.suit}</text>
    </g>
  );
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 630 880" width="630" height="880">
      <rect x="4" y="4" width="622" height="872" rx="44" fill={p.paper} stroke="#00000022" strokeWidth="4" />
      {corner(66, 92)}
      {corner(564, 788, 180)}
      <circle cx="315" cy="360" r="110" fill={suit} />
      <text x="315" y="396" textAnchor="middle" fontFamily={DISPLAY} fontWeight="800" fontSize="96" fill={p.paper}>{initials(guest.name)}</text>
      <text x="315" y="550" textAnchor="middle" fontFamily={DISPLAY} fontWeight="700" fontSize="54" fill={p.ink}>{guest.name.slice(0, 22)}</text>
      {line.map((l, i) => (
        <text key={i} x="315" y={612 + i * 44} textAnchor="middle" fontFamily={DISPLAY} fontSize="36" fill={p.ink} opacity=".85">{l}</text>
      ))}
      <text x="315" y="800" textAnchor="middle" fontFamily={MONO} fontSize="26" letterSpacing="4" fill={p.ink} opacity=".6">
        {(event.name || '').toUpperCase().slice(0, 30)}
      </text>
    </svg>
  );
}

/** Expressions and captions for the WhatsApp sticker pack. Each one is the event's mascot with a twist. */
export const PACK: { caption: string; patch: Partial<MascotT> }[] = [
  { caption: 'HI!', patch: {} },
  { caption: 'SEE YOU THERE', patch: { eyes: 'wink', mouth: 'grin' } },
  { caption: 'WOW', patch: { eyes: 'dots', mouth: 'open' } },
  { caption: 'PARTY!', patch: { accessory: 'partyhat', eyes: 'happy', mouth: 'grin' } },
  { caption: 'COOL', patch: { accessory: 'shades', mouth: 'smile' } },
  { caption: 'LEGEND', patch: { accessory: 'crown', eyes: 'happy', mouth: 'smile' } },
  { caption: 'ON MY WAY', patch: { accessory: 'headphones', eyes: 'dots', mouth: 'smile' } },
  { caption: 'SO SLEEPY', patch: { eyes: 'sleepy', mouth: 'o' } },
  { caption: 'THANK YOU', patch: { accessory: 'flower', eyes: 'happy', mouth: 'smile' } },
];

/** One WhatsApp sticker: transparent background, white die-cut border, mascot and a caption. */
export function PackSticker({ event, caption, patch }: { event: EventKit; caption: string; patch: Partial<MascotT> }) {
  const p = PALETTES[event.style];
  const m = { ...event.mascot, ...patch };
  const w = Math.max(36, caption.length * 6.4 + 16);
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
      <circle cx="60" cy="56" r="50" fill="#fff" />
      <g transform="translate(14 4) scale(0.77)"><Mascot mascot={m} size={120} accent={p.accent} /></g>
      <rect x={60 - w / 2 - 3} y="88" width={w + 6} height="26" rx="13" fill="#fff" />
      <rect x={60 - w / 2} y="91" width={w} height="20" rx="10" fill={p.ink} />
      <text x="60" y="105" textAnchor="middle" fontFamily={DISPLAY} fontWeight="800" fontSize="10.5" fill={p.paper}>{caption}</text>
    </svg>
  );
}

/** The 96 px tray icon WhatsApp shows for the pack. */
export function TrayIcon({ event }: { event: EventKit }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="96" height="96">
      <Mascot mascot={event.mascot} size={120} accent={PALETTES[event.style].accent} />
    </svg>
  );
}
