export type StyleKey = 'playful' | 'elegant' | 'festive' | 'minimal';
export type StickerKind = 'badge' | 'burst' | 'ticket' | 'heart' | 'mascot';
export type Rsvp = 'yes' | 'no' | null;
export type Diet = 'veg' | 'nonveg' | 'jain' | 'vegan';
export type LangKey = 'en' | 'hi' | 'kn' | 'ta' | 'te' | 'mr' | 'bn';
export type TemplateKey = 'blank' | 'offsite' | 'fest' | 'wedding' | 'birthday';

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

/** One part of a multi-day event, e.g. Mehendi, Sangeet, Reception. */
export interface EventFunction {
  id: string;
  name: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  venue: string;
}

export interface Guest {
  id: string;
  name: string;
  note: string; // becomes the line on their card
  rsvp: Rsvp; // overall: yes if coming to anything
  sticker: StickerKind | null;
  /** Function ids this guest is invited to. Empty means all of them. */
  functionIds: string[];
  /** Per-function replies when the event has functions. */
  fnRsvp: Record<string, Rsvp>;
  plusOnes: number;
  diet: Diet | null;
  message: string; // note to the host
  sentAt: number | null;
  remindedAt: number | null;
  checkedIn: boolean;
}

export interface EventKit {
  id: string;
  template: TemplateKey;
  name: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  venue: string;
  style: StyleKey;
  logo: string | null; // data URL
  mascot: Mascot;
  functions: EventFunction[];
  hosts: string[];
  travel: string; // travel and stay details shown on the invite
  language: LangKey;
  allowPlusOnes: boolean;
  askDiet: boolean;
  thankYou: string; // shown on the memory pack after the event
  printEnabled: boolean;
  guests: Guest[];
  createdAt: number;
}

export interface CardFace {
  rank: string;
  suit: '♠' | '♥' | '♦' | '♣';
  red: boolean;
}
