import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useEventCtx } from '../components/EventLayout';
import { GuestInvite } from '../components/GuestInvite';
import { PlayingCard } from '../components/KitItems';
import { initials, prettyDate } from '../lib/kit';
import { inviteLink } from '../lib/invite';
import type { Guest } from '../lib/types';
import { EMBEDDED } from '../lib/env';

export function GuestPreview() {
  const { event, update } = useEventCtx();
  const [guestId, setGuestId] = useState(event.guests[Math.min(2, event.guests.length - 1)]?.id ?? '');
  const [opened, setOpened] = useState(false);
  const index = Math.max(0, event.guests.findIndex((g) => g.id === guestId));
  const guest = event.guests[index];
  const host = event.guests[0];

  const edit = (patch: Partial<Guest>) =>
    update((e) => ({ ...e, guests: e.guests.map((g) => (g.id === guest?.id ? { ...g, ...patch } : g)) }));

  return (
    <div className="studio">
      <section className="panel">
        <div>
          <h1>What a guest sees</h1>
          <p className="lede">Each guest gets their own WhatsApp link. Opening it reveals their card, lets them pick a sticker and RSVP.</p>
        </div>
        {event.guests.length === 0 ? (
          <div className="empty">Add guests first to preview their invite.</div>
        ) : (
          <>
            <div className="field">
              <label htmlFor="pv-guest">Preview as</label>
              <select id="pv-guest" value={guest?.id} onChange={(e) => { setGuestId(e.target.value); setOpened(false); }}>
                {event.guests.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
              </select>
            </div>
            <p className="hint">Replies you make here count as that guest's real RSVP, so the print order updates too.</p>
            {guest && !EMBEDDED && <a className="btn ghost" href={inviteLink(event, guest)} target="_blank" rel="noreferrer">Open the full-screen invite</a>}
          </>
        )}
        <div className="btn-row">
          <Link className="btn" to="../print">Next: print</Link>
          <Link className="btn ghost" to="../guests">Back</Link>
        </div>
      </section>

      <section className="table">
        <div className="phone-wrap">
          <div className="phone">
            <div className="screen">
              {!guest ? (
                <div className="guest-screen"><div className="guest-page"><p>No guests yet.</p></div></div>
              ) : !opened ? (
                <div className="guest-screen chat-mode">
                  <div className="chat-head">
                    <div className="av">{initials(host?.name ?? 'Host')}</div>
                    <div>{host?.name ?? 'Host'}<small>online</small></div>
                  </div>
                  <div className="chat">
                    <div className="bubble">Hi {guest.name.split(' ')[0]}! Saving you a seat.</div>
                    <div className="bubble">
                      <div className="linkcard">
                        <div className="thumb" style={{ background: 'var(--sunk)' }}><PlayingCard event={event} guest={guest} index={index} small /></div>
                        <div className="t"><b>You're invited: {event.name || 'our event'}</b><span>{prettyDate(event.date)} · {event.venue || 'Venue to be set'}</span></div>
                      </div>
                      Your personal invite is here. Tap to see your card.
                      <div className="time">10:42</div>
                    </div>
                  </div>
                  <div className="guest-page" style={{ flex: 'none', paddingTop: 0 }}>
                    <button className="btn" onClick={() => setOpened(true)}>Open invite</button>
                  </div>
                </div>
              ) : (
                <div className="guest-screen">
                  <GuestInvite key={guest.id} event={event} guest={guest} index={index}
                    onRsvp={(rsvp) => edit({ rsvp })} onSticker={(sticker) => edit({ sticker })} />
                  <div className="guest-page" style={{ paddingTop: 0, flex: 'none' }}>
                    <button className="btn ghost" onClick={() => setOpened(false)}>Back to chat</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
