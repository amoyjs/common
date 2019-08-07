const { extend } = require('../dist/common')

test('extend', () => {
    const a = {
        a: 'a',
        b: 'b.b',
        c: {
            c: 'c',
            d: {
                d: 'd',
                e: 'e',
            },
        },
    }
    const b = {
        b: 'b',
        c: {
            c: 'c',
            d: {
                f: 'f',
                g: 'g',
                e: 'e.e.e.e',
            },
        },
    }
    expect(extend(a, b)).toEqual({
        a: 'a',
        b: 'b',
        c: {
            c: 'c',
            d: {
                f: 'f',
                g: 'g',
                e: 'e.e.e.e',
            },
        },
    })
    expect(extend(true, a, b)).toEqual({
        a: 'a',
        b: 'b',
        c: {
            c: 'c',
            d: {
                d: 'd',
                e: 'e.e.e.e',
                f: 'f',
                g: 'g',
            },
        },
    })
})