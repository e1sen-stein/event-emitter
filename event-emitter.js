const { findBy, findIndexBy } = require('./utils');

function EventEmitter(options) {
  this._listeners = {};
  options = options || {}; // eslint-disable-line no-param-reassign
  this.version = options.version || 1;
}
/**
* @param {string} event
* @param {function} callback
* @param {boolean} [once]
* @param {any} [context]
*/
EventEmitter.prototype.addListener = function (event, callback, context = null, isOnce = false) {
  if (typeof callback !== 'function') {
    throw new Error('callback must be a function, but got ' + typeof callback);
  }
  this._listeners[event] = this._listeners[event] || [];
  const listeners = this._listeners[event];
  if (findBy.call(listeners, 'fn', callback)) {
    return;
  }
  const listener = { fn: callback, context, isOnce };
  listeners.push(listener);
};
EventEmitter.prototype.removeListener = function (event, callback) {
  if (typeof event === 'undefined') {
    this._listeners = {};
    return;
  }
  const listeners = this._listeners[event] || [];
  if (typeof callback === 'undefined') {
    listeners.length = 0;
    return;
  }
  const index = findIndexBy.call(listeners, 'fn', callback);
  if (index !== -1) {
    listeners.splice(index, 1);
  }
};

EventEmitter.prototype.countAllListeners = function countAllListeners () {
  let n = 0;
  for (const name of Object.keys(this._listeners)) {
    n += this._listeners[name].length;
  }
  return n;
};

/** @param {string|symbol|function} [fn] */
EventEmitter.prototype.countListeners = function countListeners (fn) {
  let n = 0;
  if (typeof fn === 'function') {
    for (const name of Object.keys(this._listeners)) {
      n += (findIndexBy.call(this._listeners[name], 'fn', fn) !== -1 ? 1 : 0);
    }
    return n;
  }
  if (typeof fn === 'string' || typeof fn === 'symbol') {
    const listeners = this._listeners[fn];
    return Array.isArray(listeners) ? listeners.length : 0;
  }
  return this.countAllListeners();
};

/** @param {string|symbol} event */
EventEmitter.prototype.hasEvent = function hasEvent (event) {
  if (typeof event === 'string' || typeof event === 'symbol') {
    return Array.isArray(this._listeners[event]) ? !!this._listeners[event].length : false;
  }
  return false;
};

/**
 * @param {string|symbol|function} event
 * @param {function} [listener]
 */
EventEmitter.prototype.hasListener = function hasListener (event, listener) {
  if (typeof event === 'function') {
    return this.countListeners(event) > 0;
  }
  if (typeof listener === 'function') {
    return this.hasEvent(event) && findIndexBy.call(this._listeners[event], 'fn', listener) !== -1;
  }
  return this.hasEvent(event);
};

EventEmitter.prototype.emit = function emit (event, data) {
  const listeners = this._listeners[event] || [];
  let args;
  if (listeners && listeners.length && this.version === 1) {
    args = Array.prototype.slice.call(arguments, 1);
  }
  const size = listeners.length;
  for (let i = 0; i < listeners.length; ++i) {
    const listener = listeners[i];
    if (this.version === 1) {
      listener.fn.apply(listener.context, args);
    } else {
      listener.fn.call(listener.context, { type: event, data });
    }
    if (listener.isOnce) {
      listeners.splice(i--, 1);
    }
  }
  return size;
};
/**
* @param {string} event
* @param {function} callback
* @param {any} [context]
*/
EventEmitter.prototype.on = function (event, callback, context) {
  return this.addListener(event, callback, context, false);
};
EventEmitter.prototype.once = function (event, callback, context) {
  return this.addListener(event, callback, context, true);
};
EventEmitter.prototype.off = function (event, callback) {
  return this.removeListener(event, callback);
};

module.exports = EventEmitter;
