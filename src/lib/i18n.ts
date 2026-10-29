import type { Diet, LangKey } from './types';

/** Guest-facing invite text. The organiser's screens stay in English. */
export interface InviteStrings {
  hey: (name: string) => string;
  revealCta: string;
  tapCard: string;
  cardBelow: string;
  pickSticker: string;
  willYouBeThere: string;
  imIn: string;
  cantMake: string;
  youreIn: (name: string) => string;
  missYou: string;
  changeReply: string;
  bringing: string;
  diet: string;
  diets: Record<Diet, string>;
  note: string;
  calendar: string;
  travel: string;
  hostedBy: string;
  door: string;
  saveCard: string;
  stickers: string;
  matchHint: string;
  functions: string;
  yes: string;
  no: string;
}

export const LANGUAGES: { key: LangKey; name: string; native: string }[] = [
  { key: 'en', name: 'English', native: 'English' },
  { key: 'hi', name: 'Hindi', native: 'हिन्दी' },
  { key: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
  { key: 'ta', name: 'Tamil', native: 'தமிழ்' },
  { key: 'te', name: 'Telugu', native: 'తెలుగు' },
  { key: 'mr', name: 'Marathi', native: 'मराठी' },
  { key: 'bn', name: 'Bengali', native: 'বাংলা' },
];

const en: InviteStrings = {
  hey: (n) => `Hey ${n},`,
  revealCta: 'Tap to see your card',
  tapCard: 'Tap the card to flip it',
  cardBelow: 'Your card is below',
  pickSticker: 'Pick your sticker',
  willYouBeThere: 'Will you be there?',
  imIn: "I'm in",
  cantMake: "Can't make it",
  youreIn: (n) => `You're in, ${n}! Your card and sticker will be waiting at the venue.`,
  missYou: "Thanks for letting us know. We'll miss you.",
  changeReply: 'Change reply',
  bringing: 'Bringing anyone?',
  diet: 'Food preference',
  diets: { veg: 'Veg', nonveg: 'Non-veg', jain: 'Jain', vegan: 'Vegan' },
  note: 'Note for the host',
  calendar: 'Add to calendar',
  travel: 'Travel and stay',
  hostedBy: 'Hosted by',
  door: 'Show this at the door',
  saveCard: 'Save my card',
  stickers: 'Get the sticker pack',
  matchHint: 'At the event: find the others who share your card number',
  functions: 'Which ones will you come to?',
  yes: 'Yes',
  no: 'No',
};

const hi: InviteStrings = {
  hey: (n) => `नमस्ते ${n},`,
  revealCta: 'अपना कार्ड देखने के लिए टैप करें',
  tapCard: 'कार्ड पलटने के लिए उस पर टैप करें',
  cardBelow: 'आपका कार्ड नीचे है',
  pickSticker: 'अपना स्टिकर चुनें',
  willYouBeThere: 'क्या आप आएँगे?',
  imIn: 'ज़रूर आएँगे',
  cantMake: 'नहीं आ पाएँगे',
  youreIn: (n) => `बढ़िया, ${n}! आपका कार्ड और स्टिकर वेन्यू पर आपका इंतज़ार करेंगे।`,
  missYou: 'बताने के लिए धन्यवाद। हम आपको याद करेंगे।',
  changeReply: 'जवाब बदलें',
  bringing: 'साथ में कितने लोग?',
  diet: 'खाने की पसंद',
  diets: { veg: 'शाकाहारी', nonveg: 'मांसाहारी', jain: 'जैन', vegan: 'वीगन' },
  note: 'मेज़बान के लिए संदेश',
  calendar: 'कैलेंडर में जोड़ें',
  travel: 'यात्रा और ठहरना',
  hostedBy: 'मेज़बान',
  door: 'प्रवेश पर यह दिखाएँ',
  saveCard: 'मेरा कार्ड सेव करें',
  stickers: 'स्टिकर पैक पाएँ',
  matchHint: 'इवेंट में: अपने कार्ड के नंबर वाले बाकी लोगों को ढूँढें',
  functions: 'किन कार्यक्रमों में आएँगे?',
  yes: 'हाँ',
  no: 'नहीं',
};

const kn: InviteStrings = {
  hey: (n) => `ನಮಸ್ಕಾರ ${n},`,
  revealCta: 'ನಿಮ್ಮ ಕಾರ್ಡ್ ನೋಡಲು ಟ್ಯಾಪ್ ಮಾಡಿ',
  tapCard: 'ಕಾರ್ಡ್ ತಿರುಗಿಸಲು ಅದರ ಮೇಲೆ ಟ್ಯಾಪ್ ಮಾಡಿ',
  cardBelow: 'ನಿಮ್ಮ ಕಾರ್ಡ್ ಕೆಳಗಿದೆ',
  pickSticker: 'ನಿಮ್ಮ ಸ್ಟಿಕರ್ ಆಯ್ಕೆಮಾಡಿ',
  willYouBeThere: 'ನೀವು ಬರುತ್ತೀರಾ?',
  imIn: 'ಖಂಡಿತ ಬರುತ್ತೇನೆ',
  cantMake: 'ಬರಲು ಆಗುವುದಿಲ್ಲ',
  youreIn: (n) => `ಸೂಪರ್, ${n}! ನಿಮ್ಮ ಕಾರ್ಡ್ ಮತ್ತು ಸ್ಟಿಕರ್ ಸ್ಥಳದಲ್ಲಿ ಕಾಯುತ್ತಿರುತ್ತವೆ.`,
  missYou: 'ತಿಳಿಸಿದ್ದಕ್ಕೆ ಧನ್ಯವಾದಗಳು. ನಿಮ್ಮನ್ನು ಮಿಸ್ ಮಾಡಿಕೊಳ್ಳುತ್ತೇವೆ.',
  changeReply: 'ಉತ್ತರ ಬದಲಿಸಿ',
  bringing: 'ಜೊತೆಗೆ ಎಷ್ಟು ಜನ?',
  diet: 'ಊಟದ ಆಯ್ಕೆ',
  diets: { veg: 'ಸಸ್ಯಾಹಾರ', nonveg: 'ಮಾಂಸಾಹಾರ', jain: 'ಜೈನ', vegan: 'ವೀಗನ್' },
  note: 'ಆತಿಥೇಯರಿಗೆ ಸಂದೇಶ',
  calendar: 'ಕ್ಯಾಲೆಂಡರ್‌ಗೆ ಸೇರಿಸಿ',
  travel: 'ಪ್ರಯಾಣ ಮತ್ತು ವಸತಿ',
  hostedBy: 'ಆತಿಥೇಯರು',
  door: 'ಪ್ರವೇಶದಲ್ಲಿ ಇದನ್ನು ತೋರಿಸಿ',
  saveCard: 'ನನ್ನ ಕಾರ್ಡ್ ಉಳಿಸಿ',
  stickers: 'ಸ್ಟಿಕರ್ ಪ್ಯಾಕ್ ಪಡೆಯಿರಿ',
  matchHint: 'ಕಾರ್ಯಕ್ರಮದಲ್ಲಿ: ನಿಮ್ಮ ಕಾರ್ಡ್ ಸಂಖ್ಯೆಯ ಇತರರನ್ನು ಹುಡುಕಿ',
  functions: 'ಯಾವ ಕಾರ್ಯಕ್ರಮಗಳಿಗೆ ಬರುತ್ತೀರಿ?',
  yes: 'ಹೌದು',
  no: 'ಇಲ್ಲ',
};

const ta: InviteStrings = {
  hey: (n) => `வணக்கம் ${n},`,
  revealCta: 'உங்கள் கார்டைப் பார்க்க தட்டவும்',
  tapCard: 'கார்டைத் திருப்ப அதைத் தட்டவும்',
  cardBelow: 'உங்கள் கார்டு கீழே உள்ளது',
  pickSticker: 'உங்கள் ஸ்டிக்கரைத் தேர்ந்தெடுக்கவும்',
  willYouBeThere: 'நீங்கள் வருவீர்களா?',
  imIn: 'கண்டிப்பாக வருவேன்',
  cantMake: 'வர இயலாது',
  youreIn: (n) => `அருமை, ${n}! உங்கள் கார்டும் ஸ்டிக்கரும் நிகழ்விடத்தில் காத்திருக்கும்.`,
  missYou: 'தெரிவித்ததற்கு நன்றி. உங்களை மிஸ் செய்வோம்.',
  changeReply: 'பதிலை மாற்றவும்',
  bringing: 'உங்களுடன் எத்தனை பேர்?',
  diet: 'உணவு விருப்பம்',
  diets: { veg: 'சைவம்', nonveg: 'அசைவம்', jain: 'ஜெயின்', vegan: 'வீகன்' },
  note: 'நடத்துபவருக்கு ஒரு செய்தி',
  calendar: 'நாட்காட்டியில் சேர்க்கவும்',
  travel: 'பயணம் மற்றும் தங்குமிடம்',
  hostedBy: 'நடத்துபவர்',
  door: 'நுழைவாயிலில் இதைக் காட்டவும்',
  saveCard: 'என் கார்டைச் சேமி',
  stickers: 'ஸ்டிக்கர் பேக்கைப் பெறுக',
  matchHint: 'நிகழ்வில்: உங்கள் கார்டு எண் உள்ள மற்றவர்களைக் கண்டுபிடியுங்கள்',
  functions: 'எந்த நிகழ்ச்சிகளுக்கு வருவீர்கள்?',
  yes: 'ஆம்',
  no: 'இல்லை',
};

const te: InviteStrings = {
  hey: (n) => `నమస్తే ${n},`,
  revealCta: 'మీ కార్డు చూడటానికి ట్యాప్ చేయండి',
  tapCard: 'కార్డు తిప్పడానికి దానిపై ట్యాప్ చేయండి',
  cardBelow: 'మీ కార్డు కింద ఉంది',
  pickSticker: 'మీ స్టిక్కర్ ఎంచుకోండి',
  willYouBeThere: 'మీరు వస్తారా?',
  imIn: 'తప్పకుండా వస్తాను',
  cantMake: 'రాలేను',
  youreIn: (n) => `అద్భుతం, ${n}! మీ కార్డు, స్టిక్కర్ వేదిక వద్ద మీ కోసం ఎదురుచూస్తాయి.`,
  missYou: 'తెలియజేసినందుకు ధన్యవాదాలు. మిమ్మల్ని మిస్ అవుతాం.',
  changeReply: 'జవాబు మార్చండి',
  bringing: 'మీతో ఎంత మంది?',
  diet: 'ఆహార ఎంపిక',
  diets: { veg: 'శాకాహారం', nonveg: 'మాంసాహారం', jain: 'జైన్', vegan: 'వీగన్' },
  note: 'ఆతిథ్యం ఇచ్చేవారికి సందేశం',
  calendar: 'క్యాలెండర్‌కు జోడించండి',
  travel: 'ప్రయాణం మరియు బస',
  hostedBy: 'ఆతిథ్యం',
  door: 'ప్రవేశం వద్ద దీన్ని చూపించండి',
  saveCard: 'నా కార్డు సేవ్ చేయి',
  stickers: 'స్టిక్కర్ ప్యాక్ పొందండి',
  matchHint: 'ఈవెంట్‌లో: మీ కార్డు నంబర్ ఉన్న ఇతరులను కనుగొనండి',
  functions: 'ఏ కార్యక్రమాలకు వస్తారు?',
  yes: 'అవును',
  no: 'కాదు',
};

const mr: InviteStrings = {
  hey: (n) => `नमस्कार ${n},`,
  revealCta: 'तुमचे कार्ड पाहण्यासाठी टॅप करा',
  tapCard: 'कार्ड उलटण्यासाठी त्यावर टॅप करा',
  cardBelow: 'तुमचे कार्ड खाली आहे',
  pickSticker: 'तुमचा स्टिकर निवडा',
  willYouBeThere: 'तुम्ही येणार का?',
  imIn: 'नक्की येणार',
  cantMake: 'येऊ शकणार नाही',
  youreIn: (n) => `छान, ${n}! तुमचे कार्ड आणि स्टिकर कार्यक्रमस्थळी तुमची वाट पाहतील.`,
  missYou: 'कळवल्याबद्दल धन्यवाद. आम्हाला तुमची आठवण येईल.',
  changeReply: 'उत्तर बदला',
  bringing: 'तुमच्यासोबत किती जण?',
  diet: 'जेवणाची आवड',
  diets: { veg: 'शाकाहारी', nonveg: 'मांसाहारी', jain: 'जैन', vegan: 'व्हीगन' },
  note: 'यजमानांसाठी संदेश',
  calendar: 'कॅलेंडरमध्ये जोडा',
  travel: 'प्रवास आणि राहण्याची सोय',
  hostedBy: 'यजमान',
  door: 'प्रवेशद्वारावर हे दाखवा',
  saveCard: 'माझे कार्ड सेव्ह करा',
  stickers: 'स्टिकर पॅक मिळवा',
  matchHint: 'कार्यक्रमात: तुमच्या कार्डचा नंबर असलेले इतर लोक शोधा',
  functions: 'कोणत्या कार्यक्रमांना येणार?',
  yes: 'हो',
  no: 'नाही',
};

const bn: InviteStrings = {
  hey: (n) => `নমস্কার ${n},`,
  revealCta: 'আপনার কার্ড দেখতে ট্যাপ করুন',
  tapCard: 'কার্ড উল্টাতে এতে ট্যাপ করুন',
  cardBelow: 'আপনার কার্ড নিচে আছে',
  pickSticker: 'আপনার স্টিকার বেছে নিন',
  willYouBeThere: 'আপনি আসবেন তো?',
  imIn: 'অবশ্যই আসব',
  cantMake: 'আসতে পারব না',
  youreIn: (n) => `দারুণ, ${n}! আপনার কার্ড আর স্টিকার অনুষ্ঠানস্থলে অপেক্ষা করবে।`,
  missYou: 'জানানোর জন্য ধন্যবাদ। আপনাকে মিস করব।',
  changeReply: 'উত্তর বদলান',
  bringing: 'সঙ্গে কতজন?',
  diet: 'খাবারের পছন্দ',
  diets: { veg: 'নিরামিষ', nonveg: 'আমিষ', jain: 'জৈন', vegan: 'ভিগান' },
  note: 'আয়োজকের জন্য বার্তা',
  calendar: 'ক্যালেন্ডারে যোগ করুন',
  travel: 'যাতায়াত ও থাকা',
  hostedBy: 'আয়োজক',
  door: 'প্রবেশপথে এটি দেখান',
  saveCard: 'আমার কার্ড সেভ করুন',
  stickers: 'স্টিকার প্যাক নিন',
  matchHint: 'অনুষ্ঠানে: আপনার কার্ডের নম্বরওয়ালা বাকিদের খুঁজে নিন',
  functions: 'কোন কোন অনুষ্ঠানে আসবেন?',
  yes: 'হ্যাঁ',
  no: 'না',
};

const TABLE: Record<LangKey, InviteStrings> = { en, hi, kn, ta, te, mr, bn };

export function t(lang: LangKey): InviteStrings {
  return TABLE[lang] ?? en;
}
