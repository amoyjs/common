(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = global || self, factory(global.COMMON = {}));
}(this, (function (exports) { 'use strict';

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var eventemitter3 = createCommonjsModule(function (module) {

	var has = Object.prototype.hasOwnProperty
	  , prefix = '~';

	/**
	 * Constructor to create a storage for our `EE` objects.
	 * An `Events` instance is a plain object whose properties are event names.
	 *
	 * @constructor
	 * @private
	 */
	function Events() {}

	//
	// We try to not inherit from `Object.prototype`. In some engines creating an
	// instance in this way is faster than calling `Object.create(null)` directly.
	// If `Object.create(null)` is not supported we prefix the event names with a
	// character to make sure that the built-in object properties are not
	// overridden or used as an attack vector.
	//
	if (Object.create) {
	  Events.prototype = Object.create(null);

	  //
	  // This hack is needed because the `__proto__` property is still inherited in
	  // some old browsers like Android 4, iPhone 5.1, Opera 11 and Safari 5.
	  //
	  if (!new Events().__proto__) prefix = false;
	}

	/**
	 * Representation of a single event listener.
	 *
	 * @param {Function} fn The listener function.
	 * @param {*} context The context to invoke the listener with.
	 * @param {Boolean} [once=false] Specify if the listener is a one-time listener.
	 * @constructor
	 * @private
	 */
	function EE(fn, context, once) {
	  this.fn = fn;
	  this.context = context;
	  this.once = once || false;
	}

	/**
	 * Add a listener for a given event.
	 *
	 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
	 * @param {(String|Symbol)} event The event name.
	 * @param {Function} fn The listener function.
	 * @param {*} context The context to invoke the listener with.
	 * @param {Boolean} once Specify if the listener is a one-time listener.
	 * @returns {EventEmitter}
	 * @private
	 */
	function addListener(emitter, event, fn, context, once) {
	  if (typeof fn !== 'function') {
	    throw new TypeError('The listener must be a function');
	  }

	  var listener = new EE(fn, context || emitter, once)
	    , evt = prefix ? prefix + event : event;

	  if (!emitter._events[evt]) emitter._events[evt] = listener, emitter._eventsCount++;
	  else if (!emitter._events[evt].fn) emitter._events[evt].push(listener);
	  else emitter._events[evt] = [emitter._events[evt], listener];

	  return emitter;
	}

	/**
	 * Clear event by name.
	 *
	 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
	 * @param {(String|Symbol)} evt The Event name.
	 * @private
	 */
	function clearEvent(emitter, evt) {
	  if (--emitter._eventsCount === 0) emitter._events = new Events();
	  else delete emitter._events[evt];
	}

	/**
	 * Minimal `EventEmitter` interface that is molded against the Node.js
	 * `EventEmitter` interface.
	 *
	 * @constructor
	 * @public
	 */
	function EventEmitter() {
	  this._events = new Events();
	  this._eventsCount = 0;
	}

	/**
	 * Return an array listing the events for which the emitter has registered
	 * listeners.
	 *
	 * @returns {Array}
	 * @public
	 */
	EventEmitter.prototype.eventNames = function eventNames() {
	  var names = []
	    , events
	    , name;

	  if (this._eventsCount === 0) return names;

	  for (name in (events = this._events)) {
	    if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
	  }

	  if (Object.getOwnPropertySymbols) {
	    return names.concat(Object.getOwnPropertySymbols(events));
	  }

	  return names;
	};

	/**
	 * Return the listeners registered for a given event.
	 *
	 * @param {(String|Symbol)} event The event name.
	 * @returns {Array} The registered listeners.
	 * @public
	 */
	EventEmitter.prototype.listeners = function listeners(event) {
	  var evt = prefix ? prefix + event : event
	    , handlers = this._events[evt];

	  if (!handlers) return [];
	  if (handlers.fn) return [handlers.fn];

	  for (var i = 0, l = handlers.length, ee = new Array(l); i < l; i++) {
	    ee[i] = handlers[i].fn;
	  }

	  return ee;
	};

	/**
	 * Return the number of listeners listening to a given event.
	 *
	 * @param {(String|Symbol)} event The event name.
	 * @returns {Number} The number of listeners.
	 * @public
	 */
	EventEmitter.prototype.listenerCount = function listenerCount(event) {
	  var evt = prefix ? prefix + event : event
	    , listeners = this._events[evt];

	  if (!listeners) return 0;
	  if (listeners.fn) return 1;
	  return listeners.length;
	};

	/**
	 * Calls each of the listeners registered for a given event.
	 *
	 * @param {(String|Symbol)} event The event name.
	 * @returns {Boolean} `true` if the event had listeners, else `false`.
	 * @public
	 */
	EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
	  var evt = prefix ? prefix + event : event;

	  if (!this._events[evt]) return false;

	  var listeners = this._events[evt]
	    , len = arguments.length
	    , args
	    , i;

	  if (listeners.fn) {
	    if (listeners.once) this.removeListener(event, listeners.fn, undefined, true);

	    switch (len) {
	      case 1: return listeners.fn.call(listeners.context), true;
	      case 2: return listeners.fn.call(listeners.context, a1), true;
	      case 3: return listeners.fn.call(listeners.context, a1, a2), true;
	      case 4: return listeners.fn.call(listeners.context, a1, a2, a3), true;
	      case 5: return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
	      case 6: return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
	    }

	    for (i = 1, args = new Array(len -1); i < len; i++) {
	      args[i - 1] = arguments[i];
	    }

	    listeners.fn.apply(listeners.context, args);
	  } else {
	    var length = listeners.length
	      , j;

	    for (i = 0; i < length; i++) {
	      if (listeners[i].once) this.removeListener(event, listeners[i].fn, undefined, true);

	      switch (len) {
	        case 1: listeners[i].fn.call(listeners[i].context); break;
	        case 2: listeners[i].fn.call(listeners[i].context, a1); break;
	        case 3: listeners[i].fn.call(listeners[i].context, a1, a2); break;
	        case 4: listeners[i].fn.call(listeners[i].context, a1, a2, a3); break;
	        default:
	          if (!args) for (j = 1, args = new Array(len -1); j < len; j++) {
	            args[j - 1] = arguments[j];
	          }

	          listeners[i].fn.apply(listeners[i].context, args);
	      }
	    }
	  }

	  return true;
	};

	/**
	 * Add a listener for a given event.
	 *
	 * @param {(String|Symbol)} event The event name.
	 * @param {Function} fn The listener function.
	 * @param {*} [context=this] The context to invoke the listener with.
	 * @returns {EventEmitter} `this`.
	 * @public
	 */
	EventEmitter.prototype.on = function on(event, fn, context) {
	  return addListener(this, event, fn, context, false);
	};

	/**
	 * Add a one-time listener for a given event.
	 *
	 * @param {(String|Symbol)} event The event name.
	 * @param {Function} fn The listener function.
	 * @param {*} [context=this] The context to invoke the listener with.
	 * @returns {EventEmitter} `this`.
	 * @public
	 */
	EventEmitter.prototype.once = function once(event, fn, context) {
	  return addListener(this, event, fn, context, true);
	};

	/**
	 * Remove the listeners of a given event.
	 *
	 * @param {(String|Symbol)} event The event name.
	 * @param {Function} fn Only remove the listeners that match this function.
	 * @param {*} context Only remove the listeners that have this context.
	 * @param {Boolean} once Only remove one-time listeners.
	 * @returns {EventEmitter} `this`.
	 * @public
	 */
	EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
	  var evt = prefix ? prefix + event : event;

	  if (!this._events[evt]) return this;
	  if (!fn) {
	    clearEvent(this, evt);
	    return this;
	  }

	  var listeners = this._events[evt];

	  if (listeners.fn) {
	    if (
	      listeners.fn === fn &&
	      (!once || listeners.once) &&
	      (!context || listeners.context === context)
	    ) {
	      clearEvent(this, evt);
	    }
	  } else {
	    for (var i = 0, events = [], length = listeners.length; i < length; i++) {
	      if (
	        listeners[i].fn !== fn ||
	        (once && !listeners[i].once) ||
	        (context && listeners[i].context !== context)
	      ) {
	        events.push(listeners[i]);
	      }
	    }

	    //
	    // Reset the array, or remove it completely if we have no more listeners.
	    //
	    if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;
	    else clearEvent(this, evt);
	  }

	  return this;
	};

	/**
	 * Remove all listeners, or those of the specified event.
	 *
	 * @param {(String|Symbol)} [event] The event name.
	 * @returns {EventEmitter} `this`.
	 * @public
	 */
	EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
	  var evt;

	  if (event) {
	    evt = prefix ? prefix + event : event;
	    if (this._events[evt]) clearEvent(this, evt);
	  } else {
	    this._events = new Events();
	    this._eventsCount = 0;
	  }

	  return this;
	};

	//
	// Alias methods names because people roll like that.
	//
	EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
	EventEmitter.prototype.addListener = EventEmitter.prototype.on;

	//
	// Expose the prefix.
	//
	EventEmitter.prefixed = prefix;

	//
	// Allow `EventEmitter` to be imported as module namespace.
	//
	EventEmitter.EventEmitter = EventEmitter;

	//
	// Expose the module.
	//
	{
	  module.exports = EventEmitter;
	}
	});

	var event = new eventemitter3();

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
	    var class2type = {};
	    var toString = class2type.toString;
	    var hasOwn = class2type.hasOwnProperty;
	    var fnToString = hasOwn.toString;
	    var ObjectFunctionString = fnToString.call(Object);
	    if (!object || toString.call(object) !== '[object Object]')
	        return false;
	    var proto = Object.getPrototypeOf(object);
	    if (!proto)
	        return true;
	    var ctor = hasOwn.call(proto, 'constructor') && proto.constructor;
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

	exports.event = event;
	exports.eventify = eventify;
	exports.extend = extend;
	exports.showPerformance = showPerformance;
	exports.showPerformancePannel = showPerformancePannel;
	exports.usesify = usesify;

	Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=index.js.map
