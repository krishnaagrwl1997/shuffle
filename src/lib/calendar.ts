import type { EventFunction, EventKit } from './types';

interface Slot {
  title: string;
  date: string;
  time: string;
  venue: string;
}

/** The dated parts of an event: each function, or the event itself. */
export function eventSlots(event: EventKit, fns: EventFunction[]): Slot[] {
  const title = event.name || 'Event';
  if (fns.length) {
    return fns.map((f) => ({ title: `${f.name} · ${title}`, date: f.date || event.date, time: f.time || event.time, venue: f.venue || event.venue }));
  }
  return [{ title, date: event.date, time: event.time, venue: event.venue }];
}

const stamp = (date: string, time: string, addHours = 0) => {
  const [y, m, d] = date.split('-').map(Number);
  const [hh, mm] = (time || '10:00').split(':').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d, hh + addHours, mm));
  return dt.toISOString().replace(/[-:]/g, '').slice(0, 15); // local wall time, used with ctz
};

/** A Google Calendar "add event" link. Times are read as India time. */
export function googleCalendarUrl(slot: Slot, details: string): string | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(slot.date)) return null;
  const p = new URLSearchParams({
    action: 'TEMPLATE',
    text: slot.title,
    dates: `${stamp(slot.date, slot.time)}/${stamp(slot.date, slot.time, 3)}`,
    ctz: 'Asia/Kolkata',
    location: slot.venue,
    details,
  });
  return `https://calendar.google.com/calendar/render?${p.toString()}`;
}

/** An .ics file for Apple Calendar and Outlook. */
export function icsFile(slots: Slot[], details: string): string {
  const esc = (s: string) => s.replace(/[\\,;]/g, (c) => `\\${c}`).replace(/\n/g, '\\n');
  const events = slots
    .filter((s) => /^\d{4}-\d{2}-\d{2}$/.test(s.date))
    .map((s, i) => [
      'BEGIN:VEVENT',
      `UID:${Date.now()}-${i}@shuffle`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').slice(0, 15)}Z`,
      `DTSTART;TZID=Asia/Kolkata:${stamp(s.date, s.time)}`,
      `DTEND;TZID=Asia/Kolkata:${stamp(s.date, s.time, 3)}`,
      `SUMMARY:${esc(s.title)}`,
      `LOCATION:${esc(s.venue)}`,
      `DESCRIPTION:${esc(details)}`,
      'END:VEVENT',
    ].join('\r\n'));
  return ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Shuffle//EN', ...events, 'END:VCALENDAR'].join('\r\n');
}
