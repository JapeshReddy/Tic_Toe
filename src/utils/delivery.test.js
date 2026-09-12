import { describe, expect, it } from 'vitest'
import { buildParcels, DOT_CAP, PARCEL_KINDS } from './delivery'

// Whatever was typed, the Delivery always carries the same two Parcels in the
// same order, so the sequence reads identically for every input.
const MATRIX = [
  { name: 'both fields empty', username: '', password: '', dots: [0, 0] },
  { name: 'only the username typed', username: 'ana', password: '', dots: [3, 0] },
  { name: 'only the password typed', username: '', password: 'pw12', dots: [0, 4] },
  { name: 'both fields short', username: 'ana', password: 'pw12', dots: [3, 4] },
  {
    name: 'both fields over the cap',
    username: 'a'.repeat(12),
    password: 'b'.repeat(20),
    dots: [DOT_CAP, DOT_CAP],
  },
]

describe('buildParcels', () => {
  it('produces exactly two parcels for every input', () => {
    for (const { username, password } of MATRIX) {
      expect(buildParcels(username, password)).toHaveLength(2)
    }
  })

  it('puts the Username Parcel before the Password Parcel', () => {
    const [first, second] = buildParcels('ana', 'pw12')
    expect(first.kind).toBe(PARCEL_KINDS.USERNAME)
    expect(second.kind).toBe(PARCEL_KINDS.PASSWORD)
  })

  it('gives a short field one Dot per character', () => {
    const [username] = buildParcels('ana', '')
    expect(username.dots).toBe(3)
  })

  it('caps a long field at exactly DOT_CAP Dots', () => {
    const [, password] = buildParcels('', 'b'.repeat(20))
    expect(password.dots).toBe(DOT_CAP)
  })

  it('keeps the typed value in full when its Dots are capped', () => {
    const long = 'b'.repeat(20)
    const [, password] = buildParcels('', long)
    expect(password.value).toBe(long)
  })

  it('gives an empty field a Parcel with no Dots and invents no substitutes', () => {
    const [, password] = buildParcels('ana', '')
    expect(password.dots).toBe(0)
  })

  it('counts the Dots of both fields across the input matrix', () => {
    for (const { name, username, password, dots } of MATRIX) {
      const parcels = buildParcels(username, password)
      expect(parcels.map((parcel) => parcel.dots), name).toEqual(dots)
    }
  })
})
