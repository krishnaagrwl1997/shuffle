import type { CardFace, EventKit, Guest, Mascot, StickerKind, StyleKey } from './types';

export interface Palette {
  name: string;
  paper: string;
  ink: string;
  accent: string;
  accent2: string;
}

/** Print palettes. These are product colours, so they stay the same in light and dark mode. */
export const PALETTES: Record<StyleKey, Palette> = {
  playful: { name: 'Playful', paper: '#FFF7E8', ink: '#2B2350', accent: '#FF5A5F', accent2: '#FFB703' },
  elegant: { name: 'Elegant', paper: '#F7F4EE', ink: '#1C2430', accent: '#B08A3E', accent2: '#D9C9A3' },
  festive: { name: 'Desi festive', paper: '#FFF1E0', ink: '#6B0F1A', accent: '#E07A00', accent2: '#0F6B5C' },
  minimal: { name: 'Minimal', paper: '#FFFFFF', ink: '#111111', accent: '#111111', accent2: '#9A9A9A' },
};

const RANKS = ['A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2'];
const SUITS: CardFace['suit'][] = ['♠', '♥', '♦', '♣'];

/** Guests are dealt in list order: A♠ A♥ A♦ A♣ K♠ … so the first person gets the Ace of Spades. */
export function cardFor(index: number): CardFace {
  const suit = SUITS[index % 4];
  return { rank: RANKS[Math.floor(index / 4) % 13], suit, red: suit === '♥' || suit === '♦' };
}

const DEFAULT_LINES = [
  'The one who planned everything',
  'The one who keeps us laughing',
  'First to arrive',
  'Always has a charger',
  'Brings the snacks',
  'Owns the dance floor',
  'Knows every shortcut',
  'Never misses a meeting',
];

export function cardLine(guest: Guest, index: number): string {
  const note = guest.note.trim();
  return note ? note.charAt(0).toUpperCase() + note.slice(1) : DEFAULT_LINES[index % DEFAULT_LINES.length];
}

export function initials(name: string): string {
  return name.trim().split(/\s+/).map((w) => w[0] ?? '').join('').slice(0, 2).toUpperCase() || '?';
}

export function firstName(name: string): string {
  return name.trim().split(/\s+/)[0] || 'there';
}

export function prettyDate(iso: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return 'Date to be set';
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' });
}

export function monogram(name: string): string {
  return name.split(/\s+/).filter((w) => /[A-Za-z]/.test(w)).map((w) => w[0]).join('').slice(0, 2).toUpperCase() || 'S';
}

export const uid = () => Math.random().toString(36).slice(2, 10);

/** Split pasted text into guests. "Name - note" gives the guest their card line. Up to 52 cards in a deck. */
export function parseGuests(text: string): Guest[] {
  return text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      const [name, ...rest] = line.split(/\s+[-–—]\s+/);
      return { id: uid(), name: name.trim(), note: rest.join(' - ').trim(), rsvp: null, sticker: null };
    });
}

export const STICKER_KINDS: StickerKind[] = ['badge', 'burst', 'ticket', 'heart'];

export const DEFAULT_MASCOT: Mascot = {
  enabled: true,
  name: 'Pip',
  body: 'blob',
  color: '#FF8A5B',
  eyes: 'happy',
  mouth: 'grin',
  accessory: 'partyhat',
  cheeks: true,
};

export function sampleEvent(): EventKit {
  const guests = parseGuests(`Ananya Rao - planned everything
Rohan Mehta - playlist king
Priya Nair - always the first one there
Kabir Singh - the photographer
Meera Iyer - snack supplier
Arjun Das - first on the dance floor
Sana Khan - knows every shortcut
Vikram Joshi - never misses standup`);
  // A realistic mid-campaign state, so the print screen has numbers to show.
  const replies: [Guest['rsvp'], StickerKind | null][] = [
    ['yes', 'mascot'], ['yes', 'burst'], [null, null], ['yes', 'ticket'],
    ['yes', 'heart'], ['no', null], ['yes', 'mascot'], [null, null],
  ];
  guests.forEach((g, i) => { [g.rsvp, g.sticker] = replies[i]; });
  return {
    id: 'sample',
    name: 'Northwind Offsite 2026',
    date: '2026-12-12',
    venue: 'Anjuna, Goa',
    style: 'playful',
    logo: null,
    mascot: { ...DEFAULT_MASCOT },
    guests,
    createdAt: Date.now(),
  };
}

export function blankEvent(): EventKit {
  return {
    id: uid(),
    name: '',
    date: '',
    venue: '',
    style: 'playful',
    logo: null,
    mascot: { ...DEFAULT_MASCOT },
    guests: [],
    createdAt: Date.now(),
  };
}
