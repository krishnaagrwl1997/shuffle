import type { EventKit, Guest } from './types';
import { firstName, prettyDate } from './kit';

export function inviteLink(event: EventKit, guest: Guest): string {
  const base = `${window.location.origin}${window.location.pathname}`;
  return `${base}#/invite/${encodeURIComponent(event.id)}/${encodeURIComponent(guest.id)}`;
}

/** The WhatsApp message an organiser sends; the link preview carries the design. */
export function inviteMessage(event: EventKit, guest: Guest): string {
  return `Hi ${firstName(guest.name)}! You're invited to ${event.name || 'our event'} on ${prettyDate(event.date)} at ${event.venue || 'the venue'}. Open your personal invite to see your card: ${inviteLink(event, guest)}`;
}

export function whatsappUrl(event: EventKit, guest: Guest): string {
  return `https://wa.me/?text=${encodeURIComponent(inviteMessage(event, guest))}`;
}

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
