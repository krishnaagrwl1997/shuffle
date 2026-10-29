# Shuffle

Personal WhatsApp invites with a playing card for every guest, a mascot sticker pack, and RSVPs in one place. Printed merch is an optional add-on, sized by who said yes.

Mobile first: one phone-width column, the main action pinned to the bottom of the screen.

## The flow

1. **Event**: name, date and time, venue. Optional functions (Mehendi, Sangeet, Reception…) each with their own date, venue and RSVP. Hosts, travel and stay details, invite language, plus-ones and food preference.
2. **Look**: print style, the mascot maker, and a WhatsApp sticker pack of the mascot.
3. **Guests**: paste a list (`Name - card line`). Each guest is dealt a card (A♠, A♥ … up to 52). Choose which functions each guest is invited to.
4. **Send**: send each guest their invite on WhatsApp and see who's been sent. Preview the WhatsApp message and the invite page as any guest.
5. **Track**: headcount with plus-ones, replies per function, food counts, notes from guests, and reminders for people who haven't replied.

Tools from Track: **Check-in** (scan the QR on a guest's invite, or search by name), **Card games** (find your match, suit teams, table groups), **Memories** (photos and a thank-you, shared as a memory pack), and **Printed merch** (optional).

## What guests get

- A personal invite in English, Hindi, Kannada, Tamil, Telugu, Marathi or Bengali, with the mascot dancing in.
- Their playing card, revealed with a flip, and saved as an image.
- A sticker to pick, and the mascot's WhatsApp sticker pack (9 stickers, 512 × 512 WebP, plus a tray icon).
- RSVP per function, plus-ones, food preference and a note for the host.
- Add to calendar, travel and stay details, and a QR code to show at the door.

## Known limits (v0.3)

Data is saved in the browser, so these work on the organiser's device only for now:

- Invite links and the memory pack open on this device; guests can't reply from their own phones yet.
- Reminders open WhatsApp with a message; automatic reminders need a server.
- Co-hosts are shown on invites, but can't manage guests together yet.
- Photos are added by the organiser; a shared photo wall needs a server.
- QR scanning needs a browser with the BarcodeDetector API (Chrome on Android). Search by name works everywhere.
- Adding the sticker pack to WhatsApp needs a sticker maker app; the zip includes instructions.
- Translations should be checked by a native speaker before launch.

## Next steps

1. Backend and accounts (for example Supabase): shareable invite links, real RSVPs, co-hosts, automatic reminders and a shared photo wall.
2. Print partner integration with prices and delivery dates.
3. Print-ready PDF export with bleed and die-cut paths.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # static site in dist/
```

The build uses relative paths and hash routing, so `dist/` can be hosted on any static host.

## Code map

| Path | What it holds |
| --- | --- |
| `src/lib/types.ts` | Data model: events, functions, guests, mascot |
| `src/lib/kit.ts` | Palettes, card dealing, RSVP rules, sample event, migration of saved data |
| `src/lib/templates.ts` | Starter templates by event type |
| `src/lib/i18n.ts` | Guest-facing invite text in seven languages |
| `src/lib/store.tsx` | Browser storage; replace with an API client for accounts |
| `src/lib/export.ts` | Card image, sticker pack zip |
| `src/lib/calendar.ts`, `games.ts`, `photos.ts`, `invite.ts` | Calendar links, card games, photo storage, WhatsApp messages |
| `src/components/` | Mascot, printed items, guest invite, QR code, sheets and other UI |
| `src/pages/` | Home, Event, Look, Guests, Send, Track, Check-in, Games, Memories, Print, guest pages |
