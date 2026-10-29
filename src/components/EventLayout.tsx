import { Link, NavLink, Outlet, useLocation, useOutletContext, useParams } from 'react-router-dom';
import { useStore } from '../lib/store';
import type { EventKit } from '../lib/types';
import { Icon } from './Icon';

export const STEPS = [
  { to: 'setup', label: 'Event' },
  { to: 'mascot', label: 'Mascot' },
  { to: 'guests', label: 'Guests' },
  { to: 'preview', label: 'Guest view' },
  { to: 'print', label: 'Print' },
] as const;

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

  const current = Math.max(0, STEPS.findIndex((s) => pathname.endsWith(`/${s.to}`)));
  const update = (patch: (e: EventKit) => EventKit) => updateEvent(event.id, patch);

  return (
    <div className="app">
      <header className="appbar">
        <Link to="/" className="icon-btn" aria-label="All events"><Icon name="back" /></Link>
        <div className="appbar-title">
          <small>Step {current + 1} of {STEPS.length} · {STEPS[current].label}</small>
          <span>{event.name || 'New event'}</span>
        </div>
      </header>
      <nav className="progress" aria-label="Steps">
        {STEPS.map((s, i) => (
          <NavLink key={s.to} to={s.to} className={i <= current ? 'reached' : ''} aria-label={`Step ${i + 1}: ${s.label}`}>
            <span className="bar" />
            <span className="step-name">{s.label}</span>
          </NavLink>
        ))}
      </nav>
      <main className="screen-body">
        <Outlet context={{ event, update } satisfies EventCtx} />
      </main>
    </div>
  );
}
