import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEventCtx } from '../components/EventLayout';
import { ACCESSORY_OPTIONS, BODY_OPTIONS, EYE_OPTIONS, MASCOT_COLORS, MOUTH_OPTIONS, Mascot } from '../components/Mascot';
import { CardBack } from '../components/KitItems';
import { PACK, PackSticker } from '../components/ExportArt';
import { BottomBar, Segmented, SwitchRow, Toast, useToast } from '../components/ui';
import { Icon } from '../components/Icon';
import { PALETTES } from '../lib/kit';
import { downloadStickerPack } from '../lib/export';
import type { Mascot as MascotT, StyleKey } from '../lib/types';

const NAMES = ['Pip', 'Bolt', 'Mochi', 'Ziggy', 'Laddoo', 'Chai', 'Nova', 'Bloop', 'Tikki', 'Juno'];
const pick = <T,>(xs: readonly T[]) => xs[Math.floor(Math.random() * xs.length)];

type Tab = 'body' | 'eyes' | 'mouth' | 'accessory' | 'color';
const TABS: { value: Tab; label: string }[] = [
  { value: 'body', label: 'Body' },
  { value: 'eyes', label: 'Eyes' },
  { value: 'mouth', label: 'Mouth' },
  { value: 'accessory', label: 'Extras' },
  { value: 'color', label: 'Colour' },
];

export function Look() {
  const { event, update } = useEventCtx();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('body');
  const [busy, setBusy] = useState(false);
  const [toast, showToast] = useToast(3600);
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

  const download = async () => {
    setBusy(true);
    try {
      await downloadStickerPack(event);
      showToast('Sticker pack downloaded. Open the zip on your phone to add it to WhatsApp.');
    } catch {
      showToast("Couldn't make the pack here. Try from your phone's browser.");
    } finally {
      setBusy(false);
    }
  };

  /** Each option is drawn on the mascot itself, so people choose by looking. */
  const options = (part: Exclude<Tab, 'color'>) => {
    const list = { body: BODY_OPTIONS, eyes: EYE_OPTIONS, mouth: MOUTH_OPTIONS, accessory: ACCESSORY_OPTIONS }[part] as { value: string; label: string }[];
    return (
      <div className="option-grid">
        {list.map((o) => {
          const variant = { ...m, [part]: o.value } as MascotT;
          return (
            <button key={o.value} className="option" aria-pressed={m[part] === o.value} onClick={() => set(variant)}>
              <Mascot mascot={variant} size={60} accent={accent} />
              {o.label}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <>
      <section className="group">
        <h2 className="group-title">Style</h2>
        <div className="hscroll" style={{ marginInline: -16, paddingInline: 16 }}>
          {(Object.keys(PALETTES) as StyleKey[]).map((k) => {
            const p = PALETTES[k];
            return (
              <button key={k} className="style-opt" aria-pressed={event.style === k} onClick={() => update((ev) => ({ ...ev, style: k }))}>
                <span className="swatches">{[p.paper, p.ink, p.accent, p.accent2].map((c) => <span key={c} style={{ background: c }} />)}</span>
                <b>{p.name}</b>
              </button>
            );
          })}
        </div>
      </section>

      <section className="mascot-stage" aria-live="polite">
        {m.enabled ? (
          <>
            <button className="btn ghost small surprise" onClick={surprise}><Icon name="dice" size={18} /> Surprise me</button>
            <Mascot mascot={m} size={190} accent={accent} />
            <label htmlFor="m-name" className="sr-only">Mascot name</label>
            <input id="m-name" className="name-input" value={m.name} maxLength={12} placeholder="Name your mascot" onChange={(e) => set({ ...m, name: e.target.value })} />
            <span className="hint">Tap the name to change it</span>
          </>
        ) : (
          <div className="empty" style={{ border: 0 }}><p>No mascot. Card backs will show your event's initials instead.</p></div>
        )}
      </section>

      <section className="group" style={{ paddingBlock: 4 }}>
        <SwitchRow label="Use a mascot" hint="On card backs, the invite, stickers and the WhatsApp pack" checked={m.enabled} onChange={(v) => set({ ...m, enabled: v })} />
      </section>

      {m.enabled && (
        <>
          <Segmented label="Mascot parts" value={tab} options={TABS} onChange={setTab} />
          {tab === 'color' ? (
            <section className="group">
              <div className="colors">
                {MASCOT_COLORS.map((c) => (
                  <button key={c} className="color-dot" style={{ background: c }} aria-label={`Colour ${c}`} aria-pressed={m.color.toLowerCase() === c.toLowerCase()} onClick={() => set({ ...m, color: c })} />
                ))}
                <label className="color-custom" aria-label="Pick any colour">
                  <input type="color" className="sr-only" value={m.color} onChange={(e) => set({ ...m, color: e.target.value })} />
                </label>
              </div>
              <SwitchRow label="Rosy cheeks" checked={m.cheeks} onChange={(v) => set({ ...m, cheeks: v })} />
            </section>
          ) : (
            options(tab)
          )}

          <section className="group">
            <div className="group-head">
              <h2 className="group-title">WhatsApp sticker pack</h2>
              <span className="spec">{PACK.length} stickers</span>
            </div>
            <p className="hint">Guests can add {m.name || 'your mascot'} to WhatsApp from their invite. Every sticker they send in the group chat shows off your event.</p>
            <div className="pack-grid">
              {PACK.map((s) => (
                <div key={s.caption} className="pack-cell"><PackSticker event={event} caption={s.caption} patch={s.patch} /></div>
              ))}
            </div>
            <button className="btn ghost block" disabled={busy} onClick={download}>{busy ? 'Making stickers…' : 'Download the pack'}</button>
          </section>

          <section className="group">
            <h2 className="group-title">Card back</h2>
            <div className="uses"><CardBack event={event} /></div>
          </section>
        </>
      )}

      <Toast text={toast} />
      <BottomBar>
        <button className="btn ghost" aria-label="Back" onClick={() => navigate('../setup')}><Icon name="back" /></button>
        <button className="btn" onClick={() => navigate('../guests')}>Next: guests <Icon name="next" /></button>
      </BottomBar>
    </>
  );
}
