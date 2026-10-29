export type StyleKey = 'playful' | 'elegant' | 'festive' | 'minimal';
export type StickerKind = 'badge' | 'burst' | 'ticket' | 'heart' | 'mascot';
export type Rsvp = 'yes' | 'no' | null;

export type MascotBody = 'blob' | 'bean' | 'drop' | 'cloud';
export type MascotEyes = 'dots' | 'happy' | 'wink' | 'sleepy';
export type MascotMouth = 'smile' | 'grin' | 'open' | 'o';
export type MascotAccessory = 'none' | 'partyhat' | 'shades' | 'crown' | 'headphones' | 'flower';

export interface Mascot {
  enabled: boolean;
  name: string;
  body: MascotBody;
  color: string; // hex
  eyes: MascotEyes;
  mouth: MascotMouth;
  accessory: MascotAccessory;
  cheeks: boolean;
}

export interface Guest {
  id: string;
  name: string;
  note: string; // becomes the line on their card
  rsvp: Rsvp;
  sticker: StickerKind | null;
}

export interface EventKit {
  id: string;
  name: string;
  date: string; // YYYY-MM-DD
  venue: string;
  style: StyleKey;
  logo: string | null; // data URL
  mascot: Mascot;
  guests: Guest[];
  createdAt: number;
}

export interface CardFace {
  rank: string;
  suit: '♠' | '♥' | '♦' | '♣';
  red: boolean;
}
