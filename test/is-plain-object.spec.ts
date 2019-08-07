const { isPlainObject } = require('../dist/common')


test('isPlainObject', () => {
    expect(isPlainObject(1)).toBe(false)
    expect(isPlainObject('')).toBe(false)
    expect(isPlainObject(null)).toBe(false)
    expect(isPlainObject(undefined)).toBe(false)
    expect(isPlainObject(NaN)).toBe(false)
    expect(isPlainObject(Array)).toBe(false)
    expect(isPlainObject([])).toBe(false)
    expect(isPlainObject({})).toBe(true)
})
