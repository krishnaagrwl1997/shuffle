import type { Mascot as MascotT, MascotAccessory, MascotBody, MascotEyes, MascotMouth } from '../lib/types';

/** All mascot parts share one 120 × 120 canvas; the face sits around (60, 66). */
const BODIES: Record<MascotBody, string> = {
  blob: 'M60 24 C88 24 104 42 104 68 C104 94 86 106 60 106 C34 106 16 94 16 68 C16 42 32 24 60 24Z',
  bean: 'M60 20 C84 20 96 38 96 64 C96 94 82 108 60 108 C38 108 24 94 24 64 C24 38 36 20 60 20Z',
  drop: 'M60 16 C70 36 100 50 100 76 C100 96 82 108 60 108 C38 108 20 96 20 76 C20 50 50 36 60 16Z',
  cloud: 'M32 104 C16 104 12 88 21 80 C11 70 19 52 33 55 C33 39 51 31 60 41 C70 29 92 35 90 53 C104 53 110 71 99 80 C108 90 102 104 88 104Z',
};
/** Where hats and crowns sit: the top of each body. */
const TOP: Record<MascotBody, number> = { blob: 26, bean: 22, drop: 30, cloud: 40 };

const INK = '#1D1B22';

export const BODY_OPTIONS: { value: MascotBody; label: string }[] = [
  { value: 'blob', label: 'Blob' },
  { value: 'bean', label: 'Bean' },
  { value: 'drop', label: 'Drop' },
  { value: 'cloud', label: 'Cloud' },
];
export const EYE_OPTIONS: { value: MascotEyes; label: string }[] = [
  { value: 'happy', label: 'Happy' },
  { value: 'dots', label: 'Dots' },
  { value: 'wink', label: 'Wink' },
  { value: 'sleepy', label: 'Sleepy' },
];
export const MOUTH_OPTIONS: { value: MascotMouth; label: string }[] = [
  { value: 'grin', label: 'Grin' },
  { value: 'smile', label: 'Smile' },
  { value: 'open', label: 'Wow' },
  { value: 'o', label: 'Ooh' },
];
export const ACCESSORY_OPTIONS: { value: MascotAccessory; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'partyhat', label: 'Party hat' },
  { value: 'shades', label: 'Shades' },
  { value: 'crown', label: 'Crown' },
  { value: 'headphones', label: 'Headphones' },
  { value: 'flower', label: 'Flower' },
];
export const MASCOT_COLORS = ['#FF8A5B', '#FFC93C', '#7BD389', '#5BC0EB', '#9B7BFF', '#FF6FA8', '#F2F2F2', '#3A3A48'];

/** Darken (amount < 0) or lighten a hex colour. */
function shade(hex: string, amount: number): string {
  const n = parseInt(hex.replace('#', ''), 16);
  const f = (c: number) => Math.max(0, Math.min(255, Math.round(c + c * amount)));
  const r = f((n >> 16) & 255), g = f((n >> 8) & 255), b = f(n & 255);
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}

function Eyes({ kind }: { kind: MascotEyes }) {
  const stroke = { stroke: INK, strokeWidth: 3.2, strokeLinecap: 'round' as const, fill: 'none' };
  switch (kind) {
    case 'dots':
      return (<g fill={INK}><circle cx="48" cy="63" r="4.2" /><circle cx="72" cy="63" r="4.2" /><circle cx="49.5" cy="61.5" r="1.3" fill="#fff" /><circle cx="73.5" cy="61.5" r="1.3" fill="#fff" /></g>);
    case 'happy':
      return (<g {...stroke}><path d="M43 65 q5 -7 10 0" /><path d="M67 65 q5 -7 10 0" /></g>);
    case 'wink':
      return (<g><circle cx="48" cy="63" r="4.2" fill={INK} /><path d="M67 64 q5 -6 10 0" {...stroke} /></g>);
    case 'sleepy':
      return (<g {...stroke}><path d="M43 62 q5 5 10 0" /><path d="M67 62 q5 5 10 0" /></g>);
  }
}

