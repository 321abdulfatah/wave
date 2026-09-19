/**
 * String catalogue.
 *
 * Two registers live here and they are not interchangeable:
 *
 *  - **UI strings** are read by the resident, in their home. Plain and warm.
 *  - **Door strings** are spoken to a stranger at the door, on the household's
 *    behalf. Formal, and per-locale in a way the UI is not — the politeness
 *    research in docs/gesture-research-mena.md and locale-research-fr-us-ke.md
 *    is prescriptive here, not advisory.
 *
 * The Arabic is written, not machine-translated. Three decisions worth naming:
 *
 *  1. **No السلام عليكم.** The fiqh sources concern person-to-person greeting
 *     between people of known faith. A door agent greets whoever arrives. A
 *     religiously-marked greeting carries mismatch risk in both directions, and
 *     the research flagged this as needing a human, not a search. أهلاً is
 *     warm and carries no such marking.
 *  2. **Plural-as-respect throughout** — تفضّلوا, اتركوه, شكراً لكم. Age-neutral
 *     deference, which matters because the camera cannot know who it is talking
 *     to and must not try.
 *  3. **No forced binary.** Egyptians "typically avoid saying no directly", so
 *     the decline path is phrased as deferral rather than refusal.
 */

export type Lang = 'en' | 'ar'

export interface Strings {
  // chrome
  tagline: string
  live: string
  reconnecting: string
  watchingRing: string
  mockData: string
  devices: (n: number) => string

  // the door event
  atDoorNow: string
  leftAtDoor: string
  messageTaken: string
  residentNotified: string
  declined: string
  isAtThe: (who: string, device: string) => string
  nothingAtDoor: string
  nothingAtDoorHint: string
  triggeredBy: string
  confidence: string

  // conversation
  theDoorSaid: string
  visitorGestured: string
  listeningForGesture: string
  whyWaveDidThat: string
  recent: string

  // captions
  whatVisitorSaid: string
  captionSubtitle: string
  captioning: string
  nothingSaidYet: string
  checkingBackend: string

  // panels
  camera: string
  webcam: string
  ringLive: string
  start: string
  stop: string
  gestureVocabulary: string
  gestureSubtitle: string
  ringTheDoorbell: string
  whoWaveRemembers: string
  languageAndCulture: string
  whatYouRead: string
  whoArrives: string
  whoArrivesHint: string
  gesturesSafe: (n: number) => string
  withheld: (n: number) => string

  // what the door says to a visitor
  door: {
    greetCourier: string
    greetKnown: string
    greetStranger: string
    greetUnknown: string
    directToDropPoint: string
    confirmed: string
    messageSaved: string
    holdOn: string
    closeDeclined: string
    notUnderstood: string
    givingUp: string
  }
}

const en: Strings = {
  tagline: 'Your door, answered without a word.',
  live: 'Live',
  reconnecting: 'Reconnecting',
  watchingRing: 'Watching Ring',
  mockData: 'Mock data',
  devices: (n) => `${n} devices`,

  atDoorNow: 'At the door now',
  leftAtDoor: 'Left at the door',
  messageTaken: 'Message taken',
  residentNotified: 'You were notified',
  declined: 'Turned away',
  isAtThe: (who, device) => `${who} is at the ${device}.`,
  nothingAtDoor: 'Nothing at the door.',
  nothingAtDoorHint: 'Ring the doorbell from the panel on the right.',
  triggeredBy: 'triggered by',
  confidence: 'confidence',

  theDoorSaid: 'The door said',
  visitorGestured: 'Visitor gestured',
  listeningForGesture: 'listening for a gesture…',
  whyWaveDidThat: 'Why WAVE did that',
  recent: 'Recent',

  whatVisitorSaid: 'What the visitor said',
  captionSubtitle: 'Ring’s own docs say the live view carries no audio. It carries Opus.',
  captioning: 'captioning',
  nothingSaidYet: 'Nothing said yet.',
  checkingBackend: 'Checking the transcription backend…',

  camera: 'Camera',
  webcam: 'Webcam',
  ringLive: 'Ring live',
  start: 'Start',
  stop: 'Stop',
  gestureVocabulary: 'Gesture vocabulary',
  gestureSubtitle: 'The visitor answers with their hands.',
  ringTheDoorbell: 'Ring the doorbell',
  whoWaveRemembers: 'Who WAVE remembers',
  languageAndCulture: 'Language & culture',
  whatYouRead: 'What you read',
  whoArrives: 'Who arrives at your door',
  whoArrivesHint:
    'This cannot be detected. Your address says where the door is, not where the person standing ' +
    'at it is from — so the door asks you, and uses only the gestures that are safe for everyone ' +
    'you pick.',
  gesturesSafe: (n) => `${n} gestures safe`,
  withheld: (n) => `${n} withheld`,

  door: {
    greetCourier:
      'Hello. The resident here is Deaf and cannot come to the door. I can help — are you delivering something?',
    greetKnown:
      'Hello again. The resident is not able to come to the door, but I will let them know you are here.',
    greetStranger: 'Hello. Nobody can come to the door right now. Are you expected?',
    greetUnknown: 'Hello. The resident here is Deaf. Give me a moment and I will help.',
    directToDropPoint:
      'Thank you. Please leave it inside the porch, out of the rain, and show me an open hand once it is placed.',
    confirmed: 'Got it, I have a photo. Have a good day.',
    messageSaved: 'Understood. I have saved a clip and the resident will see it. Thank you for waiting.',
    holdOn: 'No problem, take your time. I am still here.',
    closeDeclined: 'Alright, nothing to do here. Take care.',
    notUnderstood: 'I could not see that. Nod for yes, or shake your head for no.',
    givingUp: 'I could not read a reply. I have saved a clip for the resident. Goodbye.',
  },
}

