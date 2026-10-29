import { Link } from 'react-router-dom';
import { useEventCtx } from '../components/EventLayout';
import { ACCESSORY_OPTIONS, BODY_OPTIONS, EYE_OPTIONS, MASCOT_COLORS, MOUTH_OPTIONS, Mascot } from '../components/Mascot';
import { CardBack, Invite, Sticker } from '../components/KitItems';
import { PALETTES } from '../lib/kit';
import type { Mascot as MascotT } from '../lib/types';

const NAMES = ['Pip', 'Bolt', 'Mochi', 'Ziggy', 'Laddoo', 'Chai', 'Nova', 'Bloop', 'Tikki', 'Juno'];
const pick = <T,>(xs: readonly T[]) => xs[Math.floor(Math.random() * xs.length)];

interface PartPickerProps<K extends keyof MascotT> {
  label: string;
  part: K;
  options: { value: MascotT[K]; label: string }[];
  mascot: MascotT;
  accent: string;
  onChange: (m: MascotT) => void;
}

/** One row of choices; each chip shows the mascot wearing that option, so people pick by looking. */
function PartPicker<K extends keyof MascotT>({ label, part, options, mascot, accent, onChange }: PartPickerProps<K>) {
  return (
    <div className="field">
      <span className="label">{label}</span>
      <div className="chips">
        {options.map((o) => {
          const variant = { ...mascot, [part]: o.value };
          return (
            <button key={String(o.value)} className="chip" aria-pressed={mascot[part] === o.value} onClick={() => onChange(variant)}>
              <Mascot mascot={variant} size={52} accent={accent} />
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function MascotMaker() {
  const { event, update } = useEventCtx();
  const m = event.mascot;
  const accent = PALETTES[event.style].accent;
  const set = (next: MascotT) => update((e) => ({ ...e, mascot: next }));

  const surprise = () =>
    set({
      ...m,
      enabled: true,
      body: pick(BODY_OPTIONS).value,
      eyes: pick(EYE_OPTIONS).value,
      mouth: pick(MOUTH_OPTIONS).value,
      accessory: pick(ACCESSORY_OPTIONS).value,
      color: pick(MASCOT_COLORS),
      cheeks: Math.random() > 0.3,
      name: pick(NAMES),
    });

  return (
    <div className="studio">
      <section className="panel">
        <div>
          <h1>Make your event's mascot</h1>
          <p className="lede">Your mascot shows up on the card backs, the invite and its own sticker. Pick parts, or let us surprise you.</p>
        </div>
        <label className="check">
          <input type="checkbox" checked={m.enabled} onChange={(e) => set({ ...m, enabled: e.target.checked })} />
          Use a mascot for this event
        </label>
        {m.enabled && (
          <>
            <div className="row2">
              <div className="field">
                <label htmlFor="m-name">Mascot name</label>
                <input id="m-name" value={m.name} maxLength={12} onChange={(e) => set({ ...m, name: e.target.value })} />
              </div>
              <div className="field" style={{ justifyContent: 'flex-end' }}>
                <button className="btn ghost" onClick={surprise}>Surprise me</button>
              </div>
            </div>
            <div className="field">
              <span className="label">Colour</span>
              <div className="colors">
                {MASCOT_COLORS.map((c) => (
                  <button key={c} className="color-dot" style={{ background: c }} aria-label={`Colour ${c}`} aria-pressed={m.color.toLowerCase() === c.toLowerCase()} onClick={() => set({ ...m, color: c })} />
                ))}
                <input className="color-custom" type="color" aria-label="Custom colour" value={m.color} onChange={(e) => set({ ...m, color: e.target.value })} />
              </div>
            </div>
            <PartPicker label="Body" part="body" options={BODY_OPTIONS} mascot={m} accent={accent} onChange={set} />
            <PartPicker label="Eyes" part="eyes" options={EYE_OPTIONS} mascot={m} accent={accent} onChange={set} />
            <PartPicker label="Mouth" part="mouth" options={MOUTH_OPTIONS} mascot={m} accent={accent} onChange={set} />
            <PartPicker label="Accessory" part="accessory" options={ACCESSORY_OPTIONS} mascot={m} accent={accent} onChange={set} />
            <label className="check">
              <input type="checkbox" checked={m.cheeks} onChange={(e) => set({ ...m, cheeks: e.target.checked })} />
              Rosy cheeks
            </label>
          </>
        )}
        <div className="btn-row">
          <Link className="btn" to="../guests">Next: add guests</Link>
          <Link className="btn ghost" to="../setup">Back</Link>
        </div>
      </section>

      <section className="table" aria-live="polite">
        <div className="table-head">
          <h2>{m.enabled ? `Meet ${m.name || 'your mascot'}` : 'No mascot'}</h2>
          <span className="spec">Shown on card backs, invite and sticker</span>
        </div>
        {m.enabled ? (
          <>
            <div className="mascot-stage">
              <Mascot mascot={m} size={220} accent={accent} />
              <div className="name">{m.name || 'Your mascot'}</div>
            </div>
            <div className="mascot-uses">
              <div><CardBack event={event} /><div className="item-label">Card back</div></div>
              <div><Sticker event={event} kind="mascot" /><div className="item-label">Mascot sticker</div></div>
            </div>
            <div style={{ maxWidth: 420, width: '100%', alignSelf: 'center' }}>
              <Invite event={event} guest={event.guests[0] ?? { name: 'Ananya' }} />
              <div className="item-label">Invite</div>
            </div>
          </>
        ) : (
          <div className="empty">Cards will show your event's monogram on the back instead. Turn the mascot on to design one.</div>
        )}
      </section>
    </div>
  );
}
