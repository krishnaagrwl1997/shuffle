import { useParams } from 'react-router-dom';
import { GuestInvite } from '../components/GuestInvite';
import { useStore } from '../lib/store';
import type { Guest } from '../lib/types';

/** The page a guest lands on from their WhatsApp link. No app chrome: just their invite. */
export function GuestInvitePage() {
  const { id, guestId } = useParams();
  const { getEvent, updateEvent } = useStore();
  const event = getEvent(id);
  const index = event ? event.guests.findIndex((g) => g.id === guestId) : -1;
  const guest = event?.guests[index];

  if (!event || !guest) {
    return (
      <div className="guest-screen standalone">
        <div className="guest-page">
          <h3>This invite isn't available here</h3>
          <p>In this version of Shuffle, invites open on the organiser's device only. Ask the organiser to send it again once shareable links are live.</p>
        </div>
      </div>
    );
  }

  const edit = (patch: Partial<Guest>) =>
    updateEvent(event.id, (e) => ({ ...e, guests: e.guests.map((g) => (g.id === guest.id ? { ...g, ...patch } : g)) }));

  return (
    <div className="guest-screen standalone">
      <GuestInvite event={event} guest={guest} index={index} onRsvp={(rsvp) => edit({ rsvp })} onSticker={(sticker) => edit({ sticker })} />
    </div>
  );
}
