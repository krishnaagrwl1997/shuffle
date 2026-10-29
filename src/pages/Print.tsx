import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEventCtx } from '../components/EventLayout';
import { CardBack, PlayingCard, Sticker } from '../components/KitItems';
import { BottomBar, Sheet, SwitchRow } from '../components/ui';
import { Icon } from '../components/Icon';
import type { StickerKind } from '../lib/types';

const STICKER_NAMES: Record<StickerKind, string> = {
  mascot: 'Mascot', badge: 'Badge', burst: 'I was there', ticket: 'Ticket', heart: 'Best crew',
};

/** Printed merch is an add-on: off until the organiser asks for it, sized by RSVPs. */
export function Print() {
  const { event, update } = useEventCtx();
  const navigate = useNavigate();
  const [fullDeck, setFullDeck] = useState(true);
  const [includeWaiting, setIncludeWaiting] = useState(false);
  const [sent, setSent] = useState(false);

  const yes = event.guests.filter((g) => g.rsvp === 'yes');
  const waiting = event.guests.filter((g) => g.rsvp === null);
  const printFor = includeWaiting ? [...yes, ...waiting] : yes;
  const n = printFor.length;
  const enable = (v: boolean) => update((e) => ({ ...e, printEnabled: v }));

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

  if (!event.printEnabled) {
    return (
      <>
        <section className="print-hero">
          <div className="print-stack" aria-hidden="true">
            <CardBack event={event} small />
            {event.guests[0] && <PlayingCard event={event} guest={event.guests[0]} index={0} small />}
            <Sticker event={event} kind={fallback} size={84} />
          </div>
          <h1>Printed cards and stickers</h1>
          <p className="lede">Your invites, digital cards and sticker pack already work without printing. If you'd like something to hold, print each guest's card and sticker, only for people who said yes.</p>
        </section>
        <ul className="ticks">
          <li><Icon name="check" size={18} /> Quantities follow your RSVPs, so nothing is wasted</li>
          <li><Icon name="check" size={18} /> Print-ready files: 3 mm bleed, CMYK, die-cut paths</li>
          <li><Icon name="check" size={18} /> Hand out at check-in, or post to guests</li>
        </ul>
        <BottomBar>
          <button className="btn ghost" aria-label="Back to Track" onClick={() => navigate('../track')}><Icon name="back" /></button>
          <button className="btn" onClick={() => enable(true)}><Icon name="printer" /> Add printed merch</button>
        </BottomBar>
      </>
    );
  }

  return (
    <>
      <section className="screen-title">
        <h1>Print for {n} guest{n === 1 ? '' : 's'}</h1>
        <p className="lede">Quantities come from RSVPs, so nothing is over-ordered.</p>
      </section>

      <section className="group" style={{ paddingBlock: 4, gap: 0 }}>
        <SwitchRow label="Full deck for each guest" hint="Every guest's card, boxed" checked={fullDeck} onChange={setFullDeck} />
        <div className="divider" />
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

      <p className="hint">Prices depend on the print partner and arrive with ordering in a later version.</p>
      <button className="btn ghost small" style={{ alignSelf: 'center' }} onClick={() => { enable(false); navigate('../track'); }}>Remove printed merch</button>

      <Sheet open={sent} title="Order prepared" onClose={() => setSent(false)}>
        <p>Your order for {n} guest{n === 1 ? '' : 's'} is ready.</p>
        <p className="lede">Sending files to a print partner, with prices and a delivery date, comes in a later version of Shuffle.</p>
        <button className="btn block" onClick={() => setSent(false)}>Done</button>
      </Sheet>

      <BottomBar>
        <button className="btn ghost" aria-label="Back to Track" onClick={() => navigate('../track')}><Icon name="back" /></button>
        <button className="btn" disabled={n === 0} onClick={() => setSent(true)}><Icon name="printer" /> Prepare print order</button>
      </BottomBar>
    </>
  );
}
