import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../lib/store';
import { PALETTES, blankEvent, prettyDate } from '../lib/kit';
import { Brand } from '../components/EventLayout';
import { CardBack } from '../components/KitItems';

export function Home() {
  const { events, saveEvent, resetSample } = useStore();
  const navigate = useNavigate();

  const create = () => {
    const ev = blankEvent();
    saveEvent(ev);
    navigate(`/events/${ev.id}/setup`);
  };

  return (
    <div className="wrap">
      <header className="top"><Brand /></header>
      <section className="hero">
        <h1>Personal invites and matching merch for every guest</h1>
        <p className="lede">Set up your event once. Each guest gets their own invite, playing card and sticker, and you print only for the people who said yes.</p>
        <div className="btn-row" style={{ marginTop: 8 }}>
          <button className="btn" onClick={create}>New event</button>
          {!events.some((e) => e.id === 'sample') && (
            <button className="btn ghost" onClick={resetSample}>Add the sample event</button>
          )}
        </div>
      </section>

      <h2 className="label" style={{ margin: '28px 0 12px' }}>Your events</h2>
      {events.length === 0 ? (
        <div className="empty">No events yet. Start one with New event.</div>
      ) : (
        <div className="events-grid">
          {events.map((ev) => {
            const yes = ev.guests.filter((g) => g.rsvp === 'yes').length;
            return (
              <Link key={ev.id} to={`/events/${ev.id}/setup`} className="event-card">
                <div className="mini">
                  <CardBack event={ev} small />
                  <div style={{ minWidth: 0 }}>
                    <h2>{ev.name || 'Untitled event'}</h2>
                    <div className="hint">{prettyDate(ev.date)}</div>
                    <div className="hint">{ev.venue || 'Venue to be set'}</div>
                  </div>
                </div>
                <div className="spec">
                  {ev.guests.length} guests · {yes} coming · {PALETTES[ev.style].name}
                  {ev.id === 'sample' ? ' · sample' : ''}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
