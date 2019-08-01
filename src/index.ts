export function type(object: any) {
    const class2type = {}
    const type = class2type.toString.call(object)
    const typeString = 'Boolean Number String Function Array Date RegExp Object Error Symbol'

    if (object == null) return object + ''

    typeString.split(' ').forEach((type) => {
        class2type[`[object ${type}]`] = type.toLowerCase()
    })

    const isObject = typeof object === 'object'
    const isFn = typeof object === 'function'
    return isObject || isFn ? class2type[type] || 'object' : typeof object
}

export function isPlainObject(object: object) {
    const class2type = {}
    const toString = class2type.toString
    const hasOwn = class2type.hasOwnProperty
    const fnToString = hasOwn.toString
    const ObjectFunctionString = fnToString.call(Object)

    let prototype: any, ctor: any

    if (!object || toString.call(object) !== '[object Object]') {
        return false
    }

    prototype = Object.getPrototypeOf(object)
    if (!prototype) return true

    ctor = hasOwn.call(prototype, 'constructor') && prototype.constructor
    return typeof ctor === 'function' && fnToString.call(ctor) === ObjectFunctionString
}

export function extend(...args: any) {
    let options: any, name: any, clone: any, copy: any, source: any, copyIsArray: any,
        target = arguments[0] || {},
        i = 1,
        length = arguments.length,
        deep = false;

    if (typeof target === 'boolean') {
        deep = target;
        target = arguments[i] || {};
        i++;
    }

    if (typeof target !== 'object' && type(target) !== 'function') {
        target = {};
    }

    if (i === length) {
        target = this;
        i--;
    }

    for (; i < length; i++) {
        //
        if ((options = arguments[i]) !== null) {
            // for in source object
            for (name in options) {

                source = target[name];
                copy = options[name];

                if (target == copy) {
                    continue;
                }

                // deep clone
                if (deep && copy && (isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))) {
                    // if copy is array
                    if (copyIsArray) {
                        copyIsArray = false;
                        // if is not array, set it to array
                        clone = source && Array.isArray(source) ? source : [];
                    } else {
                        // if copy is not a object, set it to object
                        clone = source && isPlainObject(source) ? source : {};
                    }

                    target[name] = extend(deep, clone, copy);
                } else if (copy !== undefined) {
                    target[name] = copy;
                }
            }
        }
    }

    return target;
}