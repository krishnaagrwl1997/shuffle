import type { CardFace, EventFunction, EventKit, Guest, Mascot, Rsvp, StickerKind, StyleKey } from './types';

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

export const RANKS = ['A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2'];
export const SUITS: CardFace['suit'][] = ['♠', '♥', '♦', '♣'];
export const SUIT_NAMES: Record<CardFace['suit'], string> = { '♠': 'Spades', '♥': 'Hearts', '♦': 'Diamonds', '♣': 'Clubs' };

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

export function prettyDate(iso: string, opts: Intl.DateTimeFormatOptions = { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' }): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return 'Date to be set';
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-IN', opts);
}

export function prettyTime(hhmm: string): string {
  if (!/^\d{2}:\d{2}$/.test(hhmm)) return '';
  const [h, m] = hhmm.split(':').map(Number);
  return new Date(2000, 0, 1, h, m).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' });
}

export function monogram(name: string): string {
  return name.split(/\s+/).filter((w) => /[A-Za-z]/.test(w)).map((w) => w[0]).join('').slice(0, 2).toUpperCase() || 'S';
}

export const uid = () => Math.random().toString(36).slice(2, 10);

export function newGuest(name: string, note = ''): Guest {
  return {
    id: uid(), name, note, rsvp: null, sticker: null, functionIds: [], fnRsvp: {},
    plusOnes: 0, diet: null, message: '', sentAt: null, remindedAt: null, checkedIn: false,
  };
}

/** Split pasted text into guests. "Name - note" gives the guest their card line. */
export function parseGuests(text: string): Guest[] {
  return text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      const [name, ...rest] = line.split(/\s+[-–—]\s+/);
      return newGuest(name.trim(), rest.join(' - ').trim());
    });
}

/** The functions a guest is invited to (all of them when none are picked). */
export function guestFunctions(event: EventKit, guest: Guest): EventFunction[] {
  if (event.functions.length === 0) return [];
  if (guest.functionIds.length === 0) return event.functions;
  return event.functions.filter((f) => guest.functionIds.includes(f.id));
}

/** Overall reply from per-function replies: coming to anything = yes; declined everything = no. */
export function overallRsvp(event: EventKit, guest: Guest): Rsvp {
  const fns = guestFunctions(event, guest);
  if (fns.length === 0) return guest.rsvp;
  const replies = fns.map((f) => guest.fnRsvp[f.id] ?? null);
  if (replies.some((r) => r === 'yes')) return 'yes';
  if (replies.every((r) => r === 'no')) return 'no';
  return null;
}

/** People coming, counting plus-ones. */
export function headcount(guests: Guest[]): number {
  return guests.filter((g) => g.rsvp === 'yes').reduce((n, g) => n + 1 + g.plusOnes, 0);
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

export function blankEvent(): EventKit {
  return {
    id: uid(), template: 'blank', name: '', date: '', time: '', venue: '', style: 'playful', logo: null,
    mascot: { ...DEFAULT_MASCOT }, functions: [], hosts: [], travel: '', language: 'en',
    allowPlusOnes: false, askDiet: false, thankYou: '', printEnabled: false, guests: [], createdAt: Date.now(),
  };
}

/** Fill in fields added after an event was saved, so older saved events keep working. */
export function normalizeEvent(raw: Partial<EventKit> & { id: string }): EventKit {
  const base = blankEvent();
  const ev = { ...base, ...raw, mascot: { ...base.mascot, ...(raw.mascot ?? {}) } } as EventKit;
  ev.guests = (raw.guests ?? []).map((g) => ({ ...newGuest(g.name ?? ''), ...g, id: g.id ?? uid() }));
  ev.functions = raw.functions ?? [];
  ev.hosts = raw.hosts ?? [];
  return ev;
}

export function sampleEvent(): EventKit {
  const guests = parseGuests(`Ananya Rao - planned everything
Rohan Mehta - playlist king
Priya Nair - always the first one there
Kabir Singh - the photographer
Meera Iyer - snack supplier
Arjun Das - first on the dance floor
Sana Khan - knows every shortcut
Vikram Joshi - never misses standup`);
  // A realistic mid-campaign state, so Track has numbers to show.
  const seed: [Rsvp, StickerKind | null, number, Guest['diet'], boolean][] = [
    ['yes', 'mascot', 0, 'veg', true], ['yes', 'burst', 1, 'nonveg', true], [null, null, 0, null, true], ['yes', 'ticket', 0, 'jain', true],
    ['yes', 'heart', 1, 'veg', true], ['no', null, 0, null, true], ['yes', 'mascot', 0, 'vegan', true], [null, null, 0, null, false],
  ];
  guests.forEach((g, i) => {
    const [rsvp, sticker, plus, diet, sent] = seed[i];
    Object.assign(g, { rsvp, sticker, plusOnes: plus, diet, sentAt: sent ? Date.now() - 86_400_000 * 3 : null });
  });
  guests[1].message = 'Can I bring my partner?';
  return {
    ...blankEvent(),
    id: 'sample',
    template: 'offsite',
    name: 'Northwind Offsite 2026',
    date: '2026-12-12',
    time: '10:00',
    venue: 'Anjuna, Goa',
    hosts: ['Ananya Rao'],
    travel: 'Shuttle from Goa airport (GOI) at 8:00 am. Rooms at Anjuna Beach Resort are booked for everyone.',
    allowPlusOnes: true,
    askDiet: true,
    guests,
  };
}
