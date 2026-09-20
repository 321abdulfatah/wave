import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import {
  safeIn,
  safeAcross,
  why,
  correctHandedness,
  locales,
  LOCALES,
  GLOBALLY_UNSAFE,
  PAN_CULTURAL,
} from '../src/index.js'

describe('the globally unsafe set', () => {
  test('the fist is never offered anywhere', () => {
    // 98.15% "Threat" pan-culturally. If this ever regresses, a product using
    // this library starts reading a threat display as the word "no".
    for (const locale of locales) {
      assert.ok(!safeIn(locale).includes('fist'), `fist leaked into ${locale}`)
    }
  })

  test('every globally unsafe entry explains itself', () => {
    for (const [id, rule] of Object.entries(GLOBALLY_UNSAFE)) {
      assert.ok(rule.reason.length > 60, `${id} has no real reason`)
      assert.ok(['offensive', 'impolite', 'ambiguous', 'political'].includes(rule.severity))
      assert.ok(['peer-reviewed', 'institutional', 'tertiary', 'unverified'].includes(rule.evidence))
    }
  })

  test('why() reports a global block even when asked about a specific locale', () => {
    const r = why('en-US', 'fist')
    assert.equal(r.locale, '*')
    assert.equal(r.use, 'thumbs_down')
  })
})

describe('per-locale exclusions', () => {
  test('Greece withholds the open palm — it is the moútza', () => {
    assert.ok(!safeIn('el-GR').includes('open_palm'))
    assert.equal(why('el-GR', 'open_palm').use, 'index_up')
  })

  test('the Greek substitute is not itself a palm-forward hand', () => {
    // The trap this library exists to prevent: the fingers-together palm that
    // travel guides recommend as the "safe" version is a named milder insult.
    const sub = why('el-GR', 'open_palm').use
    assert.notEqual(sub, 'open_palm')
    assert.notEqual(sub, 'present')
  })

  test('Turkey withholds the purse hand, which elsewhere means wait', () => {
    assert.ok(!safeIn('tr-TR').includes('purse'))
    assert.ok(safeIn('ar-SA').includes('purse'))
  })

  test('Japan withholds the wave, which means "no" there', () => {
    assert.ok(!safeIn('ja-JP').includes('wave'))
    assert.ok(safeIn('en-US').includes('wave'))
  })

  test('pointing diverges within Arabic — there is no pan-Arab rule', () => {
    assert.ok(!safeIn('ar-SA').includes('present'))
    assert.ok(safeIn('ar-EG').includes('present'))
  })

  test('every locale rule carries a reason, a severity and an evidence grade', () => {
    for (const [code, spec] of Object.entries(LOCALES)) {
      for (const [gesture, rule] of Object.entries(spec.blocked)) {
        assert.ok(rule.reason.length > 40, `${code}/${gesture} reason too thin`)
        assert.ok(rule.severity, `${code}/${gesture} has no severity`)
        assert.ok(rule.evidence, `${code}/${gesture} has no evidence grade`)
      }
    }
  })

  test('unverified claims are labelled as such rather than asserted', () => {
    // Nigeria and Greece's wave are the two acted-on-but-unsourced entries. If
    // either is ever upgraded, it must be because a source was found.
    assert.equal(why('en-NG', 'open_palm').evidence, 'unverified')
    assert.equal(why('el-GR', 'wave').evidence, 'unverified')
  })
})

describe('the intersection', () => {
  test('a single locale matches safeIn', () => {
    assert.deepEqual(safeAcross(['ja-JP']).safe, safeIn('ja-JP'))
  })

  test('adding a locale never grows the safe set', () => {
    const one = safeAcross(['en-US']).safe.length
    const two = safeAcross(['en-US', 'el-GR']).safe.length
    const three = safeAcross(['en-US', 'el-GR', 'ar-SA']).safe.length
    assert.ok(two <= one, 'adding Greece grew the set')
    assert.ok(three <= two, 'adding the Gulf grew the set')
  })

  test('serving Athens and Cairo is genuinely more constrained than Seattle alone', () => {
    const seattle = safeAcross(['en-US']).safe
    const both = safeAcross(['el-GR', 'ar-EG']).safe
    assert.ok(both.length < seattle.length)
  })

  test('the head gestures survive every intersection', () => {
    // The whole point: nod and shake are the two most recognised emblems on
    // earth and nothing in the corpus objects to either.
    const all = safeAcross(locales).safe
    assert.ok(all.includes('nod'))
    assert.ok(all.includes('shake'))
  })

  test('exclusions name the locale that caused them', () => {
    const { excluded } = safeAcross(['en-US', 'el-GR'])
    const palm = excluded.find((e) => e.gesture === 'open_palm')
    assert.equal(palm.locale, 'el-GR')
  })

  test('an empty list is an error, not an empty answer', () => {
    assert.throws(() => safeAcross([]), /at least one locale/)
  })

  test('an unknown locale fails loudly rather than defaulting', () => {
    // Silently falling back to a default vocabulary is how a product ships the
    // wrong gestures to a country it never tested.
    assert.throws(() => safeIn('xx-XX'), /Unknown locale/)
  })
})

describe('handedness', () => {
  test('a mirrored frame passes through', () => {
    assert.equal(correctHandedness('Left', true), 'Left')
  })

  test('an unmirrored frame is swapped', () => {
    // MediaPipe assumes a selfie camera. A doorbell is not one.
    assert.equal(correctHandedness('Left', false), 'Right')
    assert.equal(correctHandedness('Right', false), 'Left')
  })
})

describe('the pan-cultural baseline', () => {
  test('the two highest-recognition emblems are head gestures, not hands', () => {
    assert.equal(PAN_CULTURAL.nod.source, 'head')
    assert.equal(PAN_CULTURAL.shake.source, 'head')
    assert.ok(PAN_CULTURAL.nod.recognition > 0.98)
    assert.ok(PAN_CULTURAL.shake.recognition > 0.98)
  })
})

// The README states a locale count, and a README that drifts from the data is
// how a reader stops trusting the rest of it.
test('the documented locale count matches the data', () => {
  const readme = readFileSync(new URL('../README.md', import.meta.url), 'utf8')
  const claimed = readme.match(/\*\*(\d+) locales\*\*/)
  assert.ok(claimed, 'README should state a locale count')
  assert.equal(Number(claimed[1]), Object.keys(LOCALES).length)
})
