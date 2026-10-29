import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEventCtx } from '../components/EventLayout';
import { GuestInvite } from '../components/GuestInvite';
import { PlayingCard } from '../components/KitItems';
import { BottomBar, Segmented } from '../components/ui';
import { Icon } from '../components/Icon';
import { firstName, initials, prettyDate } from '../lib/kit';
import type { Guest } from '../lib/types';

type View = 'message' | 'invite';

export function GuestPreview() {
  const { event, update } = useEventCtx();
  const navigate = useNavigate();
  const state = useLocation().state as { guestId?: string } | null;
  const [guestId, setGuestId] = useState(state?.guestId ?? event.guests[Math.min(2, event.guests.length - 1)]?.id ?? '');
  const [view, setView] = useState<View>(state?.guestId ? 'invite' : 'message');
  const index = Math.max(0, event.guests.findIndex((g) => g.id === guestId));
  const guest = event.guests[index];
  const host = event.guests[0];

  const edit = (patch: Partial<Guest>) =>
    update((e) => ({ ...e, guests: e.guests.map((g) => (g.id === guest?.id ? { ...g, ...patch } : g)) }));

  if (!guest) {
    return (
      <>
        <div className="empty"><p>Add guests first to preview what they see.</p></div>
        <BottomBar><button className="btn" onClick={() => navigate('../guests')}>Go to guests</button></BottomBar>
      </>
    );
  }

  return (
    <>
      <section className="screen-title">
        <h1>What {firstName(guest.name)} sees</h1>
        <p className="lede">Replies here count as {firstName(guest.name)}'s real RSVP.</p>
      </section>

      <div className="hscroll" aria-label="Preview as">
        {event.guests.map((g) => (
          <button key={g.id} aria-pressed={g.id === guest.id} className="btn small ghost"
            style={g.id === guest.id ? { background: 'var(--fg)', color: 'var(--bg)', borderColor: 'var(--fg)' } : undefined}
            onClick={() => setGuestId(g.id)}>
            {firstName(g.name)}
          </button>
        ))}
      </div>

      <Segmented label="Preview" value={view} onChange={setView}
        options={[{ value: 'message', label: 'WhatsApp message' }, { value: 'invite', label: 'Invite page' }]} />

      {view === 'message' ? (
        <div className="guest-screen chat-mode">
          <div className="chat-head">
            <div className="av">{initials(host?.name ?? 'Host')}</div>
            <div>{host?.name ?? 'Host'}<small>online</small></div>
          </div>
          <div className="chat">
            <div className="bubble">Hi {firstName(guest.name)}! Saving you a seat.</div>
            <div className="bubble">
              <div className="linkcard">
                <div className="thumb"><PlayingCard event={event} guest={guest} index={index} small /></div>
                <div className="t"><b>You're invited: {event.name || 'our event'}</b><span>{prettyDate(event.date)} · {event.venue || 'Venue to be set'}</span></div>
              </div>
              Your personal invite is here. Tap to see your card.
              <div className="time">10:42</div>
            </div>
          </div>
          <div className="guest-page" style={{ paddingTop: 0 }}>
            <button className="btn" onClick={() => setView('invite')}>Open invite</button>
          </div>
        </div>
      ) : (
        <div className="guest-screen">
          <GuestInvite key={guest.id} event={event} guest={guest} index={index}
            onRsvp={(rsvp) => edit({ rsvp })} onSticker={(sticker) => edit({ sticker })} />
        </div>
      )}

      <BottomBar>
        <button className="btn ghost" aria-label="Back" onClick={() => navigate('../guests')}><Icon name="back" /></button>
        <button className="btn" onClick={() => navigate('../print')}>Next: print <Icon name="next" /></button>
      </BottomBar>
    </>
  );
}
