const { findBy, findIndexBy } = require('./utils');

function EventEmitter(options) {
  this._listeners = {};
  options = options || { version: 1, isAsync: false };
  this.version = options.version || 1;
  this.isAsync = !!options.isAsync;
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
EventEmitter.prototype.emit = function (event, data) {
  if (this.isAsync) {
    const self = this;
    const args = arguments;
    setTimeout(function () {
      this.envoke.apply(self, args);
    }, 10);
  } else {
    return this.envoke.apply(this, arguments);
  }
};
EventEmitter.prototype.envoke = function (event, data) {
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
