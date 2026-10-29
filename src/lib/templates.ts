import type { EventKit, TemplateKey } from './types';
import { DEFAULT_MASCOT, blankEvent, uid } from './kit';

export interface Template {
  key: TemplateKey;
  name: string;
  blurb: string;
  build: () => EventKit;
}

/** Starter setups by event type: style, mascot and (for weddings) functions are pre-filled. */
export const TEMPLATES: Template[] = [
  {
    key: 'offsite',
    name: 'Team offsite',
    blurb: 'Clean look, cards as icebreakers',
    build: () => ({
      ...blankEvent(), template: 'offsite', name: 'Team Offsite', style: 'elegant',
      mascot: { ...DEFAULT_MASCOT, name: 'Bolt', color: '#5BC0EB', accessory: 'shades', eyes: 'dots', mouth: 'smile' },
      askDiet: true,
    }),
  },
  {
    key: 'fest',
    name: 'College fest',
    blurb: 'Loud colours, collectible stickers',
    build: () => ({
      ...blankEvent(), template: 'fest', name: 'Fest 2026', style: 'playful',
      mascot: { ...DEFAULT_MASCOT, name: 'Ziggy', color: '#9B7BFF', accessory: 'headphones', body: 'bean' },
    }),
  },
  {
    key: 'wedding',
    name: 'Wedding',
    blurb: 'Mehendi, sangeet and more, each with its own RSVP',
    build: () => ({
      ...blankEvent(), template: 'wedding', name: 'Riya weds Karan', style: 'festive',
      mascot: { ...DEFAULT_MASCOT, name: 'Laddoo', color: '#FFC93C', accessory: 'flower', body: 'cloud', eyes: 'happy', mouth: 'smile' },
      functions: [
        { id: uid(), name: 'Mehendi', date: '', time: '16:00', venue: '' },
        { id: uid(), name: 'Sangeet', date: '', time: '19:00', venue: '' },
        { id: uid(), name: 'Wedding', date: '', time: '10:00', venue: '' },
        { id: uid(), name: 'Reception', date: '', time: '19:30', venue: '' },
      ],
      allowPlusOnes: true, askDiet: true,
    }),
  },
  {
    key: 'birthday',
    name: 'Birthday',
    blurb: 'Small, fun, quick to send',
    build: () => ({
      ...blankEvent(), template: 'birthday', name: 'Birthday party', style: 'playful',
      mascot: { ...DEFAULT_MASCOT, name: 'Mochi', color: '#FF6FA8', accessory: 'partyhat' },
      allowPlusOnes: true,
    }),
  },
  { key: 'blank', name: 'Start from scratch', blurb: 'Pick everything yourself', build: () => blankEvent() },
];
