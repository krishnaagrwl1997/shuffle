import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEventCtx } from '../components/EventLayout';
import { BottomBar, Sheet, Toast, useToast } from '../components/ui';
import { Icon } from '../components/Icon';
import { parseCheckinCode } from '../components/QR';
import { cardFor } from '../lib/kit';

interface Detector { detect: (src: CanvasImageSource) => Promise<{ rawValue: string }[]> }
type DetectorCtor = new (opts: { formats: string[] }) => Detector;
const BarcodeDetectorCtor = (window as unknown as { BarcodeDetector?: DetectorCtor }).BarcodeDetector;
const canScan = !!BarcodeDetectorCtor && !!navigator.mediaDevices?.getUserMedia;

export function CheckIn() {
  const { event, update } = useEventCtx();
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanError, setScanError] = useState('');
  const [toast, showToast] = useToast();
  const video = useRef<HTMLVideoElement>(null);

  const rows = event.guests
    .map((g, i) => ({ g, i }))
    .filter(({ g }) => showAll || g.rsvp === 'yes')
    .filter(({ g }) => g.name.toLowerCase().includes(q.trim().toLowerCase()));
  const expected = event.guests.filter((g) => g.rsvp === 'yes');
  const arrived = event.guests.filter((g) => g.checkedIn);

  const setChecked = (id: string, checkedIn: boolean) =>
    update((e) => ({ ...e, guests: e.guests.map((g) => (g.id === id ? { ...g, checkedIn } : g)) }));

  // Camera scanning: read the QR code on a guest's invite and check them in.
  useEffect(() => {
    if (!scanning || !BarcodeDetectorCtor) return;
    let stream: MediaStream | null = null;
    let stop = false;
    const detector = new BarcodeDetectorCtor({ formats: ['qr_code'] });
    (async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (!video.current) return;
        video.current.srcObject = stream;
        await video.current.play();
        while (!stop) {
          const codes = await detector.detect(video.current).catch(() => []);
          const hit = codes.map((c) => parseCheckinCode(c.rawValue)).find(Boolean);
          if (hit && hit.eventId === event.id) {
            const g = event.guests.find((x) => x.id === hit.guestId);
            if (g) {
              setChecked(g.id, true);
              showToast(`${g.name} checked in`);
              setScanning(false);
              return;
            }
          }
          await new Promise((r) => setTimeout(r, 300));
        }
      } catch {
        setScanError('Camera not available. Allow camera access, or search by name instead.');
      }
    })();
    return () => {
      stop = true;
      stream?.getTracks().forEach((t) => t.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scanning]);

  return (
    <>
      <section className="screen-title">
        <h1>{arrived.length} of {expected.length} arrived</h1>
        <p className="lede">Scan the code on a guest's invite, or find them by name and tap to check in.</p>
      </section>
      <div className="progress-line" aria-hidden="true"><span style={{ width: `${expected.length ? (arrived.length / expected.length) * 100 : 0}%` }} /></div>

      <div className="field">
        <label htmlFor="ci-search" className="sr-only">Search guests</label>
        <input id="ci-search" value={q} placeholder="Search by name" onChange={(e) => setQ(e.target.value)} />
      </div>
      <label className="check-small">
        <input type="checkbox" checked={showAll} onChange={(e) => setShowAll(e.target.checked)} /> Show everyone, not just people who said yes
      </label>

      {rows.length === 0 ? (
        <div className="empty"><p>{q ? `No one called “${q}”.` : 'No confirmed guests yet.'}</p></div>
      ) : (
        <div className="list">
          {rows.map(({ g, i }) => {
            const f = cardFor(i);
            return (
              <button key={g.id} className={`list-row ${g.checkedIn ? 'checked' : ''}`} aria-pressed={g.checkedIn} onClick={() => setChecked(g.id, !g.checkedIn)}>
                <span className={`rank-chip ${f.red ? 'red' : ''}`}><span>{f.rank}</span><span>{f.suit}</span></span>
                <span className="main">
                  <span className="t1" style={{ display: 'block' }}>{g.name}{g.plusOnes ? ` +${g.plusOnes}` : ''}</span>
                  <span className="t2" style={{ display: 'block' }}>{g.checkedIn ? 'Checked in' : g.rsvp === 'yes' ? 'Expected' : g.rsvp === 'no' ? "Said they can't come" : 'No reply'}</span>
                </span>
                <span className={`tick ${g.checkedIn ? 'on' : ''}`} aria-hidden="true"><Icon name="check" size={18} /></span>
              </button>
            );
          })}
        </div>
      )}

      <Sheet open={scanning} title="Scan an invite" onClose={() => setScanning(false)}>
        <video ref={video} className="scan-video" playsInline muted />
        {scanError ? <p className="error">{scanError}</p> : <p className="hint">Point the camera at the code on the guest's invite.</p>}
      </Sheet>

      <Toast text={toast} />
      <BottomBar>
        <button className="btn ghost" aria-label="Back to Track" onClick={() => navigate('../track')}><Icon name="back" /></button>
        {canScan ? (
          <button className="btn" onClick={() => { setScanError(''); setScanning(true); }}><Icon name="eye" /> Scan an invite</button>
        ) : (
          <button className="btn" onClick={() => showToast("This browser can't scan codes. Use Chrome on Android, or search by name.")}>
            <Icon name="eye" /> Scan an invite
          </button>
        )}
      </BottomBar>
    </>
  );
}
