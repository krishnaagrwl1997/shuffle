import { Link, NavLink, Outlet, useOutletContext, useParams } from 'react-router-dom';
import { useStore } from '../lib/store';
import type { EventKit } from '../lib/types';

const STEPS = [
  { to: 'setup', label: 'Set up' },
  { to: 'mascot', label: 'Mascot' },
  { to: 'guests', label: 'Guests' },
  { to: 'preview', label: 'Guest view' },
  { to: 'print', label: 'Print' },
];

export interface EventCtx {
  event: EventKit;
  update: (patch: (e: EventKit) => EventKit) => void;
}

export function useEventCtx() {
  return useOutletContext<EventCtx>();
}

export function Brand({ subtitle }: { subtitle?: string }) {
  return (
    <Link to="/" className="brand" aria-label="Shuffle home">
      <div className="brand-mark" aria-hidden="true">S</div>
      <div>
        <div className="brand-name">Shuffle</div>
        <small>{subtitle ?? 'Invites and merch for your event, in one place'}</small>
      </div>
    </Link>
  );
}

export function EventLayout() {
  const { id } = useParams();
  const { getEvent, updateEvent } = useStore();
  const event = getEvent(id);

  if (!event) {
    return (
      <div className="wrap">
        <header className="top"><Brand /></header>
        <div className="empty" style={{ marginTop: 24 }}>
          <p>This event isn't on this device.</p>
          <Link className="btn" to="/">See your events</Link>
        </div>
      </div>
    );
  }

  const update = (patch: (e: EventKit) => EventKit) => updateEvent(event.id, patch);

  return (
    <div className="wrap">
      <header className="top">
        <Brand subtitle={event.name || 'New event'} />
        <nav className="steps" aria-label="Event steps">
          {STEPS.map((s, i) => (
            <NavLink key={s.to} to={s.to} className={({ isActive }) => (isActive ? 'active' : '')}>
              <span className="n">{i + 1}</span>
              {s.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <Outlet context={{ event, update } satisfies EventCtx} />
    </div>
  );
}
