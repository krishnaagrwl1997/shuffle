import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEventCtx } from '../components/EventLayout';
import { GuestInvite } from '../components/GuestInvite';
import { PlayingCard } from '../components/KitItems';
import { BottomBar, Segmented, Toast, useToast } from '../components/ui';
import { Icon } from '../components/Icon';
import { cardFor, firstName, guestFunctions, initials, overallRsvp, prettyDate } from '../lib/kit';
import { copyText, inviteMessage, whatsappUrl } from '../lib/invite';
import type { Guest } from '../lib/types';

type Tab = 'send' | 'preview';
type View = 'message' | 'invite';

export function Send() {
  const { event, update } = useEventCtx();
  const navigate = useNavigate();
  const state = useLocation().state as { guestId?: string } | null;
  const [tab, setTab] = useState<Tab>(state?.guestId ? 'preview' : 'send');
  const [guestId, setGuestId] = useState(state?.guestId ?? event.guests[Math.min(2, event.guests.length - 1)]?.id ?? '');
  const [view, setView] = useState<View>(state?.guestId ? 'invite' : 'message');
  const [toast, showToast] = useToast();

  const index = Math.max(0, event.guests.findIndex((g) => g.id === guestId));
  const guest = event.guests[index];
  const host = event.hosts[0] ?? event.guests[0]?.name ?? 'Host';
  const sent = event.guests.filter((g) => g.sentAt).length;
  const nextUnsent = event.guests.find((g) => !g.sentAt);

  const edit = (id: string, patch: Partial<Guest>) =>
    update((e) => ({
      ...e,
      guests: e.guests.map((g) => {
        if (g.id !== id) return g;
        const next = { ...g, ...patch };
        return e.functions.length && 'fnRsvp' in patch ? { ...next, rsvp: overallRsvp(e, next) } : next;
      }),
    }));
  const markSent = (g: Guest) => edit(g.id, { sentAt: Date.now() });
  const copy = async (g: Guest) => {
    const ok = await copyText(inviteMessage(event, g));
    if (ok) markSent(g);
    showToast(ok ? `Copied ${firstName(g.name)}'s invite. Paste it in WhatsApp.` : "Couldn't copy here. Use Send instead.");
  };

  if (event.guests.length === 0) {
    return (
      <>
        <div className="empty"><p>Add guests first, then send each of them their invite.</p></div>
        <BottomBar><button className="btn" onClick={() => navigate('../guests')}>Add guests</button></BottomBar>
      </>
    );
  }

  return (
    <>
      <Segmented label="Send or preview" value={tab} onChange={setTab}
        options={[{ value: 'send', label: `Send (${sent}/${event.guests.length})` }, { value: 'preview', label: 'Preview' }]} />

      {tab === 'send' ? (
        <>
          <section className="screen-title">
            <h1>{sent === event.guests.length ? 'Everyone is invited' : `${event.guests.length - sent} invite${event.guests.length - sent === 1 ? '' : 's'} to send`}</h1>
            <p className="lede">Each guest gets their own link on WhatsApp. Tap Send, pick the person, and their invite goes with their card.</p>
          </section>
          <div className="progress-line" aria-hidden="true"><span style={{ width: `${(sent / event.guests.length) * 100}%` }} /></div>

          <div className="list">
            {event.guests.map((g, i) => {
              const f = cardFor(i);
              const fns = guestFunctions(event, g);
              return (
                <div key={g.id} className="list-row static">
                  <span className={`rank-chip ${f.red ? 'red' : ''}`}><span>{f.rank}</span><span>{f.suit}</span></span>
                  <span className="main">
                    <span className="t1" style={{ display: 'block' }}>{g.name}</span>
                    <span className="t2" style={{ display: 'block' }}>
                      {g.sentAt ? `Sent ${new Date(g.sentAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}` : 'Not sent yet'}
                      {event.functions.length ? ` · ${fns.length} of ${event.functions.length} functions` : ''}
                    </span>
                  </span>
                  <button className="icon-btn" aria-label={`Copy ${g.name}'s invite`} onClick={() => copy(g)}><Icon name="copy" size={18} /></button>
                  <a className={`btn small ${g.sentAt ? 'ghost' : ''}`} href={whatsappUrl(inviteMessage(event, g))} target="_blank" rel="noreferrer" onClick={() => markSent(g)}>
                    {g.sentAt ? 'Resend' : 'Send'}
                  </a>
                </div>
              );
            })}
          </div>
          <p className="hint">Invite links open on this device until accounts arrive, so guests can't reply from their own phones yet.</p>
        </>
      ) : guest ? (
        <>
          <div className="hscroll" aria-label="Preview as">
            {event.guests.map((g) => (
              <button key={g.id} aria-pressed={g.id === guest.id} className={`btn small ${g.id === guest.id ? 'dark' : 'ghost'}`} onClick={() => setGuestId(g.id)}>
                {firstName(g.name)}
              </button>
            ))}
          </div>
          <Segmented label="Preview" value={view} onChange={setView}
            options={[{ value: 'message', label: 'WhatsApp message' }, { value: 'invite', label: 'Invite page' }]} />
          <p className="hint">Replies you make here count as {firstName(guest.name)}'s real RSVP.</p>

          {view === 'message' ? (
            <div className="guest-screen chat-mode">
              <div className="chat-head">
                <div className="av">{initials(host)}</div>
                <div>{host}<small>online</small></div>
              </div>
              <div className="chat">
                <div className="bubble">
                  <div className="linkcard">
                    <div className="thumb"><PlayingCard event={event} guest={guest} index={index} small /></div>
                    <div className="t"><b>You're invited: {event.name || 'our event'}</b><span>{event.functions.length ? guestFunctions(event, guest).map((f) => f.name).join(' · ') : `${prettyDate(event.date)} · ${event.venue || 'Venue to be set'}`}</span></div>
                  </div>
                  {inviteMessage(event, guest).replace(/https?:\S+/, '').trim()}
                  <div className="time">10:42</div>
                </div>
              </div>
              <div className="guest-page" style={{ paddingTop: 0 }}>
                <button className="btn" onClick={() => setView('invite')}>Open invite</button>
              </div>
            </div>
          ) : (
            <div className="guest-screen">
              <GuestInvite key={guest.id} event={event} guest={guest} index={index} onChange={(p) => edit(guest.id, p)} />
            </div>
          )}
        </>
      ) : null}

      <Toast text={toast} />
      <BottomBar>
        <button className="btn ghost" aria-label="Back" onClick={() => navigate('../guests')}><Icon name="back" /></button>
        {tab === 'send' && nextUnsent ? (
          <a className="btn" href={whatsappUrl(inviteMessage(event, nextUnsent))} target="_blank" rel="noreferrer" onClick={() => markSent(nextUnsent)}>
            <Icon name="share" /> Send to {firstName(nextUnsent.name)}
          </a>
        ) : (
          <button className="btn" onClick={() => navigate('../track')}>Next: track replies <Icon name="next" /></button>
        )}
      </BottomBar>
    </>
  );
}
