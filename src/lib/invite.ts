import type { EventKit, Guest } from './types';
import { firstName, guestFunctions, prettyDate } from './kit';

export function inviteLink(event: EventKit, guest: Guest): string {
  const base = `${window.location.origin}${window.location.pathname}`;
  return `${base}#/invite/${encodeURIComponent(event.id)}/${encodeURIComponent(guest.id)}`;
}

export function memoriesLink(event: EventKit): string {
  return `${window.location.origin}${window.location.pathname}#/memories/${encodeURIComponent(event.id)}`;
}

function when(event: EventKit, guest: Guest): string {
  const fns = guestFunctions(event, guest);
  if (fns.length) return `for ${fns.map((f) => f.name).join(', ')}`;
  return `on ${prettyDate(event.date)}${event.venue ? ` at ${event.venue}` : ''}`;
}

/** The WhatsApp message an organiser sends; the link preview carries the design. */
export function inviteMessage(event: EventKit, guest: Guest): string {
  return `Hi ${firstName(guest.name)}! You're invited to ${event.name || 'our event'} ${when(event, guest)}. Open your personal invite to see your card and RSVP: ${inviteLink(event, guest)}`;
}

export function reminderMessage(event: EventKit, guest: Guest): string {
  return `Hi ${firstName(guest.name)}, just checking if you can make it to ${event.name || 'our event'} ${when(event, guest)}. Your card is waiting, tap to reply: ${inviteLink(event, guest)}`;
}

export function memoriesMessage(event: EventKit): string {
  return `Thank you for coming to ${event.name || 'our event'}! Here are the memories: ${memoriesLink(event)}`;
}

/** wa.me with no number lets the sender pick the contact in WhatsApp. */
export function whatsappUrl(text: string): string {
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
