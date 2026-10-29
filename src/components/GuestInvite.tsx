import { useState } from 'react';
import type { EventKit, Guest, Rsvp, StickerKind } from '../lib/types';
import { STICKER_KINDS, cardFor, firstName } from '../lib/kit';
import { CardBack, Invite, PlayingCard, Sticker } from './KitItems';

interface Props {
  event: EventKit;
  guest: Guest;
  index: number;
  onRsvp: (r: Rsvp) => void;
  onSticker: (s: StickerKind) => void;
}

/** What a guest sees after opening their link: invite, card reveal, sticker pick, RSVP. */
export function GuestInvite({ event, guest, index, onRsvp, onSticker }: Props) {
  const [flipped, setFlipped] = useState(guest.rsvp !== null);
  const face = cardFor(index);
  const kinds: StickerKind[] = event.mascot.enabled ? ['mascot', ...STICKER_KINDS] : STICKER_KINDS;

  return (
    <div className="guest-page">
      <Invite event={event} guest={guest} cta={flipped ? 'Your card is below' : 'Tap the card to reveal it'} />
      <button className={`flip ${flipped ? 'on' : ''}`} onClick={() => setFlipped(true)} aria-label={flipped ? 'Your card' : 'Reveal your card'}>
        <div className="inner">
          <div className="face"><CardBack event={event} /></div>
          <div className="face front"><PlayingCard event={event} guest={guest} index={index} /></div>
        </div>
      </button>
      {flipped && (
        <>
          <h3>Pick your sticker</h3>
          <div className="stick-pick">
            {kinds.map((k) => (
              <button key={k} aria-pressed={guest.sticker === k} aria-label={`${k} sticker`} onClick={() => onSticker(k)}>
                <Sticker event={event} kind={k} size={56} />
              </button>
            ))}
          </div>
          {guest.rsvp ? (
            <div className="done">
              {guest.rsvp === 'yes'
                ? `You're in, ${firstName(guest.name)}. Your ${face.rank}${face.suit} card and sticker will be waiting at the venue.`
                : "Thanks for letting us know. We'll miss you."}
              <br />
              <button onClick={() => onRsvp(null)}>Change reply</button>
            </div>
          ) : (
            <>
              <h3>Will you be there?</h3>
              <div className="rsvp">
                <button className="btn" onClick={() => { onRsvp('yes'); if (!guest.sticker) onSticker(kinds[0]); }}>I'm in</button>
                <button className="btn ghost" onClick={() => onRsvp('no')}>Can't make it</button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
