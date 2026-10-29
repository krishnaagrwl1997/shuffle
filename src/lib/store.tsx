import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import type { EventKit } from './types';
import { normalizeEvent, sampleEvent, uid } from './kit';

/**
 * Version 0.3 keeps everything in this browser (localStorage).
 * Swapping this file for an API client is the step to real accounts and shareable links.
 */
const KEY = 'shuffle.events.v1';

function load(): EventKit[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as EventKit[];
      if (Array.isArray(parsed)) return parsed.map(normalizeEvent);
    }
  } catch {
    /* private mode or corrupt data: fall back to the sample */
  }
  return [sampleEvent()];
}

interface Store {
  events: EventKit[];
  getEvent: (id: string | undefined) => EventKit | undefined;
  saveEvent: (event: EventKit) => void;
  updateEvent: (id: string, patch: (e: EventKit) => EventKit) => void;
  deleteEvent: (id: string) => void;
  /** Copy an event's look (style, mascot, logo, functions, hosts) into a fresh event with no guests. */
  duplicateEvent: (id: string) => string | undefined;
  resetSample: () => void;
}

const Ctx = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<EventKit[]>(load);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(events));
    } catch {
      /* storage full or blocked: the app keeps working for this session */
    }
  }, [events]);

  const getEvent = useCallback((id: string | undefined) => events.find((e) => e.id === id), [events]);
  const saveEvent = useCallback((event: EventKit) => {
    setEvents((all) => (all.some((e) => e.id === event.id) ? all.map((e) => (e.id === event.id ? event : e)) : [event, ...all]));
  }, []);
  const updateEvent = useCallback((id: string, patch: (e: EventKit) => EventKit) => {
    setEvents((all) => all.map((e) => (e.id === id ? patch(e) : e)));
  }, []);
  const deleteEvent = useCallback((id: string) => setEvents((all) => all.filter((e) => e.id !== id)), []);
  const duplicateEvent = useCallback((id: string) => {
    const src = events.find((e) => e.id === id);
    if (!src) return undefined;
    const copy: EventKit = {
      ...src,
      id: uid(),
      name: `${src.name || 'Event'} (copy)`,
      date: '',
      guests: [],
      thankYou: '',
      functions: src.functions.map((f) => ({ ...f, id: uid(), date: '' })),
      createdAt: Date.now(),
    };
    setEvents((all) => [copy, ...all]);
    return copy.id;
  }, [events]);
  const resetSample = useCallback(() => {
    setEvents((all) => [sampleEvent(), ...all.filter((e) => e.id !== 'sample')]);
  }, []);

  return (
    <Ctx.Provider value={{ events, getEvent, saveEvent, updateEvent, deleteEvent, duplicateEvent, resetSample }}>
      {children}
    </Ctx.Provider>
  );
}

export function useStore(): Store {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useStore must be used inside StoreProvider');
  return ctx;
}
