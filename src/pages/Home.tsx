import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../lib/store';
import { prettyDate } from '../lib/kit';
import { TEMPLATES } from '../lib/templates';
import { BrandMark } from '../components/EventLayout';
import { CardBack } from '../components/KitItems';
import { Mascot } from '../components/Mascot';
import { Icon } from '../components/Icon';
import { BottomBar, Sheet } from '../components/ui';

export function Home() {
  const { events, saveEvent, resetSample } = useStore();
  const navigate = useNavigate();
  const [picking, setPicking] = useState(false);

  const create = (key: string) => {
    const tpl = TEMPLATES.find((x) => x.key === key) ?? TEMPLATES[TEMPLATES.length - 1];
    const ev = tpl.build();
    saveEvent(ev);
    navigate(`/events/${ev.id}/setup`);
  };

  return (
    <div className="app">
      <header className="appbar">
        <div className="brand"><BrandMark /><span className="brand-name">Shuffle</span></div>
      </header>
      <main className="screen-body">
        <section className="home-hero">
          <h1>Invites every guest will keep</h1>
          <p className="lede">Personal WhatsApp invites with a playing card for each guest, a mascot sticker pack and RSVPs in one place. Printed merch is there if you want it.</p>
        </section>

        <h2 className="group-title">Your events</h2>
        {events.length === 0 ? (
          <div className="empty">
            <p>No events yet.</p>
            <button className="btn ghost small" onClick={resetSample}>Add the sample event</button>
          </div>
        ) : (
          <div className="list">
            {events.map((ev) => {
              const yes = ev.guests.filter((g) => g.rsvp === 'yes').length;
              const sent = ev.guests.filter((g) => g.sentAt).length;
              const target = sent > 0 ? 'track' : 'setup';
              return (
                <Link key={ev.id} to={`/events/${ev.id}/${target}`} className="list-row event-row">
                  <div className="mini-card"><CardBack event={ev} small /></div>
                  <div className="main">
                    <div className="t1">{ev.name || 'Untitled event'}{ev.id === 'sample' ? ' · sample' : ''}</div>
                    <div className="t2">{ev.functions.length ? `${ev.functions.length} functions` : prettyDate(ev.date)}</div>
                    <div className="t2">{ev.guests.length} guests · {sent} invited · {yes} coming</div>
                  </div>
                  <span className="chev"><Icon name="next" /></span>
                </Link>
              );
            })}
          </div>
        )}
        {events.length > 0 && !events.some((e) => e.id === 'sample') && (
          <button className="btn ghost small" style={{ alignSelf: 'center' }} onClick={resetSample}>Add the sample event</button>
        )}
      </main>

      <Sheet open={picking} title="What are you planning?" onClose={() => setPicking(false)}>
        <div className="template-list">
          {TEMPLATES.map((tpl) => {
            const preview = tpl.build();
            return (
              <button key={tpl.key} className="list-row template-row" onClick={() => create(tpl.key)}>
                <Mascot mascot={preview.mascot} size={52} />
                <span className="main">
                  <span className="t1" style={{ display: 'block' }}>{tpl.name}</span>
                  <span className="t2" style={{ display: 'block' }}>{tpl.blurb}</span>
                </span>
                <span className="chev"><Icon name="next" /></span>
              </button>
            );
          })}
        </div>
      </Sheet>

      <BottomBar>
        <button className="btn" onClick={() => setPicking(true)}><Icon name="plus" /> New event</button>
      </BottomBar>
    </div>
  );
}
