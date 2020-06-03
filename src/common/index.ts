export * from './event'
export * from './eventify'
export * from './extend'
export * from './usesify'
export * from './performance'

export function getQuery(name: string) {
    const search = location.search
    const hasSearch = search !== ''
    const queryString = hasSearch ? search.slice(1) : ''
    const queries = queryString.split('&')
    const query = queries.reduce((prev: any, current: any) => {
        const [left, right] = current.split('=')
        prev[left] = decodeURIComponent(right)
        return prev
    }, {})
    return query[name]
}

export function isEmpty(target: any) {
    if (typeof target === 'object') {
        return Object.keys(target).length === 0
    } else if (Array.isArray(target) || typeof target === 'string') {
        return target.length === 0
    } else {
        return false
    }
}

export function type(object: any) {
    const class2type = {}
    const type = class2type.toString.call(object)
    const typeString = 'Boolean Number String Function Array Date RegExp Object Error Symbol'

    if (object == null) return object + ''

    typeString.split(' ').forEach((type) => class2type[`[object ${type}]`] = type.toLowerCase())

    const isObject = typeof object === 'object'
    const isFn = typeof object === 'function'
    return isObject || isFn ? class2type[type] || 'object' : typeof object
}

export function forin(object: object, fn: (key?: string, value?: any) => void) {
    if (typeof object === 'object') {
        for (const key in object) {
            if (object.hasOwnProperty(key)) {
                const value = object[key]
                fn(key, value)
            }
        }
    }
}

export const getValue = (root: any, get: string) => {
    if (type(root) !== 'object') return root
    let value = root
    const keyArr = get.split('.')
    for (let i = 0, l = keyArr.length; i < l; i++) {
        const v = keyArr[i]
        if (v) {
            if (value[v]) {
                value = value[v]
            } else {
                value = undefined
                break
            }
        }
    }
    return value
}

export const setValue = (tar: any, key: string, value: any) => {
    if (type(tar) !== 'object') {
        throw new Error('setValue tar muse be a object!')
    } else {
        const pIndex = key.trim().indexOf('.')
        if (pIndex > 0 && pIndex < key.length - 1) {
            const keyArr = key.trim().split('.')
            let _obj = tar
            let wrongKey = ''
            for (let i = 0, l = keyArr.length - 1; i < l; i++) {
                const v = keyArr[i]
                if (typeof _obj[v] === 'object') {
                    _obj = _obj[v]
                } else if (typeof _obj[v] === 'undefined') {
                    wrongKey = v
                }
            }

            if (!wrongKey) {
                const lastKey = keyArr[keyArr.length - 1]
                _obj[lastKey] = value
            } else {
                throw new Error(`the key(${wrongKey}) is not in tar obj!`)
            }
        } else {
            tar[key.replace(/\./g, '')] = value
        }
    }
}
