(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = global || self, factory(global.common = {}));
}(this, function (exports) { 'use strict';

    function eventify(target) {
        target.callbacks = {};
        target.on = function (eventName, callback) {
            if (!eventName || !callback)
                return target;
            if (!target.hasOwnProperty("callbacks"))
                target.callbacks || (target.callbacks = {});
            var base;
            var events = eventName.split(" ");
            events.map(function (eventName) {
                (base = target.callbacks)[eventName] || (base[eventName] = []);
                target.callbacks[eventName].push(callback);
            });
            return target;
        };
        target.emit = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var eventName = args.shift();
            var events = eventName.split(" ");
            events.map(function (eventName) {
                var list = target.callbacks !== null ? target.callbacks[eventName] || [] : [];
                if (list.length) {
                    list.map(function (item) {
                        item && item.apply(target, args);
                    });
                }
            });
            return target;
        };
        target.off = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (args.length === 0) {
                target.callbacks = {};
            }
            else {
                var eventName = args.shift();
                var events = eventName.split(" ");
                events.map(function (eventName) { return delete target.callbacks[eventName]; });
            }
            return target;
        };
        return target;
    }

    function isPlainObject(object) {
        // tslint:disable-next-line: one-variable-per-declaration
        var proto, ctor, class2type = {}, toString = class2type.toString, // Object.prototype.toString
        hasOwn = class2type.hasOwnProperty, fnToString = hasOwn.toString, // Object.toString/Function.toString
        ObjectFunctionString = fnToString.call(Object); // 'function Object() { [native code] }'
        if (!object || toString.call(object) !== '[object Object]') {
            return false;
        }
        // According to the object created by `Object.create(null)` is no `prototype`
        proto = Object.getPrototypeOf(object);
        if (!proto) {
            return true;
        }
        ctor = hasOwn.call(proto, 'constructor') && proto.constructor;
        return typeof ctor === 'function' && fnToString.call(ctor) === ObjectFunctionString;
    }
    function extend() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var options;
        var name;
        var clone;
        var copy;
        var source;
        var copyIsArray;
        var target = arguments[0] || {};
        var i = 1;
        var length = arguments.length;
        var deep = false;
        if (typeof target === 'boolean') {
            deep = target;
            target = arguments[i] || {};
            i++;
        }
        if (typeof target !== 'object' && typeof target !== 'function') {
            target = {};
        }
        if (i === length) {
            target = this;
            i--;
        }
        for (; i < length; i++) {
            // tslint:disable-next-line: no-conditional-assignment
            if ((options = arguments[i]) !== null) {
                for (name in options) {
                    if (options.hasOwnProperty(name)) {
                        source = target[name];
                        copy = options[name];
                        if (target === copy) {
                            continue;
                        }
                        // deep clone
                        // tslint:disable-next-line: no-conditional-assignment
                        if (deep && copy && (isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))) {
                            if (copyIsArray) {
                                copyIsArray = false;
                                clone = source && Array.isArray(source) ? source : [];
                            }
                            else {
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
        }
        return target;
    }

    function usesify(addons) {
        return function use(target) {
            var _addons = Array.isArray(addons) ? addons : [addons];
            _addons.map(function (addon) {
                if (typeof addon === "function") {
                    addon(target);
                }
                else {
                    throw Error("[@amoy/components]error: addon " + addons + " must be a function;");
                }
            });
        };
    }

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
    function forin(object, fn) {
        if (typeof object === 'object') {
            for (var key in object) {
                if (object.hasOwnProperty(key)) {
                    var value = object[key];
                    fn(key, value);
                }
            }
        }
    }
    var getValue = function (root, get) {
        if (type(root) !== 'object')
            return root;
        var value = root;
        var keyArr = get.split('.');
        for (var i = 0, l = keyArr.length; i < l; i++) {
            var v = keyArr[i];
            if (v) {
                if (value[v]) {
                    value = value[v];
                }
                else {
                    value = undefined;
                    break;
                }
            }
        }
        return value;
    };
    var setValue = function (tar, key, value) {
        if (type(tar) !== 'object') {
            throw new Error('setValue tar muse be a object!');
        }
        else {
            var pIndex = key.trim().indexOf('.');
            if (pIndex > 0 && pIndex < key.length - 1) {
                var keyArr = key.trim().split('.');
                var _obj = tar;
                var wrongKey = '';
                for (var i = 0, l = keyArr.length - 1; i < l; i++) {
                    var v = keyArr[i];
                    if (typeof _obj[v] === 'object') {
                        _obj = _obj[v];
                    }
                    else if (typeof _obj[v] === 'undefined') {
                        wrongKey = v;
                    }
                }
                if (!wrongKey) {
                    var lastKey = keyArr[keyArr.length - 1];
                    _obj[lastKey] = value;
                }
                else {
                    throw new Error("the key(" + wrongKey + ") is not in tar obj!");
                }
            }
            else {
                tar[key.replace(/\./g, '')] = value;
            }
        }
    };

    exports.eventify = eventify;
    exports.extend = extend;
    exports.forin = forin;
    exports.getValue = getValue;
    exports.setValue = setValue;
    exports.type = type;
    exports.usesify = usesify;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=common.js.map
