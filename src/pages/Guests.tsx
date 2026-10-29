import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEventCtx } from '../components/EventLayout';
import { PlayingCard } from '../components/KitItems';
import { BottomBar, Sheet, Toast, useToast } from '../components/ui';
import { Icon } from '../components/Icon';
import { cardFor, cardLine, guestFunctions, overallRsvp, parseGuests } from '../lib/kit';
import { t } from '../lib/i18n';
import type { Guest } from '../lib/types';

export const MAX_GUESTS = 52;

export function RsvpPill({ rsvp }: { rsvp: Guest['rsvp'] }) {
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
  const en = t('en');

  const room = MAX_GUESTS - event.guests.length;
  const editingIndex = event.guests.findIndex((g) => g.id === editingId);
  const editing = event.guests[editingIndex];

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
    update((e) => ({
      ...e,
      guests: e.guests.map((g) => {
        if (g.id !== id) return g;
        const next = { ...g, ...patch };
        return e.functions.length ? { ...next, rsvp: overallRsvp(e, next) } : next;
      }),
    }));

  const toggleFn = (g: Guest, fnId: string) => {
    const current = g.functionIds.length ? g.functionIds : event.functions.map((f) => f.id);
    const next = current.includes(fnId) ? current.filter((x) => x !== fnId) : [...current, fnId];
    if (next.length === 0) return; // invited to at least one
    edit(g.id, { functionIds: next.length === event.functions.length ? [] : next });
  };

  const remove = (id: string) => {
    update((e) => ({ ...e, guests: e.guests.filter((g) => g.id !== id) }));
    setConfirmRemove(false);
    setEditingId(null);
    showToast('Guest removed');
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

          <div className="group-head">
            <h2 className="group-title">{event.guests.length} of {MAX_GUESTS} cards</h2>
            <button className="btn ghost small" onClick={() => setAdding(true)} disabled={room <= 0}><Icon name="plus" size={18} /> Add</button>
          </div>

          <div className="list">
            {event.guests.map((g, i) => {
              const f = cardFor(i);
              const fns = guestFunctions(event, g);
              return (
                <button key={g.id} className="list-row" onClick={() => setEditingId(g.id)}>
                  <span className={`rank-chip ${f.red ? 'red' : ''}`}><span>{f.rank}</span><span>{f.suit}</span></span>
                  <span className="main">
                    <span className="t1" style={{ display: 'block' }}>{g.name}{g.plusOnes ? ` +${g.plusOnes}` : ''}</span>
                    <span className="t2" style={{ display: 'block' }}>
                      {event.functions.length && fns.length < event.functions.length ? fns.map((x) => x.name).join(', ') : cardLine(g, i)}
                    </span>
                  </span>
                  <RsvpPill rsvp={g.rsvp} />
                </button>
              );
            })}
          </div>
          <p className="hint">Tap a guest to edit their card{event.functions.length ? ' or choose which functions they’re invited to' : ''}.</p>
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

            {event.functions.length > 0 && (
              <div className="field">
                <span className="label">Invited to</span>
                <div className="diet-chips app-chips">
                  {event.functions.map((f) => {
                    const on = editing.functionIds.length === 0 || editing.functionIds.includes(f.id);
                    const r = editing.fnRsvp[f.id];
                    return (
                      <button key={f.id} aria-pressed={on} onClick={() => toggleFn(editing, f.id)}>
                        {on && <Icon name="check" size={14} />} {f.name}{on && r ? ` · ${r === 'yes' ? 'coming' : 'no'}` : ''}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {(editing.rsvp || editing.message) && (
              <div className="reply-box">
                <div className="reply-row"><span>Reply</span><RsvpPill rsvp={editing.rsvp} /></div>
                {editing.plusOnes > 0 && <div className="reply-row"><span>Bringing</span><b>{editing.plusOnes} more</b></div>}
                {editing.diet && <div className="reply-row"><span>Food</span><b>{en.diets[editing.diet]}</b></div>}
                {editing.message && <p className="reply-msg">“{editing.message}”</p>}
              </div>
            )}

            <button className="btn ghost block" onClick={() => navigate('../send', { state: { guestId: editing.id } })}><Icon name="eye" size={18} /> See their invite</button>
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
        <button className="btn ghost" aria-label="Back" onClick={() => navigate('../look')}><Icon name="back" /></button>
        <button className="btn" onClick={() => navigate('../send')} disabled={event.guests.length === 0}>Next: send invites <Icon name="next" /></button>
      </BottomBar>
    </>
  );
}
