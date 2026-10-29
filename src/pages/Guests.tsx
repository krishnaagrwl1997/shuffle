import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEventCtx } from '../components/EventLayout';
import { PlayingCard } from '../components/KitItems';
import { BottomBar, Sheet, Toast, useToast } from '../components/ui';
import { Icon } from '../components/Icon';
import { cardFor, cardLine, parseGuests } from '../lib/kit';
import { copyText, inviteMessage, whatsappUrl } from '../lib/invite';
import type { Guest } from '../lib/types';

const MAX_GUESTS = 52;

function RsvpPill({ rsvp }: { rsvp: Guest['rsvp'] }) {
  if (rsvp === 'yes') return <span className="pill yes">Coming</span>;
  if (rsvp === 'no') return <span className="pill no">No</span>;
  return <span className="pill wait">Waiting</span>;
}

export function Guests() {
  const { event, update } = useEventCtx();
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);
  const [paste, setPaste] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmRemove, setConfirmRemove] = useState(false);
  const [toast, showToast] = useToast();

  const room = MAX_GUESTS - event.guests.length;
  const editingIndex = event.guests.findIndex((g) => g.id === editingId);
  const editing = event.guests[editingIndex];
  const yes = event.guests.filter((g) => g.rsvp === 'yes').length;
  const no = event.guests.filter((g) => g.rsvp === 'no').length;

  const add = () => {
    const incoming = parseGuests(paste);
    if (incoming.length === 0) return;
    const accepted = incoming.slice(0, room);
    update((e) => ({ ...e, guests: [...e.guests, ...accepted] }));
    setPaste('');
    setAdding(false);
    showToast(accepted.length < incoming.length
      ? `Added ${accepted.length}. The deck is full at ${MAX_GUESTS}.`
      : `Added ${accepted.length} guest${accepted.length === 1 ? '' : 's'}`);
  };

  const edit = (id: string, patch: Partial<Guest>) =>
    update((e) => ({ ...e, guests: e.guests.map((g) => (g.id === id ? { ...g, ...patch } : g)) }));

  const remove = (id: string) => {
    update((e) => ({ ...e, guests: e.guests.filter((g) => g.id !== id) }));
    setConfirmRemove(false);
    setEditingId(null);
    showToast('Guest removed');
  };

  const copy = async (g: Guest) => {
    const ok = await copyText(inviteMessage(event, g));
    showToast(ok ? 'Invite message copied' : "Couldn't copy here. Use WhatsApp instead.");
  };

  const closeEdit = () => { setEditingId(null); setConfirmRemove(false); };
  const shown = event.guests.slice(0, 7);

  return (
    <>
      {event.guests.length === 0 ? (
        <div className="empty">
          <Icon name="plus" size={28} />
          <p>No guests yet. Paste a list and each person gets their own card in the deck.</p>
          <button className="btn" onClick={() => setAdding(true)}>Add guests</button>
        </div>
      ) : (
        <>
          <div className="deck-fan" aria-hidden="true">
            {shown.map((g, k) => {
              const mid = (shown.length - 1) / 2;
              return (
                <div key={g.id} className="fan-card" style={{ transform: `rotate(${(k - mid) * 6}deg) translateY(${Math.abs(k - mid) * 4}px)`, zIndex: k }}>
                  <PlayingCard event={event} guest={g} index={k} small />
                </div>
              );
            })}
          </div>

          <div className="stats">
            <div className="stat yes"><div className="big">{yes}</div><div className="small">Coming</div></div>
            <div className="stat"><div className="big">{event.guests.length - yes - no}</div><div className="small">Waiting</div></div>
            <div className="stat"><div className="big">{no}</div><div className="small">Can't come</div></div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 className="group-title">{event.guests.length} of {MAX_GUESTS} cards</h2>
            <button className="btn ghost small" onClick={() => setAdding(true)} disabled={room <= 0}><Icon name="plus" size={18} /> Add</button>
          </div>

          <div className="list">
            {event.guests.map((g, i) => {
              const f = cardFor(i);
              return (
                <button key={g.id} className="list-row" onClick={() => setEditingId(g.id)}>
                  <span className={`rank-chip ${f.red ? 'red' : ''}`}><span>{f.rank}</span><span>{f.suit}</span></span>
                  <span className="main">
                    <span className="t1" style={{ display: 'block' }}>{g.name}</span>
                    <span className="t2" style={{ display: 'block' }}>{cardLine(g, i)}</span>
                  </span>
                  <RsvpPill rsvp={g.rsvp} />
                </button>
              );
            })}
          </div>
          <p className="hint">Tap a guest to edit their card or send their invite. Invite links open on this device until accounts arrive.</p>
        </>
      )}

      <Sheet open={adding} title="Add guests" onClose={() => setAdding(false)}>
        <div className="field">
          <label htmlFor="g-paste">One guest per line. Add a dash and a note for their card.</label>
          <textarea id="g-paste" value={paste} placeholder={'Ananya Rao - planned everything\nRohan Mehta - playlist king'} onChange={(e) => setPaste(e.target.value)} />
        </div>
        <p className="hint">Paste straight from WhatsApp or a spreadsheet. {room} cards left in the deck.</p>
        <button className="btn block" onClick={add} disabled={!paste.trim()}>Add to the deck</button>
      </Sheet>

      <Sheet open={!!editing} title={editing ? `${cardFor(editingIndex).rank}${cardFor(editingIndex).suit} · ${editing.name || 'Guest'}` : ''} onClose={closeEdit}>
        {editing && (
          <>
            <div style={{ display: 'flex', justifyContent: 'center' }}><PlayingCard event={event} guest={editing} index={editingIndex} /></div>
            <div className="field">
              <label htmlFor="e-name">Name</label>
              <input id="e-name" value={editing.name} onChange={(e) => edit(editing.id, { name: e.target.value })} />
            </div>
            <div className="field">
              <label htmlFor="e-line">Line on their card</label>
              <input id="e-line" value={editing.note} placeholder={cardLine({ ...editing, note: '' }, editingIndex)} maxLength={40} onChange={(e) => edit(editing.id, { note: e.target.value })} />
            </div>
            <a className="btn block" href={whatsappUrl(event, editing)} target="_blank" rel="noreferrer"><Icon name="share" /> Send invite on WhatsApp</a>
            <div className="action-grid">
              <button className="btn ghost" onClick={() => copy(editing)}><Icon name="copy" size={18} /> Copy</button>
              <button className="btn ghost" onClick={() => navigate('../preview', { state: { guestId: editing.id } })}><Icon name="eye" size={18} /> Preview</button>
            </div>
            {confirmRemove ? (
              <div className="action-grid">
                <button className="btn danger" onClick={() => remove(editing.id)}>Remove</button>
                <button className="btn ghost" onClick={() => setConfirmRemove(false)}>Keep</button>
              </div>
            ) : (
              <button className="btn danger block" onClick={() => setConfirmRemove(true)}><Icon name="trash" size={18} /> Remove from deck</button>
            )}
          </>
        )}
      </Sheet>

      <Toast text={toast} />
      <BottomBar>
        <button className="btn ghost" aria-label="Back" onClick={() => navigate('../mascot')}><Icon name="back" /></button>
        <button className="btn" onClick={() => navigate('../preview')} disabled={event.guests.length === 0}>Next: guest view <Icon name="next" /></button>
      </BottomBar>
    </>
  );
}
