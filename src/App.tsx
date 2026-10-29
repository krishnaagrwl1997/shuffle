import { HashRouter, MemoryRouter, Navigate, Route, Routes } from 'react-router-dom';
import { StoreProvider } from './lib/store';
import { EventLayout } from './components/EventLayout';
import { Home } from './pages/Home';
import { Setup } from './pages/Setup';
import { Look } from './pages/Look';
import { Guests } from './pages/Guests';
import { Send } from './pages/Send';
import { Track } from './pages/Track';
import { Print } from './pages/Print';
import { CheckIn } from './pages/CheckIn';
import { Games } from './pages/Games';
import { Memories } from './pages/Memories';
import { GuestInvitePage } from './pages/GuestInvitePage';
import { MemoriesPage } from './pages/MemoriesPage';
import { EMBEDDED } from './lib/env';

/**
 * Hash routing keeps the app working on any static host without server rewrites.
 * Embedded previews use an in-memory router instead (see lib/env.ts).
 */
const Router = EMBEDDED ? MemoryRouter : HashRouter;

export function App() {
  return (
    <StoreProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events/:id" element={<EventLayout />}>
            <Route index element={<Navigate to="setup" replace />} />
            <Route path="setup" element={<Setup />} />
            <Route path="look" element={<Look />} />
            <Route path="guests" element={<Guests />} />
            <Route path="send" element={<Send />} />
            <Route path="track" element={<Track />} />
            <Route path="print" element={<Print />} />
            <Route path="checkin" element={<CheckIn />} />
            <Route path="games" element={<Games />} />
            <Route path="memories" element={<Memories />} />
            {/* Older links */}
            <Route path="mascot" element={<Navigate to="../look" replace />} />
            <Route path="preview" element={<Navigate to="../send" replace />} />
          </Route>
          <Route path="/invite/:id/:guestId" element={<GuestInvitePage />} />
          <Route path="/memories/:id" element={<MemoriesPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </StoreProvider>
  );
}
