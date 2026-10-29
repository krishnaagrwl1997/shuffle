import { createElement, type ReactElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import JSZip from 'jszip';
import type { EventKit, Guest } from './types';
import { CardArt, PACK, PackSticker, TrayIcon } from '../components/ExportArt';

/** Draw an SVG element to a canvas and return it as an image file. */
export async function svgToBlob(el: ReactElement, width: number, height: number, type = 'image/png', quality = 0.9): Promise<Blob> {
  const markup = renderToStaticMarkup(el);
  const img = new Image();
  img.decoding = 'async';
  img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(markup)}`;
  await img.decode();
  const c = document.createElement('canvas');
  c.width = width;
  c.height = height;
  c.getContext('2d')!.drawImage(img, 0, 0, width, height);
  return new Promise((resolve, reject) => c.toBlob((b) => (b ? resolve(b) : reject(new Error('Could not draw the image'))), type, quality));
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'event';

/** Save a guest's playing card as a PNG, or hand it to the phone's share sheet when that's available. */
export async function saveCard(event: EventKit, guest: Guest, index: number): Promise<'shared' | 'downloaded'> {
  const blob = await svgToBlob(createElement(CardArt, { event, guest, index }), 630, 880);
  const file = new File([blob], `${slug(guest.name)}-card.png`, { type: 'image/png' });
  const nav = navigator as Navigator & { canShare?: (d: { files: File[] }) => boolean };
  if (nav.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: `${guest.name}'s card` });
      return 'shared';
    } catch {
      /* cancelled or blocked: fall back to download */
    }
  }
  downloadBlob(blob, file.name);
  return 'downloaded';
}

function webpSupported(): boolean {
  const c = document.createElement('canvas');
  c.width = c.height = 1;
  return c.toDataURL('image/webp').startsWith('data:image/webp');
}

/**
 * The mascot sticker pack as a zip, in WhatsApp's format:
 * 512 × 512 stickers (WebP where the browser can make it), a 96 × 96 tray icon, 3 to 30 stickers.
 */
export async function stickerPackZip(event: EventKit): Promise<Blob> {
  const zip = new JSZip();
  const webp = webpSupported();
  const ext = webp ? 'webp' : 'png';
  for (const [i, s] of PACK.entries()) {
    const blob = await svgToBlob(createElement(PackSticker, { event, caption: s.caption, patch: s.patch }), 512, 512, webp ? 'image/webp' : 'image/png', 0.8);
    zip.file(`${String(i + 1).padStart(2, '0')}-${slug(s.caption)}.${ext}`, blob);
  }
  zip.file('tray.png', await svgToBlob(createElement(TrayIcon, { event }), 96, 96));
  zip.file('HOW-TO-ADD.txt', [
    `${event.mascot.name || 'Mascot'} sticker pack for ${event.name || 'your event'}`,
    '',
    'To add these to WhatsApp:',
    '1. Save this folder on your phone and unzip it.',
    '2. Open a sticker maker app (search "sticker maker for WhatsApp" in your app store).',
    '3. Create a new pack, add the sticker images and use tray.png as the pack icon.',
    '4. Tap "Add to WhatsApp".',
  ].join('\n'));
  return zip.generateAsync({ type: 'blob' });
}

export async function downloadStickerPack(event: EventKit) {
  downloadBlob(await stickerPackZip(event), `${slug(event.mascot.name || 'mascot')}-stickers.zip`);
}
