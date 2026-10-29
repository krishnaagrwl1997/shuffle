import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEventCtx } from '../components/EventLayout';
import { CardBack, Invite, PlayingCard, Sticker } from '../components/KitItems';
import { Carousel } from '../components/Carousel';
import { BottomBar, Sheet } from '../components/ui';
import { Icon } from '../components/Icon';
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
    <>
      <Carousel
        label="Preview of your kit"
        slides={[
          { label: `Invite for ${guest.name.split(' ')[0]}`, content: <Invite event={event} guest={guest} /> },
          { label: 'Their playing card', content: <PlayingCard event={event} guest={guest} index={previewIndex} /> },
          { label: 'Card back', content: <CardBack event={event} /> },
          { label: 'Event sticker', content: <Sticker event={event} kind={event.mascot.enabled ? 'mascot' : 'badge'} size={170} /> },
        ]}
      />

      <section className="group">
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
      </section>

      <section className="group">
        <h2 className="group-title">Style</h2>
        <div className="hscroll" style={{ marginInline: -16, paddingInline: 16 }}>
          {(Object.keys(PALETTES) as StyleKey[]).map((k) => {
            const p = PALETTES[k];
            return (
              <button key={k} className="style-opt" aria-pressed={event.style === k} onClick={() => update((ev) => ({ ...ev, style: k }))}>
                <span className="swatches">{[p.paper, p.ink, p.accent, p.accent2].map((c) => <span key={c} style={{ background: c }} />)}</span>
                <b>{p.name}</b>
              </button>
            );
          })}
        </div>
      </section>

      <section className="group">
        <h2 className="group-title">Logo</h2>
        {event.logo ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img src={event.logo} alt="Event logo" style={{ width: 56, height: 56, objectFit: 'contain', borderRadius: 10, background: 'var(--bg)' }} />
            <button className="btn ghost small" onClick={() => update((ev) => ({ ...ev, logo: null }))}>Remove</button>
          </div>
        ) : (
          <label className="btn ghost" style={{ cursor: 'pointer' }}>
            <Icon name="image" /> Add a logo (optional)
            <input type="file" accept="image/*" className="sr-only" onChange={(e) => onLogo(e.target.files?.[0])} />
          </label>
        )}
        {logoError && <p className="error">{logoError}</p>}
      </section>

      <button className="btn danger small" style={{ alignSelf: 'center' }} onClick={() => setConfirmDelete(true)}>
        <Icon name="trash" size={18} /> Delete event
      </button>

      <Sheet open={confirmDelete} title="Delete this event?" onClose={() => setConfirmDelete(false)}>
        <p className="lede">The event, its mascot and its guest list will be removed from this device.</p>
        <button className="btn danger block" onClick={() => { deleteEvent(event.id); navigate('/'); }}>Delete event</button>
        <button className="btn ghost block" onClick={() => setConfirmDelete(false)}>Keep it</button>
      </Sheet>

      <BottomBar>
        <button className="btn" onClick={() => navigate('../mascot')}>Next: mascot <Icon name="next" /></button>
      </BottomBar>
    </>
  );
}
