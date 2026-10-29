import type { EventKit, Guest } from './types';
import { SUITS, cardFor } from './kit';

export interface Dealt {
  guest: Guest;
  index: number;
}

function dealt(event: EventKit, onlyComing: boolean): Dealt[] {
  return event.guests
    .map((guest, index) => ({ guest, index }))
    .filter(({ guest }) => !onlyComing || guest.rsvp === 'yes');
}

/** "Find your match": everyone holding the same rank forms a group (up to four people). */
export function matchGroups(event: EventKit, onlyComing: boolean) {
  const groups = new Map<string, Dealt[]>();
  for (const d of dealt(event, onlyComing)) {
    const { rank } = cardFor(d.index);
    groups.set(rank, [...(groups.get(rank) ?? []), d]);
  }
  return [...groups].map(([rank, members]) => ({ rank, members }));
}

/** Suits as teams: Spades, Hearts, Diamonds, Clubs. */
export function suitTeams(event: EventKit, onlyComing: boolean) {
  const list = dealt(event, onlyComing);
  return SUITS.map((suit) => ({ suit, members: list.filter((d) => cardFor(d.index).suit === suit) }));
}

/** Split people across tables so each table mixes suits. */
export function tableGroups(event: EventKit, tables: number, onlyComing: boolean) {
  const list = dealt(event, onlyComing);
  const out = Array.from({ length: Math.max(1, tables) }, () => [] as Dealt[]);
  list.forEach((d, i) => out[i % out.length].push(d));
  return out;
}
