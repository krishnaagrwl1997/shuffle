import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useEventCtx } from '../components/EventLayout';
import { CardBack, Invite, PlayingCard, Sticker } from '../components/KitItems';
import { PALETTES } from '../lib/kit';
import { useStore } from '../lib/store';
import type { Guest, StyleKey } from '../lib/types';

const PREVIEW_GUEST: Guest = { id: 'preview', name: 'Priya Nair', note: 'Always the first one there', rsvp: null, sticker: null };

export function Setup() {
  const { event, update } = useEventCtx();
  const { deleteEvent } = useStore();
  const navigate = useNavigate();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [logoError, setLogoError] = useState('');
  const previewIndex = Math.min(2, Math.max(0, event.guests.length - 1));
  const guest = event.guests[previewIndex] ?? PREVIEW_GUEST;

  const onLogo = (file: File | undefined) => {
    if (!file) return;
    if (file.size > 1_500_000) {
      setLogoError('That image is over 1.5 MB. Try a smaller PNG or SVG.');
      return;
    }
    setLogoError('');
    const reader = new FileReader();
    reader.onload = () => update((e) => ({ ...e, logo: String(reader.result) }));
    reader.readAsDataURL(file);
  };

  return (
    <div className="studio">
      <section className="panel">
        <div>
          <h1>Tell us about the event</h1>
          <p className="lede">Three details and a style. Everything on the right updates as you type.</p>
        </div>
        <div className="field">
          <label htmlFor="ev-name">Event name</label>
          <input id="ev-name" value={event.name} maxLength={40} placeholder="Northwind Offsite 2026"
            onChange={(e) => update((ev) => ({ ...ev, name: e.target.value }))} />
        </div>
        <div className="row2">
          <div className="field">
            <label htmlFor="ev-date">Date</label>
            <input id="ev-date" type="date" value={event.date} onChange={(e) => update((ev) => ({ ...ev, date: e.target.value }))} />
          </div>
          <div className="field">
            <label htmlFor="ev-venue">Venue</label>
            <input id="ev-venue" value={event.venue} maxLength={30} placeholder="Anjuna, Goa"
              onChange={(e) => update((ev) => ({ ...ev, venue: e.target.value }))} />
          </div>
        </div>
        <div className="field">
          <span className="label">Style</span>
          <div className="styles">
            {(Object.keys(PALETTES) as StyleKey[]).map((k) => {
              const p = PALETTES[k];
              return (
                <button key={k} className="style-opt" aria-pressed={event.style === k} onClick={() => update((ev) => ({ ...ev, style: k }))}>
                  <span className="swatches">
                    {[p.paper, p.ink, p.accent, p.accent2].map((c) => <span key={c} style={{ background: c }} />)}
                  </span>
                  <b>{p.name}</b>
                </button>
              );
            })}
          </div>
        </div>
        <div className="field">
          <label htmlFor="ev-logo">Logo (optional)</label>
          <input id="ev-logo" type="file" accept="image/*" onChange={(e) => onLogo(e.target.files?.[0])} />
          {logoError && <p className="hint" style={{ color: 'var(--bad)' }}>{logoError}</p>}
          {event.logo && (
            <button className="btn ghost small" style={{ alignSelf: 'flex-start' }} onClick={() => update((ev) => ({ ...ev, logo: null }))}>Remove logo</button>
          )}
        </div>
        <div className="btn-row">
          <Link className="btn" to="../mascot">Next: make a mascot</Link>
        </div>
        <div style={{ borderTop: '1px solid var(--line)', paddingTop: 16 }}>
          {confirmDelete ? (
            <div className="btn-row" style={{ alignItems: 'center' }}>
              <span className="hint">Delete this event and its guest list?</span>
              <button className="btn danger small" onClick={() => { deleteEvent(event.id); navigate('/'); }}>Delete</button>
              <button className="btn ghost small" onClick={() => setConfirmDelete(false)}>Keep it</button>
            </div>
          ) : (
            <button className="btn danger small" onClick={() => setConfirmDelete(true)}>Delete event</button>
          )}
        </div>
      </section>

      <section className="table" aria-live="polite">
        <div className="table-head">
          <h2>Your kit, live</h2>
          <span className="spec">Invite · Card 63 × 88 mm · Sticker 50 mm die-cut</span>
        </div>
        <div className="kit">
          <div>
            <Invite event={event} guest={guest} />
            <div className="item-label">WhatsApp invite for {guest.name.split(' ')[0]}</div>
          </div>
          <div className="kit-side">
            <div><PlayingCard event={event} guest={guest} index={previewIndex} /><div className="item-label">Their card</div></div>
            <div><CardBack event={event} /><div className="item-label">Card back</div></div>
            <div><Sticker event={event} kind={event.mascot.enabled ? 'mascot' : 'badge'} /><div className="item-label">Event sticker</div></div>
          </div>
        </div>
      </section>
    </div>
  );
}
