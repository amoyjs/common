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

var drawCalls;
var fps;
function catchDraws(app) {
    var i = 0;
    app.renderer.addListener('prerender', function () {
        i = 0;
    });
    app.renderer.addListener('postrender', function () {
        drawCalls = i;
    });
    var olGrawElements = app.renderer.gl.drawElements.bind(app.renderer.gl);
    app.renderer.gl.drawElements = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        i++;
        return olGrawElements.apply(void 0, args);
    };
}
function catchFPS() {
    var lastTime = performance.now();
    var frame = 0;
    var loop = function () {
        var now = performance.now();
        frame++;
        if (now >= 1000 + lastTime) {
            fps = Math.round((frame * 1000) / (now - lastTime));
            frame = 0;
            lastTime = now;
        }
        requestAnimationFrame(loop);
    };
    loop();
}
function createFPSAndDrawCallsPannel(showFps, showDrawCalls) {
    var container = document.createElement('div');
    container.id = 'stats';
    container.style.cssText = "position:fixed;\n        left: 3rem;\n        pointer-events: none;\n        user-select: none;\n        z-index:10000;\n        color: #fff;\n        font-size: 3rem;\n        line-height: 3rem;";
    container.innerHTML = "" + (showFps ? "<p id='fps'>fps:</p>" : '') + (showDrawCalls ? "<p id='drawcalls'>drawCalls:</p>" : '');
    document.body.appendChild(container);
    var statsContainer = document.querySelector('#stats');
    var top = window.innerHeight - (statsContainer ? statsContainer.clientHeight : 0);
    container.style.top = top - 10 + 'px';
}
function handlePannelPosition() {
    var statsContainer = document.querySelector('#stats');
    setTimeout(function () {
        var container = document.getElementById('stats');
        if (container) {
            container.style.top = window.innerHeight - (statsContainer ? statsContainer.clientHeight : 0) - 10 + 'px';
        }
    }, 100);
}
function showPerformancePannel(app, enables) {
    if (enables === void 0) { enables = ['fps', 'draw-calls']; }
    var showFps = enables.includes('fps');
    var showDrawCalls = enables.includes('draw-calls');
    showDrawCalls && catchDraws(app);
    showFps && catchFPS();
    createFPSAndDrawCallsPannel(showFps, showDrawCalls);
    var drawCallContainer = document.querySelector('#drawcalls');
    var fpsContainer = document.querySelector('#fps');
    setInterval(function () {
        drawCalls && drawCallContainer && (drawCallContainer.innerHTML = "drawCalls: " + drawCalls);
        fps && fpsContainer && (fpsContainer.innerHTML = "fps: " + fps);
    }, 200);
    window.addEventListener('resize', function () { return handlePannelPosition(); });
}
function showPerformance(enables) {
    if (enables === void 0) { enables = ['fps', 'draw-calls']; }
    return function (event) { return event.on('created', function (_a) {
        var game = _a.game;
        return showPerformancePannel(game, enables);
    }); };
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
function getQuery(name) {
    var search = location.search;
    var hasSearch = search !== '';
    var queryString = hasSearch ? search.slice(1) : '';
    var queries = queryString.split('&');
    var query = queries.reduce(function (prev, current) {
        var _a = current.split('='), left = _a[0], right = _a[1];
        prev[left] = decodeURIComponent(right);
        return prev;
    }, {});
    return query[name];
}
function isEmpty(target) {
    if (typeof target === 'object') {
        return Object.keys(target).length === 0;
    }
    else if (Array.isArray(target) || typeof target === 'string') {
        return target.length === 0;
    }
    else {
        return false;
    }
}

export { eventify, extend, forin, getQuery, getValue, isEmpty, setValue, showPerformance, showPerformancePannel, type, usesify };
//# sourceMappingURL=common.es.js.map
