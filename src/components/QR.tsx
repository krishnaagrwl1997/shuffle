import { useEffect, useState } from 'react';
import QRCode from 'qrcode';

/** A QR code drawn as inline SVG. Dark modules on white so any phone camera can read it. */
export function QR({ value, size = 160, label }: { value: string; size?: number; label: string }) {
  const [svg, setSvg] = useState('');
  useEffect(() => {
    let alive = true;
    QRCode.toString(value, { type: 'svg', margin: 1, errorCorrectionLevel: 'M', color: { dark: '#1D1B22', light: '#FFFFFF' } })
      .then((s) => alive && setSvg(s))
      .catch(() => alive && setSvg(''));
    return () => { alive = false; };
  }, [value]);
  return <div className="qr" role="img" aria-label={label} style={{ width: size, height: size }} dangerouslySetInnerHTML={{ __html: svg }} />;
}

/** The text a guest's QR code carries: event and guest ids, checked by the organiser's check-in screen. */
export const checkinCode = (eventId: string, guestId: string) => `shuffle:${eventId}:${guestId}`;

export function parseCheckinCode(text: string): { eventId: string; guestId: string } | null {
  const m = /^shuffle:([^:]+):([^:]+)$/.exec(text.trim());
  return m ? { eventId: m[1], guestId: m[2] } : null;
}
