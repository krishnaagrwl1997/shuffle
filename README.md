# Shuffle

Personal invites and matching merch for events. An organiser sets up the event once; every guest gets their own WhatsApp invite, a personal playing card and a sticker, and the organiser prints only for the people who said yes.

## What works in v0.1

- **Events**: create, edit and delete events. A sample event (Northwind Offsite 2026) is included.
- **Set up**: event name, date, venue, four print styles (Playful, Elegant, Desi festive, Minimal) and an optional logo, with a live preview of the invite, card, card back and sticker.
- **Mascot maker**: build an original mascot from body, eyes, mouth, accessory, colour and cheeks, or press Surprise me. It appears on card backs, the invite and its own sticker.
- **Guests**: paste a list (`Name - card line`), edit names and lines, and see the deck. Cards are dealt in list order (A♠, A♥, A♦, A♣, K♠ …), up to 52 guests. Copy each guest's invite message or open it in WhatsApp.
- **Guest view**: a phone preview of the WhatsApp chat and the invite page. Guests flip their card, pick a sticker and RSVP.
- **Print**: confirmed, waiting and declined counts, and print quantities based on RSVPs (63 × 88 mm cards, 50 mm die-cut stickers, optional full deck).

## Known limits

- Data is saved in the browser (localStorage), so invite links only open on the organiser's device.
- No accounts, payments or real print orders yet.

## Next steps

1. Backend and accounts so invite links work for every guest.
2. Print partner integration with quotes and delivery dates.
3. Print-ready file export (PDF with bleed and die-cut paths).
4. Story decks: AI-drafted card lines from short notes.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # static site in dist/
```

The build uses relative paths and hash routing, so `dist/` can be hosted on any static host, including GitHub Pages.

## Code map

| Path | What it holds |
| --- | --- |
| `src/lib/types.ts` | Data model: events, guests, mascot |
| `src/lib/kit.ts` | Print palettes, card dealing, guest parsing, sample event |
| `src/lib/store.tsx` | Browser storage; replace with an API client for accounts |
| `src/components/Mascot.tsx` | Parametric mascot drawn in SVG |
| `src/components/KitItems.tsx` | Playing card, card back, stickers, invite |
| `src/components/GuestInvite.tsx` | Card reveal, sticker pick and RSVP |
| `src/pages/` | Home, Set up, Mascot, Guests, Guest view, Print, guest invite page |
