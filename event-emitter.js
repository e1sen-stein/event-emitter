// ==UserScript==
// @name           EventEmitter
// @description    Lightweight synchronous events libraray
// @namespace      https://github.com/e1sen-stein
// @version        0.1.0
// @author         EisenStein
// ==/UserScript==

(function (window, WINDOW) {
  function EventEmitter() {
    this._listeners = {};
  }
  /**
  * @param {string} event
  * @param {function} callback
  * @param {boolean} [once]
  * @param {any} [context]
  */
  EventEmitter.prototype.addListener = function (event, callback, once = false, context = null) {
    if (typeof callback !== 'function') {
      throw new Error('callback must be a function, but got ' + typeof callback);
    }
    this._listeners[event] = this._listeners[event] || [];
    const listeners = this._listeners[event];
    if (listeners.find(function (el) { return el.has(callback); })) {
      return;
    }
    const listener = new Listener(callback, once, context || this);
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
    const index = listeners.findIndex(function (el) { return el.has(callback); });
    if (index !== -1) {
      listeners.splice(index, 1);
    }
  };
  EventEmitter.prototype.emit = function (event) {
    return this.envoke.apply(this, arguments);
  };
  EventEmitter.prototype.envoke = function (event) {
    const listeners = this._listeners[event] || [];
    let args;
    let once;
    if (listeners && listeners.length) {
      args = Array.prototype.slice.call(arguments, 1);
      once = [];
    }
    const size = listeners.length;
    for (const listener of listeners) {
      listener.call(...args);
      if (listener.once) {
        once.push(listener.callback);
      }
    }
    if (once && once.length) {
      for (const callback of once) {
        this.removeListener(event, callback);
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
    return this.addListener(event, callback, false, context);
  };
  EventEmitter.prototype.once = function (event, callback, context) {
    return this.addListener(event, callback, true, context);
  };
  EventEmitter.prototype.off = function (event, callback) {
    return this.removeListener(event, callback);
  };

  /**
   * @param {function} callback
   * @param {boolean} once
   * @param {any} context
   */
  function Listener(callback, once = false, context) {
    this.callback = callback;
    this.once = once;
    this.count = 0;
    this.context = context || this;
  }
  /**
   * @param {function} callback
   */
  Listener.prototype.has = function (callback) {
    return this.callback === callback;
  }
  Listener.prototype.call = function () {
    if (typeof this.callback !== 'function') {
      return;
    }
    this.count += 1;
    if (!this.once || this.count <= 1) {
      return this.callback.apply(this.context, arguments);
    }
  };
  Listener.prototype.remove = function () {
    this.callback = null;
  };

  WINDOW.Listener = Listener;
  WINDOW.EventEmitter = EventEmitter;
})(typeof unsafeWindow !== 'undefined' ? unsafeWindow : window, window);
