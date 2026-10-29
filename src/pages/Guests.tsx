import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useEventCtx } from '../components/EventLayout';
import { PlayingCard, Sticker } from '../components/KitItems';
import { cardFor, parseGuests } from '../lib/kit';
import { copyText, inviteMessage, whatsappUrl } from '../lib/invite';
import type { Guest } from '../lib/types';

const MAX_GUESTS = 52;

function RsvpPill({ rsvp }: { rsvp: Guest['rsvp'] }) {
  if (rsvp === 'yes') return <span className="pill yes">Coming</span>;
  if (rsvp === 'no') return <span className="pill no">Can't make it</span>;
  return <span className="pill wait">Waiting</span>;
}

export function Guests() {
  const { event, update } = useEventCtx();
  const [paste, setPaste] = useState('');
  const [flash, setFlash] = useState('');
  const room = MAX_GUESTS - event.guests.length;

  const add = () => {
    const incoming = parseGuests(paste);
    if (incoming.length === 0) return;
    const accepted = incoming.slice(0, room);
    update((e) => ({ ...e, guests: [...e.guests, ...accepted] }));
    setPaste('');
    setFlash(accepted.length < incoming.length
      ? `Added ${accepted.length}. A deck holds ${MAX_GUESTS} cards, so ${incoming.length - accepted.length} were left out.`
      : `Added ${accepted.length} guest${accepted.length === 1 ? '' : 's'}.`);
  };

  const edit = (id: string, patch: Partial<Guest>) =>
    update((e) => ({ ...e, guests: e.guests.map((g) => (g.id === id ? { ...g, ...patch } : g)) }));
  const remove = (id: string) => update((e) => ({ ...e, guests: e.guests.filter((g) => g.id !== id) }));

  const copy = async (g: Guest) => {
    const ok = await copyText(inviteMessage(event, g));
    setFlash(ok ? `Copied ${g.name.split(' ')[0]}'s invite message.` : 'Copying is blocked here. Use the WhatsApp button instead.');
  };

  const shown = event.guests.slice(0, 9);

  return (
    <div className="studio">
      <section className="panel">
        <div>
          <h1>Who's coming?</h1>
          <p className="lede">Paste names from WhatsApp or a spreadsheet, one per line. Add a dash and a short note to give each person their card's line.</p>
        </div>
        <div className="field">
          <label htmlFor="g-paste">Add guests</label>
          <textarea id="g-paste" value={paste} placeholder={'Ananya Rao - planned everything\nRohan Mehta - playlist king'} onChange={(e) => setPaste(e.target.value)} />
        </div>
        <div className="btn-row">
          <button className="btn" onClick={add} disabled={!paste.trim() || room <= 0}>Add to the deck</button>
        </div>
        <p className="hint" aria-live="polite">{flash || (room > 0 ? `Cards are dealt in list order: the first guest gets the Ace of Spades. ${room} cards left in the deck.` : 'The deck is full at 52 cards.')}</p>
        <div className="btn-row">
          <Link className="btn" to="../preview">Next: see what guests get</Link>
          <Link className="btn ghost" to="../mascot">Back</Link>
        </div>
      </section>

      <section className="table">
        <div className="table-head">
          <h2>The event deck</h2>
          <span className="spec">{event.guests.length} of {MAX_GUESTS} cards · one per guest</span>
        </div>
        {event.guests.length === 0 ? (
          <div className="empty">No guests yet. Paste a list on the left and each person gets their own card.</div>
        ) : (
          <>
            <div className="deck-fan">
              {shown.map((g, k) => {
                const mid = (shown.length - 1) / 2;
                return (
                  <div key={g.id} className="fan-card" style={{ transform: `rotate(${(k - mid) * 5}deg) translateY(${Math.abs(k - mid) * 3}px)` }}>
                    <PlayingCard event={event} guest={g} index={k} small />
                  </div>
                );
              })}
            </div>
            <div className="guest-table">
              <table>
                <thead>
                  <tr><th>Card</th><th>Guest</th><th>Card line</th><th>Sticker</th><th>RSVP</th><th>Invite</th><th><span className="sr-only">Remove</span></th></tr>
                </thead>
                <tbody>
                  {event.guests.map((g, i) => {
                    const f = cardFor(i);
                    return (
                      <tr key={g.id}>
                        <td className={`rank ${f.red ? 'red' : ''}`}>{f.rank}{f.suit}</td>
                        <td><input aria-label="Guest name" value={g.name} onChange={(e) => edit(g.id, { name: e.target.value })} /></td>
                        <td><input aria-label="Card line" value={g.note} placeholder="Line on their card" onChange={(e) => edit(g.id, { note: e.target.value })} /></td>
                        <td>{g.sticker ? <Sticker event={event} kind={g.sticker} size={34} /> : <span className="hint">Not picked</span>}</td>
                        <td><RsvpPill rsvp={g.rsvp} /></td>
                        <td style={{ whiteSpace: 'nowrap' }}>
                          <a className="icon-btn" href={whatsappUrl(event, g)} target="_blank" rel="noreferrer">WhatsApp</a>
                          <button className="icon-btn" onClick={() => copy(g)}>Copy</button>
                        </td>
                        <td><button className="icon-btn" aria-label={`Remove ${g.name}`} onClick={() => remove(g.id)}>Remove</button></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="hint">In this version, invite links open on this device only. Shareable links arrive with accounts in the next version.</p>
          </>
        )}
      </section>
    </div>
  );
}
