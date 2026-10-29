import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { StoreProvider } from './lib/store';
import { EventLayout } from './components/EventLayout';
import { Home } from './pages/Home';
import { Setup } from './pages/Setup';
import { MascotMaker } from './pages/MascotMaker';
import { Guests } from './pages/Guests';
import { GuestPreview } from './pages/GuestPreview';
import { Print } from './pages/Print';
import { GuestInvitePage } from './pages/GuestInvitePage';

/** Hash routing keeps the app working on any static host without server rewrites. */
export function App() {
  return (
    <StoreProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events/:id" element={<EventLayout />}>
            <Route index element={<Navigate to="setup" replace />} />
            <Route path="setup" element={<Setup />} />
            <Route path="mascot" element={<MascotMaker />} />
            <Route path="guests" element={<Guests />} />
            <Route path="preview" element={<GuestPreview />} />
            <Route path="print" element={<Print />} />
          </Route>
          <Route path="/invite/:id/:guestId" element={<GuestInvitePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </StoreProvider>
  );
}
