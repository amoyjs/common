function type(object) {
    var class2type = {};
    var type = class2type.toString.call(object);
    var typeString = 'Boolean Number String Function Array Date RegExp Object Error Symbol';
    if (object == null)
        return object + '';
    typeString.split(' ').forEach(function (type) {
        class2type["[object " + type + "]"] = type.toLowerCase();
    });
    var isObject = typeof object === 'object';
    var isFn = typeof object === 'function';
    return isObject || isFn ? class2type[type] || 'object' : typeof object;
}
function isPlainObject(object) {
    var class2type = {};
    var toString = class2type.toString;
    var hasOwn = class2type.hasOwnProperty;
    var fnToString = hasOwn.toString;
    var ObjectFunctionString = fnToString.call(Object);
    var prototype, ctor;
    if (!object || toString.call(object) !== '[object Object]') {
        return false;
    }
    prototype = Object.getPrototypeOf(object);
    if (!prototype)
        return true;
    ctor = hasOwn.call(prototype, 'constructor') && prototype.constructor;
    return typeof ctor === 'function' && fnToString.call(ctor) === ObjectFunctionString;
}
function extend() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var options, name, clone, copy, source, copyIsArray, target = arguments[0] || {}, i = 1, length = arguments.length, deep = false;
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
                    }
                    else {
                        // if copy is not a object, set it to object
                        clone = source && isPlainObject(source) ? source : {};
                    }
                    target[name] = extend(deep, clone, copy);
                }
                else if (copy !== undefined) {
                    target[name] = copy;
                }
            }
        }
    }
    return target;
}

export { extend, isPlainObject, type };
//# sourceMappingURL=common.es.js.map
