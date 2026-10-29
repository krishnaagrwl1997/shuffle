import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../lib/store';
import { blankEvent, prettyDate } from '../lib/kit';
import { BrandMark } from '../components/EventLayout';
import { CardBack } from '../components/KitItems';
import { Icon } from '../components/Icon';
import { BottomBar } from '../components/ui';

export function Home() {
  const { events, saveEvent, resetSample } = useStore();
  const navigate = useNavigate();

  const create = () => {
    const ev = blankEvent();
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
          <h1>Invites and merch for every guest</h1>
          <p className="lede">Set up your event once. Each guest gets their own invite, playing card and sticker. You print only for people who said yes.</p>
        </section>

        <section className="screen-title">
          <h2 className="group-title">Your events</h2>
        </section>
        {events.length === 0 ? (
          <div className="empty">
            <p>No events yet.</p>
            <button className="btn ghost small" onClick={resetSample}>Add the sample event</button>
          </div>
        ) : (
          <div className="list">
            {events.map((ev) => {
              const yes = ev.guests.filter((g) => g.rsvp === 'yes').length;
              return (
                <Link key={ev.id} to={`/events/${ev.id}/setup`} className="list-row event-row">
                  <div className="mini-card"><CardBack event={ev} small /></div>
                  <div className="main">
                    <div className="t1">{ev.name || 'Untitled event'}{ev.id === 'sample' ? ' · sample' : ''}</div>
                    <div className="t2">{prettyDate(ev.date)}</div>
                    <div className="t2">{ev.guests.length} guests · {yes} coming</div>
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
      <BottomBar>
        <button className="btn" onClick={create}><Icon name="plus" /> New event</button>
      </BottomBar>
    </div>
  );
}
