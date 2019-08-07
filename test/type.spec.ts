const { type } = require('../dist/common')

test('type', () => {
    expect(type(1)).toBe('number')
    expect(type('')).toBe('string')
    expect(type(Object)).toBe('function')
    expect(type(null)).toBe('null')
    expect(type(undefined)).toBe('undefined')
    expect(type(NaN)).toBe('number')
    expect(type(Array)).toBe('function')
    expect(type([])).toBe('array')
})