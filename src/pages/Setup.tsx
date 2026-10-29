import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEventCtx } from '../components/EventLayout';
import { CardBack, Invite, PlayingCard, Sticker } from '../components/KitItems';
import { Carousel } from '../components/Carousel';
import { BottomBar, Sheet, SwitchRow, Toast, useToast } from '../components/ui';
import { Icon } from '../components/Icon';
import { newGuest, prettyDate, prettyTime, uid } from '../lib/kit';
import { LANGUAGES } from '../lib/i18n';
import { useStore } from '../lib/store';
import type { EventFunction, LangKey } from '../lib/types';

const PREVIEW_GUEST = { ...newGuest('Priya Nair', 'Always the first one there'), id: 'preview' };

export function Setup() {
  const { event, update } = useEventCtx();
  const { deleteEvent, duplicateEvent } = useStore();
  const navigate = useNavigate();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [logoError, setLogoError] = useState('');
  const [fnEdit, setFnEdit] = useState<EventFunction | null>(null);
  const [hostDraft, setHostDraft] = useState('');
  const [toast, showToast] = useToast();
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

  const saveFn = (fn: EventFunction) => {
    update((e) => ({
      ...e,
      functions: e.functions.some((f) => f.id === fn.id) ? e.functions.map((f) => (f.id === fn.id ? fn : f)) : [...e.functions, fn],
    }));
  };
  const removeFn = (id: string) => {
    update((e) => ({
      ...e,
      functions: e.functions.filter((f) => f.id !== id),
      guests: e.guests.map((g) => ({ ...g, functionIds: g.functionIds.filter((x) => x !== id) })),
    }));
    setFnEdit(null);
  };
  const addHost = () => {
    const name = hostDraft.trim();
    if (!name) return;
    update((e) => ({ ...e, hosts: [...e.hosts, name] }));
    setHostDraft('');
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
        {event.functions.length === 0 && (
          <div className="row2">
            <div className="field">
              <label htmlFor="ev-date">Date</label>
              <input id="ev-date" type="date" value={event.date} onChange={(e) => update((ev) => ({ ...ev, date: e.target.value }))} />
            </div>
            <div className="field">
              <label htmlFor="ev-time">Time</label>
              <input id="ev-time" type="time" value={event.time} onChange={(e) => update((ev) => ({ ...ev, time: e.target.value }))} />
            </div>
          </div>
        )}
        <div className="field">
          <label htmlFor="ev-venue">Venue</label>
          <input id="ev-venue" value={event.venue} maxLength={40} placeholder="Anjuna, Goa"
            onChange={(e) => update((ev) => ({ ...ev, venue: e.target.value }))} />
        </div>
      </section>

      <section className="group">
        <div className="group-head">
          <h2 className="group-title">Functions</h2>
          <button className="btn ghost small" onClick={() => setFnEdit({ id: uid(), name: '', date: event.date, time: '', venue: '' })}><Icon name="plus" size={18} /> Add</button>
        </div>
        {event.functions.length === 0 ? (
          <p className="hint">One event, one RSVP. Add functions like Mehendi, Sangeet and Reception to give each its own date, venue and reply. You choose who's invited to which.</p>
        ) : (
          <div className="list inset">
            {event.functions.map((f) => (
              <button key={f.id} className="list-row" onClick={() => setFnEdit(f)}>
                <span className="main">
                  <span className="t1" style={{ display: 'block' }}>{f.name || 'Untitled'}</span>
                  <span className="t2" style={{ display: 'block' }}>{[prettyDate(f.date, { weekday: 'short', day: 'numeric', month: 'short' }), prettyTime(f.time), f.venue].filter(Boolean).join(' · ')}</span>
                </span>
                <span className="chev"><Icon name="edit" size={18} /></span>
              </button>
            ))}
          </div>
        )}
      </section>

      <section className="group">
        <h2 className="group-title">Hosts</h2>
        {event.hosts.length > 0 && (
          <div className="chip-row">
            {event.hosts.map((h, i) => (
              <span key={`${h}-${i}`} className="tag">
                {h}
                <button aria-label={`Remove ${h}`} onClick={() => update((e) => ({ ...e, hosts: e.hosts.filter((_, j) => j !== i) }))}><Icon name="close" size={14} /></button>
              </span>
            ))}
          </div>
        )}
        <div className="inline-add">
          <label htmlFor="host" className="sr-only">Host name</label>
          <input id="host" value={hostDraft} placeholder="Add a host or co-host" onChange={(e) => setHostDraft(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addHost()} />
          <button className="btn ghost small" onClick={addHost} disabled={!hostDraft.trim()}>Add</button>
        </div>
        <p className="hint">Hosts appear on every invite. Co-hosts managing guests together arrives with accounts.</p>
      </section>

      <section className="group">
        <div className="field">
          <label htmlFor="ev-travel">Travel and stay (optional)</label>
          <textarea id="ev-travel" value={event.travel} rows={3} style={{ minHeight: 96 }} maxLength={400} placeholder="Shuttle times, hotel, parking, dress code"
            onChange={(e) => update((ev) => ({ ...ev, travel: e.target.value }))} />
        </div>
        <div className="field">
          <label htmlFor="ev-lang">Invite language</label>
          <select id="ev-lang" value={event.language} onChange={(e) => update((ev) => ({ ...ev, language: e.target.value as LangKey }))}>
            {LANGUAGES.map((l) => <option key={l.key} value={l.key}>{l.native}{l.native !== l.name ? ` (${l.name})` : ''}</option>)}
          </select>
          <p className="hint">Changes what guests see on their invite. Names and your own text stay as you type them.</p>
        </div>
      </section>

      <section className="group" style={{ gap: 0, paddingBlock: 4 }}>
        <SwitchRow label="Guests can bring people" hint="Asks how many are coming with them" checked={event.allowPlusOnes} onChange={(v) => update((e) => ({ ...e, allowPlusOnes: v }))} />
        <div className="divider" />
        <SwitchRow label="Ask food preference" hint="Veg, non-veg, Jain or vegan" checked={event.askDiet} onChange={(v) => update((e) => ({ ...e, askDiet: v }))} />
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

      <div className="action-grid">
        <button className="btn ghost small" onClick={() => {
          const id = duplicateEvent(event.id);
          if (id) { showToast('New event made with the same look'); navigate(`/events/${id}/setup`); }
        }}><Icon name="copy" size={18} /> Reuse this look</button>
        <button className="btn danger small" onClick={() => setConfirmDelete(true)}><Icon name="trash" size={18} /> Delete event</button>
      </div>

      <Sheet open={!!fnEdit} title={fnEdit && event.functions.some((f) => f.id === fnEdit.id) ? 'Edit function' : 'Add a function'} onClose={() => setFnEdit(null)}>
        {fnEdit && (
          <>
            <div className="field">
              <label htmlFor="fn-name">Name</label>
              <input id="fn-name" value={fnEdit.name} placeholder="Sangeet" maxLength={24} onChange={(e) => setFnEdit({ ...fnEdit, name: e.target.value })} />
            </div>
            <div className="row2">
              <div className="field">
                <label htmlFor="fn-date">Date</label>
                <input id="fn-date" type="date" value={fnEdit.date} onChange={(e) => setFnEdit({ ...fnEdit, date: e.target.value })} />
              </div>
              <div className="field">
                <label htmlFor="fn-time">Time</label>
                <input id="fn-time" type="time" value={fnEdit.time} onChange={(e) => setFnEdit({ ...fnEdit, time: e.target.value })} />
              </div>
            </div>
            <div className="field">
              <label htmlFor="fn-venue">Venue (if different)</label>
              <input id="fn-venue" value={fnEdit.venue} placeholder={event.venue || 'Venue'} maxLength={40} onChange={(e) => setFnEdit({ ...fnEdit, venue: e.target.value })} />
            </div>
            <button className="btn block" disabled={!fnEdit.name.trim()} onClick={() => { saveFn({ ...fnEdit, name: fnEdit.name.trim() }); setFnEdit(null); }}>Save</button>
            {event.functions.some((f) => f.id === fnEdit.id) && (
              <button className="btn danger block" onClick={() => removeFn(fnEdit.id)}>Remove function</button>
            )}
          </>
        )}
      </Sheet>

      <Sheet open={confirmDelete} title="Delete this event?" onClose={() => setConfirmDelete(false)}>
        <p className="lede">The event, its mascot and its guest list will be removed from this device.</p>
        <button className="btn danger block" onClick={() => { deleteEvent(event.id); navigate('/'); }}>Delete event</button>
        <button className="btn ghost block" onClick={() => setConfirmDelete(false)}>Keep it</button>
      </Sheet>

      <Toast text={toast} />
      <BottomBar>
        <button className="btn" onClick={() => navigate('../look')}>Next: look <Icon name="next" /></button>
      </BottomBar>
    </>
  );
}
