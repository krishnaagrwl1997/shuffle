import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEventCtx } from '../components/EventLayout';
import { Sticker } from '../components/KitItems';
import { BottomBar, Sheet, SwitchRow } from '../components/ui';
import { Icon } from '../components/Icon';
import type { StickerKind } from '../lib/types';

const STICKER_NAMES: Record<StickerKind, string> = {
  mascot: 'Mascot', badge: 'Badge', burst: 'I was there', ticket: 'Ticket', heart: 'Best crew',
};

export function Print() {
  const { event } = useEventCtx();
  const navigate = useNavigate();
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
    ['Personal playing cards', '63 × 88 mm · 310 gsm card stock', n],
    ['Stickers', "Each guest's pick · 50 mm die-cut", n],
  ];
  if (fullDeck) lines.push(['Event decks', `All ${event.guests.length} guest cards in a tuck box`, n]);
  lines.push(['Invite links', 'Sent on WhatsApp · nothing to print', event.guests.length]);

  return (
    <>
      <section className="screen-title">
        <h1>Print for {n} guest{n === 1 ? '' : 's'}</h1>
        <p className="lede">Quantities come from RSVPs, so nothing is over-ordered.</p>
      </section>

      <div className="stats">
        <div className="stat yes"><div className="big">{yes.length}</div><div className="small">Coming</div></div>
        <div className="stat"><div className="big">{waiting.length}</div><div className="small">Waiting</div></div>
        <div className="stat"><div className="big">{no.length}</div><div className="small">Can't come</div></div>
      </div>

      <section className="group" style={{ paddingBlock: 4, gap: 0 }}>
        <SwitchRow label="Full deck for each guest" hint="Every guest's card, boxed" checked={fullDeck} onChange={setFullDeck} />
        <div style={{ borderTop: '1px solid var(--line)' }} />
        <SwitchRow label="Include guests who haven't replied" hint={`${waiting.length} waiting`} checked={includeWaiting} onChange={setIncludeWaiting} />
      </section>

      <section className="list">
        {lines.map(([name, spec, qty]) => (
          <div className="line" key={name}>
            <div><b>{name}</b><span className="spec">{spec}</span></div>
            <span className="qty">× {qty}</span>
          </div>
        ))}
      </section>

      {stickerCounts.size > 0 && (
        <section className="group">
          <h2 className="group-title">Sticker mix</h2>
          <div className="sticker-row">
            {[...stickerCounts].map(([k, v]) => (
              <div key={k}><Sticker event={event} kind={k} size={76} /><div className="item-label">{STICKER_NAMES[k]} × {v}</div></div>
            ))}
          </div>
        </section>
      )}

      <p className="hint">Files are print-ready: 3 mm bleed, CMYK and die-cut paths. Prices depend on the print partner and arrive in the next version.</p>

      <Sheet open={sent} title="Order prepared" onClose={() => setSent(false)}>
        <p>Your order for {n} guest{n === 1 ? '' : 's'} is ready.</p>
        <p className="lede">Sending files to a print partner, with prices and a delivery date, comes in the next version of Shuffle.</p>
        <button className="btn block" onClick={() => setSent(false)}>Done</button>
      </Sheet>

      <BottomBar>
        <button className="btn ghost" aria-label="Back" onClick={() => navigate('../preview')}><Icon name="back" /></button>
        <button className="btn" disabled={n === 0} onClick={() => setSent(true)}><Icon name="printer" /> Prepare print order</button>
      </BottomBar>
    </>
  );
}
