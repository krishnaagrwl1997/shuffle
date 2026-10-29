import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useStore } from '../lib/store';
import { listPhotos, type Photo } from '../lib/photos';
import { PALETTES, prettyDate } from '../lib/kit';
import { Mascot } from '../components/Mascot';
import { PlayingCard } from '../components/KitItems';
import { Icon } from '../components/Icon';

/** The memory pack guests open after the event: thank-you, photos and the whole deck. */
export function MemoriesPage() {
  const { id } = useParams();
  const { getEvent } = useStore();
  const event = getEvent(id);
  const [photos, setPhotos] = useState<Photo[]>([]);
  useEffect(() => { if (id) listPhotos(id).then(setPhotos); }, [id]);

  if (!event) {
    return (
      <div className="guest-screen standalone">
        <div className="guest-page"><h3>These memories aren't available here</h3><p>Memory packs open on the organiser's device until shareable links arrive.</p></div>
      </div>
    );
  }

  const p = PALETTES[event.style];
  const coming = event.guests.map((g, i) => ({ g, i })).filter(({ g }) => g.rsvp === 'yes');

  return (
    <div className="guest-screen standalone">
      <div className="guest-page">
        <Link to={`/events/${event.id}/memories`} className="back-link"><Icon name="back" size={18} /> Back to the event</Link>
        <section className="memory-hero" style={{ background: p.paper, color: p.ink }}>
          {event.mascot.enabled && <Mascot mascot={{ ...event.mascot, eyes: 'happy', mouth: 'grin' }} size={110} accent={p.accent} />}
          <h1>{event.name || 'Our event'}</h1>
          <span>{event.functions.length ? event.functions.map((f) => f.name).join(' · ') : prettyDate(event.date)}</span>
          <p>{event.thankYou || `Thank you for coming to ${event.name || 'our event'}! It wouldn't have been the same without you.`}</p>
          {event.hosts.length > 0 && <b>{event.hosts.join(' & ')}</b>}
        </section>

        {photos.length > 0 && (
          <>
            <h3>Photos</h3>
            <div className="photo-grid">
              {photos.map((ph) => <div key={ph.id} className="photo"><img src={ph.dataUrl} alt="" loading="lazy" /></div>)}
            </div>
          </>
        )}

        {coming.length > 0 && (
          <>
            <h3>Everyone who was there</h3>
            <div className="mini-deck light">
              {coming.map(({ g, i }) => <div key={g.id} className="mini-person"><PlayingCard event={event} guest={g} index={i} small /></div>)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