function Mouth({ kind }: { kind: MascotMouth }) {
  switch (kind) {
    case 'smile':
      return <path d="M51 76 q9 8 18 0" stroke={INK} strokeWidth="3.2" strokeLinecap="round" fill="none" />;
    case 'grin':
      return (<g><path d="M50 74 h20 q-1.5 12 -10 12 q-8.5 0 -10 -12z" fill={INK} /><path d="M54 82 q6 5 12 0 q-6 -3 -12 0z" fill="#FF6F7D" /></g>);
    case 'open':
      return (<g><ellipse cx="60" cy="80" rx="6" ry="7.5" fill={INK} /><ellipse cx="60" cy="84" rx="3.6" ry="2.6" fill="#FF6F7D" /></g>);
    case 'o':
      return <circle cx="60" cy="79" r="3.6" stroke={INK} strokeWidth="3" fill="none" />;
  }
}

function Accessory({ kind, top, accent }: { kind: MascotAccessory; top: number; accent: string }) {
  switch (kind) {
    case 'none':
      return null;
    case 'partyhat':
      return (
        <g transform={`translate(0 ${top - 28})`}>
          <path d="M47 30 L60 2 L73 30Z" fill={accent} />
          <path d="M51.5 21 L68.5 21 L70.5 25.5 L49.5 25.5Z M55.5 12 L64.5 12 L66 15.5 L54 15.5Z" fill="#fff" opacity=".7" />
          <circle cx="60" cy="3" r="4.5" fill="#FFD23F" />
        </g>
      );
    case 'crown':
      return (
        <g transform={`translate(0 ${top - 28})`}>
          <path d="M43 30 L45 12 L53 21 L60 7 L67 21 L75 12 L77 30Z" fill="#F5B700" stroke="#C98E00" strokeWidth="1.5" strokeLinejoin="round" />
          <circle cx="60" cy="24" r="2.6" fill="#E63946" />
        </g>
      );
    case 'shades':
      return (
        <g>
          <rect x="37" y="56" width="20" height="13" rx="5" fill={INK} />
          <rect x="63" y="56" width="20" height="13" rx="5" fill={INK} />
          <path d="M57 60 h6" stroke={INK} strokeWidth="3" />
          <path d="M41 59 l5 0" stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity=".6" />
        </g>
      );
    case 'headphones':
      return (
        <g>
          <path d="M22 66 C22 26 98 26 98 66" stroke={INK} strokeWidth="5" fill="none" strokeLinecap="round" />
          <rect x="14" y="56" width="14" height="22" rx="6" fill={accent} stroke={INK} strokeWidth="2.5" />
          <rect x="92" y="56" width="14" height="22" rx="6" fill={accent} stroke={INK} strokeWidth="2.5" />
        </g>
      );
    case 'flower':
      return (
        <g transform={`translate(82 ${top + 6})`}>
          {[0, 72, 144, 216, 288].map((a) => (
            <ellipse key={a} cx="0" cy="-7" rx="5" ry="7.5" fill="#FF6FA8" transform={`rotate(${a})`} />
          ))}
          <circle r="4.5" fill="#FFD23F" />
        </g>
      );
  }
}

interface Props {
  mascot: MascotT;
  size?: number;
  accent?: string;
  className?: string;
}

/** An original, parametric mascot. Every part is a simple shape, so it prints cleanly as a sticker. */
export function Mascot({ mascot, size = 120, accent = '#FF5A5F', className }: Props) {
  const top = TOP[mascot.body];
  const dark = shade(mascot.color, -0.25);
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 120 120" width={size} height={size} role="img" aria-label={`${mascot.name || 'Event'} mascot`}>
      <ellipse cx="60" cy="112" rx="30" ry="4" fill="#000" opacity=".12" />
      <ellipse cx="47" cy="106" rx="8" ry="5" fill={dark} />
      <ellipse cx="73" cy="106" rx="8" ry="5" fill={dark} />
      <path d={BODIES[mascot.body]} fill={mascot.color} stroke={dark} strokeWidth="2.5" />
      <path d="M34 50 q6 -14 20 -18" stroke="#fff" strokeWidth="5" strokeLinecap="round" fill="none" opacity=".35" />
      {mascot.cheeks && (
        <g fill="#FF6F7D" opacity=".45">
          <ellipse cx="38" cy="74" rx="6" ry="4" />
          <ellipse cx="82" cy="74" rx="6" ry="4" />
        </g>
      )}
      {mascot.accessory !== 'shades' && <Eyes kind={mascot.eyes} />}
      <Mouth kind={mascot.mouth} />
      <Accessory kind={mascot.accessory} top={top} accent={accent} />
    </svg>
  );
}
