import { Link, NavLink, Outlet, useLocation, useOutletContext, useParams } from 'react-router-dom';
import { useStore } from '../lib/store';
import type { EventKit } from '../lib/types';
import { Icon } from './Icon';

/** The main path is fully digital. Print, check-in, games and memories are tools reached from Track. */
export const STEPS = [
  { to: 'setup', label: 'Event' },
  { to: 'look', label: 'Look' },
  { to: 'guests', label: 'Guests' },
  { to: 'send', label: 'Send' },
  { to: 'track', label: 'Track' },
] as const;

export const TOOLS: Record<string, string> = {
  checkin: 'Check-in',
  games: 'Card games',
  memories: 'Memories',
  print: 'Printed merch',
};

export interface EventCtx {
  event: EventKit;
  update: (patch: (e: EventKit) => EventKit) => void;
}

export function useEventCtx() {
  return useOutletContext<EventCtx>();
}

export function BrandMark() {
  return <div className="brand-mark" aria-hidden="true">S</div>;
}

export function EventLayout() {
  const { id } = useParams();
  const { pathname } = useLocation();
  const { getEvent, updateEvent } = useStore();
  const event = getEvent(id);

  if (!event) {
    return (
      <div className="app">
        <header className="appbar"><Link to="/" className="icon-btn" aria-label="Home"><Icon name="back" /></Link><div className="appbar-title">Event not found</div></header>
        <main className="screen-body">
          <div className="empty">
            <p>This event isn't on this device.</p>
            <Link className="btn" to="/">See your events</Link>
          </div>
        </main>
      </div>
    );
  }

  const last = pathname.split('/').pop() ?? '';
  const tool = TOOLS[last];
  const current = tool ? STEPS.length - 1 : Math.max(0, STEPS.findIndex((s) => s.to === last));
  const update = (patch: (e: EventKit) => EventKit) => updateEvent(event.id, patch);

  return (
    <div className="app">
      <header className="appbar">
        <Link to={tool ? 'track' : '/'} className="icon-btn" aria-label={tool ? 'Back to Track' : 'All events'}><Icon name="back" /></Link>
        <div className="appbar-title">
          <small>{tool ? `Track · ${tool}` : `Step ${current + 1} of ${STEPS.length} · ${STEPS[current].label}`}</small>
          <span>{event.name || 'New event'}</span>
        </div>
      </header>
      {!tool && (
        <nav className="progress" aria-label="Steps">
          {STEPS.map((s, i) => (
            <NavLink key={s.to} to={s.to} className={i <= current ? 'reached' : ''} aria-label={`Step ${i + 1}: ${s.label}`}>
              <span className="bar" />
              <span className="step-name">{s.label}</span>
            </NavLink>
          ))}
        </nav>
      )}
      <main className="screen-body">
        <Outlet context={{ event, update } satisfies EventCtx} />
      </main>
    </div>
  );
}
