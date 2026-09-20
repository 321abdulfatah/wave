# gesture-locale

**A gesture is not universal. This is the lookup table nobody had.**

If you are building a gesture interface — a kiosk, a doorbell, a car, a game — you have almost
certainly picked five hand shapes that feel obvious. Four of them are probably offensive
somewhere.

```
npm install gesture-locale
```

```js
import { safeAcross, why } from 'gesture-locale'

const { safe, excluded } = safeAcross(['en-US', 'el-GR', 'ar-SA'])

safe      // ['thumbs_up', 'thumbs_down', 'nod', 'shake', 'index_up', ...]
excluded  // [{ gesture: 'open_palm', locale: 'el-GR', severity: 'offensive', ... }]

why('el-GR', 'open_palm').reason
// "This is the moútza. The obvious fix fails: the fingers-together version is
//  the «ευγενική» moútza, a named milder form of the same insult, which several
//  travel sites recommend as the safe alternative..."
```

---

## Why this exists

Three things the research turned up that are worth knowing even if you never install this:

**The closed fist is the most dangerous gesture in the common set.** Not thumbs-up — the fist.
Matsumoto & Hwang's (2013) empirical emblem catalogue measures it as pan-cultural **"Threat" at
98.15%**. It is also triumph in Japan, the numeral 10 in China, one landmark from the obscene
Turkish fig gesture, and the terminal handshape of the *bras d'honneur* in France, Mexico and
Brazil — where the insult lives in the forearm and the second hand, neither of which a
single-hand model can see. Your classifier logs *"the visitor said no"* for an obscene gesture.

**The two most recognised emblems on earth are not hand gestures.** A head nod reads as *yes* at
98.18% and a head shake as *no* at 99.10%. If you need yes and no, a hand-only pipeline is
starting from a worse position than a face or pose model would — and the head also works for
someone holding something in both hands.

**MediaPipe's handedness label is inverted on any fixed camera.** It assumes a mirrored,
front-facing selfie image. A doorbell, a kiosk and a dashboard camera are none of those. Several
cultures reserve the left hand, and getting that backwards is worse than not implementing it:

```js
import { correctHandedness } from 'gesture-locale'
correctHandedness(mpLabel, /* frameIsMirrored */ false)
```

---

## What is in the box

- **15 locales**, each with the gestures it withholds and why.
- **A global reject set** — the fist, the OK ring, the *figa* and the Rabia sign.
- **`safeAcross()`** — the intersection. It shrinks as you add locales, which is the correct
  behaviour rather than a limitation: a system serving visitors from Athens and Cairo genuinely
  has fewer safe gestures than one serving only Seattle.
- **An evidence grade on every claim** — `peer-reviewed`, `institutional`, `tertiary` or
  `unverified`.

## On that last point

The loudest claims in this area are the worst sourced. Two widely repeated ones were **withdrawn**
during this research rather than softened:

- *"Thumbs-up is obscene in West Africa."* Traces to a 1991 travel book. Wikipedia's own
  thumb-signal article does not mention West Africa at all.
- *"The Nigerian 'waka' gesture."* The sentence asserting it carries **no citation anywhere** we
  could find, and searches of Nigerian press returned nothing.

Two entries are marked `unverified` and acted on anyway, because the cost of being wrong is
asymmetric — withholding a gesture costs a little convenience, and shipping an insult costs
someone's dignity at a stranger's door. Those two are labelled so you can make your own call.

**If you can improve the sourcing on any entry, that is the most valuable contribution you can
make.** See [SOURCES.md](SOURCES.md).

## Not a sign-language library

This handles a small set of deliberate emblems. It does not read sign language, and you should
not imply that it does. There are more than 300 sign languages, they are mutually
unintelligible, and most carry grammar on the face — non-manual markers that a hand-landmark
model cannot see at all. In some sign languages a question and a statement differ *only* by
eyebrow position.

## Tests

```
npm test
```

21 tests. The ones that matter most assert that the fist never leaks into any locale, that
adding a locale never grows the safe set, and that an unknown locale throws rather than
silently falling back to a default vocabulary — which is how a product ships the wrong gestures
to a country it never tested.

## License

MIT
