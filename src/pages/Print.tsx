import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useEventCtx } from '../components/EventLayout';
import { Sticker } from '../components/KitItems';
import type { StickerKind } from '../lib/types';

const STICKER_NAMES: Record<StickerKind, string> = {
  mascot: 'Mascot', badge: 'Badge', burst: 'I was there', ticket: 'Ticket', heart: 'Best crew',
};

export function Print() {
  const { event } = useEventCtx();
  const [fullDeck, setFullDeck] = useState(true);
  const [includeWaiting, setIncludeWaiting] = useState(false);
  const [sent, setSent] = useState(false);

  const yes = event.guests.filter((g) => g.rsvp === 'yes');
  const no = event.guests.filter((g) => g.rsvp === 'no');
  const waiting = event.guests.filter((g) => g.rsvp === null);
  const printFor = includeWaiting ? [...yes, ...waiting] : yes;
  const n = printFor.length;

  const stickerCounts = new Map<StickerKind, number>();
  const fallback: StickerKind = event.mascot.enabled ? 'mascot' : 'badge';
  printFor.forEach((g) => {
    const k = g.sticker ?? fallback;
    stickerCounts.set(k, (stickerCounts.get(k) ?? 0) + 1);
  });

  const lines: [string, string, number][] = [
    ['Personal playing card', 'One per guest · 63 × 88 mm · 310 gsm card stock', n],
    ['Sticker', `Each guest's pick · 50 mm die-cut · ${[...stickerCounts].map(([k, v]) => `${STICKER_NAMES[k]} ×${v}`).join(', ') || 'none yet'}`, n],
  ];
  if (fullDeck) lines.push(['Event deck', `All ${event.guests.length} guest cards in a tuck box`, n]);
  lines.push(['Digital invite links', 'Sent over WhatsApp · nothing to print', event.guests.length]);

  return (
    <div className="studio">
      <section className="panel">
        <div>
          <h1>Print for confirmed guests</h1>
          <p className="lede">Quantities come from RSVPs, so nothing is over-ordered. Files are made print-ready for you.</p>
        </div>
        <label className="check"><input type="checkbox" checked={fullDeck} onChange={(e) => { setFullDeck(e.target.checked); setSent(false); }} /> Add a full event deck for each confirmed guest</label>
        <label className="check"><input type="checkbox" checked={includeWaiting} onChange={(e) => { setIncludeWaiting(e.target.checked); setSent(false); }} /> Include guests who haven't replied yet</label>
        <div className="btn-row">
          <button className="btn" disabled={n === 0} onClick={() => setSent(true)}>Prepare print order</button>
          <Link className="btn ghost" to="../preview">Back</Link>
        </div>
        {n === 0 && <p className="hint">Nobody has confirmed yet. Share the invites, or include guests who haven't replied.</p>}
        {sent && (
          <div className="note ok" role="status">
            Order prepared for {n} guest{n === 1 ? '' : 's'}. Sending files to a print partner comes in the next version, along with prices and a delivery date.
          </div>
        )}
      </section>

      <section className="table">
        <div className="table-head">
          <h2>Order summary</h2>
          <span className="spec">Print-ready: 3 mm bleed · CMYK · die-cut path</span>
        </div>
        <div className="tiles">
          <div className="tile"><div className="big">{yes.length}</div><div className="small">Confirmed guests</div></div>
          <div className="tile"><div className="big">{waiting.length}</div><div className="small">Not replied yet</div></div>
          <div className="tile"><div className="big">{no.length}</div><div className="small">Can't make it</div></div>
        </div>
        <div className="lines">
          {lines.map(([name, spec, qty]) => (
            <div className="line" key={name}>
              <div><b>{name}</b><span className="spec">{spec}</span></div>
              <span className="qty">× {qty}</span>
            </div>
          ))}
        </div>
        {stickerCounts.size > 0 && (
          <div className="mascot-uses">
            {[...stickerCounts].map(([k, v]) => (
              <div key={k}><Sticker event={event} kind={k} size={84} /><div className="item-label">{STICKER_NAMES[k]} × {v}</div></div>
            ))}
          </div>
        )}
        <p className="hint">Prices depend on the print partner and quantity, so this version shows quantities only.</p>
      </section>
    </div>
  );
}