const ar: Strings = {
  tagline: 'بابكم يُجيب… دون كلمة واحدة.',
  live: 'متصل',
  reconnecting: 'يعيد الاتصال',
  watchingRing: 'يراقب Ring',
  mockData: 'بيانات تجريبية',
  devices: (n) => `${n} أجهزة`,

  atDoorNow: 'عند الباب الآن',
  leftAtDoor: 'تُرك عند الباب',
  messageTaken: 'أُخذت رسالة',
  residentNotified: 'أُبلغتم',
  declined: 'انصرف',
  // Arabic prefers the predicate first here; a literal mirror of the English
  // reads as a translated label rather than a sentence.
  isAtThe: (who, device) => `${who} عند ${device}.`,
  nothingAtDoor: 'لا أحد عند الباب.',
  nothingAtDoorHint: 'اضغطوا الجرس من اللوحة الجانبية.',
  triggeredBy: 'بدأ بـ',
  confidence: 'ثقة',

  theDoorSaid: 'قال الباب',
  visitorGestured: 'أشار الزائر',
  listeningForGesture: 'ينتظر إشارة…',
  whyWaveDidThat: 'لماذا فعل WAVE ذلك',
  recent: 'الأحدث',

  whatVisitorSaid: 'ما قاله الزائر',
  captionSubtitle: 'وثائق Ring تقول إن البث بلا صوت. البث يحمل Opus.',
  captioning: 'يكتب',
  nothingSaidYet: 'لم يُقل شيء بعد.',
  checkingBackend: 'يتحقق من خدمة الكتابة…',

  camera: 'الكاميرا',
  webcam: 'كاميرا الجهاز',
  ringLive: 'بث Ring',
  start: 'ابدأ',
  stop: 'أوقف',
  gestureVocabulary: 'مفردات الإشارة',
  gestureSubtitle: 'الزائر يجيب بيديه.',
  ringTheDoorbell: 'اضغط الجرس',
  whoWaveRemembers: 'من يتذكّرهم WAVE',
  languageAndCulture: 'اللغة والثقافة',
  whatYouRead: 'ما تقرؤونه أنتم',
  whoArrives: 'من يصل إلى بابكم',
  whoArrivesHint:
    'هذا لا يمكن كشفه. عنوانكم يدلّ على مكان الباب، لا على أصل من يقف أمامه — لذلك يسألكم الباب، ' +
    'ثم يستخدم الإشارات الآمنة لدى كل من اخترتم فقط.',
  gesturesSafe: (n) => `${n} إشارات آمنة`,
  withheld: (n) => `حُجبت ${n}`,

  door: {
    // No religiously-marked greeting: the door does not know who is arriving.
    greetCourier:
      'أهلاً. المقيم هنا من الصمّ ولا يستطيع الوصول إلى الباب. أستطيع مساعدتكم — هل لديكم توصيلة؟',
    greetKnown: 'أهلاً بعودتكم. المقيم لا يستطيع الوصول إلى الباب، لكنني سأُعلمه بحضوركم.',
    greetStranger: 'أهلاً. لا أحد يستطيع الوصول إلى الباب الآن. هل كنتم على موعد؟',
    greetUnknown: 'أهلاً. المقيم هنا من الصمّ. أمهلوني لحظة وسأساعدكم.',
    directToDropPoint:
      'شكراً لكم. تفضّلوا باتركه داخل المدخل بعيداً عن المطر، ثم أروني كفّاً مفتوحة حين تضعونه.',
    confirmed: 'وصلت الصورة. نهاركم سعيد.',
    messageSaved: 'فهمت. حفظتُ مقطعاً وسيراه المقيم. شكراً لانتظاركم.',
    holdOn: 'لا بأس، خذوا وقتكم. ما زلت هنا.',
    // Deferral rather than refusal — a direct "no" is dispreferred here.
    closeDeclined: 'حسناً، لا حاجة لشيء الآن. دمتم بخير.',
    notUnderstood: 'لم أتمكّن من الرؤية. أومئوا برأسكم للموافقة، أو هزّوه للرفض.',
    givingUp: 'لم أتمكّن من قراءة الرد. حفظتُ مقطعاً للمقيم. مع السلامة.',
  },
}

export const STRINGS: Record<Lang, Strings> = { en, ar }

/** Any locale code maps to the language catalogue it belongs to. */
export function stringsFor(localeCode: string): Strings {
  return localeCode.startsWith('ar') ? STRINGS.ar : STRINGS.en
}

export function langFor(localeCode: string): Lang {
  return localeCode.startsWith('ar') ? 'ar' : 'en'
}
