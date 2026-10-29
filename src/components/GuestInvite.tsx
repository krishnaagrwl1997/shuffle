import { useState } from 'react';
import type { Diet, EventKit, Guest, Rsvp, StickerKind } from '../lib/types';
import { STICKER_KINDS, cardFor, firstName, guestFunctions, overallRsvp, prettyDate, prettyTime } from '../lib/kit';
import { t } from '../lib/i18n';
import { eventSlots, googleCalendarUrl, icsFile } from '../lib/calendar';
import { downloadBlob, downloadStickerPack, saveCard } from '../lib/export';
import { CardBack, Invite, PlayingCard, Sticker } from './KitItems';
import { QR, checkinCode } from './QR';
import { EMBEDDED } from '../lib/env';

interface Props {
  event: EventKit;
  guest: Guest;
  index: number;
  onChange: (patch: Partial<Guest>) => void;
}

const DIETS: Diet[] = ['veg', 'nonveg', 'jain', 'vegan'];

/** What a guest sees after opening their link: invite, card reveal, sticker, RSVP and event-day details. */
export function GuestInvite({ event, guest, index, onChange }: Props) {
  const s = t(event.language);
  const [flipped, setFlipped] = useState(guest.rsvp !== null);
  const [busy, setBusy] = useState('');
  const [notice, setNotice] = useState('');
  const face = cardFor(index);
  const fns = guestFunctions(event, guest);
  const kinds: StickerKind[] = event.mascot.enabled ? ['mascot', ...STICKER_KINDS] : STICKER_KINDS;
  const coming = guest.rsvp === 'yes';

  const setRsvp = (rsvp: Rsvp) => onChange({ rsvp, sticker: guest.sticker ?? (rsvp === 'yes' ? kinds[0] : null) });
  const setFnRsvp = (fnId: string, r: Rsvp) => {
    const fnRsvp = { ...guest.fnRsvp, [fnId]: r };
    const rsvp = overallRsvp(event, { ...guest, fnRsvp });
    onChange({ fnRsvp, rsvp, sticker: guest.sticker ?? (rsvp === 'yes' ? kinds[0] : null) });
  };
  const clearReply = () => onChange({ rsvp: null, fnRsvp: {} });

  const details = `${event.name}${event.travel ? `\n\n${event.travel}` : ''}`;
  const slots = eventSlots(event, fns);
  const calLinks = slots
    .map((x) => ({ title: x.title, url: googleCalendarUrl(x, details) }))
    .filter((x): x is { title: string; url: string } => !!x.url);
  const run = async (label: string, job: () => Promise<unknown>, done: string) => {
    setBusy(label);
    setNotice('');
    try {
      await job();
      setNotice(done);
    } catch (e) {
      // Saying no to a save prompt is a choice, not an error.
      if ((e as { code?: string })?.code !== 'declined') setNotice("That didn't work here. Try again from your phone's browser.");
    } finally {
      setBusy('');
    }
  };

  return (
    <div className="guest-page">
      <Invite event={event} guest={guest} animate cta={flipped ? s.cardBelow : s.revealCta} />

      <button className={`flip ${flipped ? 'on' : ''}`} onClick={() => setFlipped(true)} aria-label={flipped ? 'Your card' : s.tapCard}>
        <div className="inner">
          <div className="face"><CardBack event={event} /></div>
          <div className="face front"><PlayingCard event={event} guest={guest} index={index} /></div>
        </div>
      </button>
      {!flipped && <p className="flip-hint">{s.tapCard}</p>}

      {flipped && (
        <>
          <h3>{s.pickSticker}</h3>
          <div className="stick-pick">
            {kinds.map((k) => (
              <button key={k} aria-pressed={guest.sticker === k} aria-label={`${k} sticker`} onClick={() => onChange({ sticker: k })}>
                <Sticker event={event} kind={k} size={56} />
              </button>
            ))}
          </div>

          {fns.length > 0 ? (
            <section className="g-section">
              <h3>{s.functions}</h3>
              {fns.map((f) => {
                const r = guest.fnRsvp[f.id] ?? null;
                return (
                  <div className="fn-row" key={f.id}>
                    <div className="fn-info">
                      <b>{f.name}</b>
                      <span>{[prettyDate(f.date || event.date, { day: 'numeric', month: 'short' }), prettyTime(f.time)].filter((x) => x && x !== 'Date to be set').join(' · ')}</span>
                      {(f.venue || event.venue) && <span>{f.venue || event.venue}</span>}
                    </div>
                    <div className="yn">
                      <button aria-pressed={r === 'yes'} onClick={() => setFnRsvp(f.id, 'yes')}>{s.yes}</button>
                      <button aria-pressed={r === 'no'} onClick={() => setFnRsvp(f.id, 'no')}>{s.no}</button>
                    </div>
                  </div>
                );
              })}
            </section>
          ) : guest.rsvp ? null : (
            <section className="g-section">
              <h3>{s.willYouBeThere}</h3>
              <div className="rsvp">
                <button className="btn" onClick={() => setRsvp('yes')}>{s.imIn}</button>
                <button className="btn ghost" onClick={() => setRsvp('no')}>{s.cantMake}</button>
              </div>
            </section>
          )}

          {coming && (event.allowPlusOnes || event.askDiet) && (
            <section className="g-section">
              {event.allowPlusOnes && (
                <div className="g-row">
                  <span>{s.bringing}</span>
                  <div className="stepper">
                    <button aria-label="Fewer" onClick={() => onChange({ plusOnes: Math.max(0, guest.plusOnes - 1) })}>−</button>
                    <b aria-live="polite">{guest.plusOnes}</b>
                    <button aria-label="More" onClick={() => onChange({ plusOnes: Math.min(5, guest.plusOnes + 1) })}>+</button>
                  </div>
                </div>
              )}
              {event.askDiet && (
                <div className="g-col">
                  <span>{s.diet}</span>
                  <div className="diet-chips">
                    {DIETS.map((d) => (
                      <button key={d} aria-pressed={guest.diet === d} onClick={() => onChange({ diet: d })}>{s.diets[d]}</button>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}

          {guest.rsvp && (
            <>
              <div className="field g-note">
                <label htmlFor={`note-${guest.id}`}>{s.note}</label>
                <textarea id={`note-${guest.id}`} value={guest.message} maxLength={200} rows={2} onChange={(e) => onChange({ message: e.target.value })} />
              </div>
              <div className="done">
                {coming ? s.youreIn(firstName(guest.name)) : s.missYou}
                <br />
                <button onClick={clearReply}>{s.changeReply}</button>
              </div>
            </>
          )}

          {coming && (
            <>
              <section className="g-section door">
                <QR value={checkinCode(event.id, guest.id)} size={150} label={`Check-in code for ${guest.name}`} />
                <div>
                  <b>{s.door}</b>
                  <span className="mono">{face.rank}{face.suit} · {guest.name}</span>
                  <span>{s.matchHint} ({face.rank}).</span>
                </div>
              </section>

              {event.travel && (
                <section className="g-section">
                  <h3>{s.travel}</h3>
                  <p className="travel">{event.travel}</p>
                </section>
              )}

              <div className="g-actions">
                {calLinks.length === 1 && (
                  <a className="btn ghost" href={calLinks[0].url} target="_blank" rel="noreferrer">{s.calendar}</a>
                )}
                {calLinks.length > 1 && (
                  <div className="wide cal-list">
                    <span>{s.calendar}</span>
                    {calLinks.map((c) => <a key={c.title} className="btn ghost small" href={c.url} target="_blank" rel="noreferrer">{c.title.split(' · ')[0]}</a>)}
                  </div>
                )}
                {!EMBEDDED && slots.some((x) => x.date) && (
                  <button className="btn ghost" onClick={() => downloadBlob(new Blob([icsFile(slots, details)], { type: 'text/calendar' }), 'invite.ics')}>Apple / Outlook</button>
                )}
                <button className="btn ghost" disabled={!!busy} onClick={() => run('card', () => saveCard(event, guest, index), 'Card saved')}>
                  {busy === 'card' ? '…' : s.saveCard}
                </button>
                {event.mascot.enabled && (
                  <button className="btn ghost wide" disabled={!!busy} onClick={() => run('pack', () => downloadStickerPack(event), 'Sticker pack downloaded. Open the zip to add it to WhatsApp.')}>
                    {busy === 'pack' ? 'Making stickers…' : s.stickers}
                  </button>
                )}
              </div>
              {notice && <p className="flip-hint" role="status">{notice}</p>}
            </>
          )}
        </>
      )}
    </div>
  );
}
