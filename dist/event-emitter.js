(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["EventEmitter"] = factory();
	else
		root["EventEmitter"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./event-emitter.js":
/*!**************************!*\
  !*** ./event-emitter.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var _require = __webpack_require__(/*! ./utils */ "./utils.js"),
    findBy = _require.findBy,
    findIndexBy = _require.findIndexBy;

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


EventEmitter.prototype.addListener = function (event, callback) {
  var context = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var isOnce = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

  if (typeof callback !== 'function') {
    throw new Error('callback must be a function, but got ' + _typeof(callback));
  }

  this._listeners[event] = this._listeners[event] || [];
  var listeners = this._listeners[event];

  if (findBy.call(listeners, 'fn', callback)) {
    return;
  }

  var listener = {
    fn: callback,
    context: context,
    isOnce: isOnce
  };
  listeners.push(listener);
};

EventEmitter.prototype.removeListener = function (event, callback) {
  if (typeof event === 'undefined') {
    this._listeners = {};
    return;
  }

  var listeners = this._listeners[event] || [];

  if (typeof callback === 'undefined') {
    listeners.length = 0;
    return;
  }

  var index = findIndexBy.call(listeners, 'fn', callback);

  if (index !== -1) {
    listeners.splice(index, 1);
  }
};

EventEmitter.prototype.countAllListeners = function countAllListeners() {
  var n = 0;

  for (var _i = 0, _Object$keys = Object.keys(this._listeners); _i < _Object$keys.length; _i++) {
    var name = _Object$keys[_i];
    n += this._listeners[name].length;
  }

  return n;
};
/** @param {string|symbol|function} [fn] */


EventEmitter.prototype.countListeners = function countListeners(fn) {
  var n = 0;

  if (typeof fn === 'function') {
    for (var _i2 = 0, _Object$keys2 = Object.keys(this._listeners); _i2 < _Object$keys2.length; _i2++) {
      var name = _Object$keys2[_i2];
      n += findIndexBy.call(this._listeners[name], 'fn', fn) !== -1 ? 1 : 0;
    }

    return n;
  }

  if (typeof fn === 'string' || _typeof(fn) === 'symbol') {
    var listeners = this._listeners[fn];
    return Array.isArray(listeners) ? listeners.length : 0;
  }

  return this.countAllListeners();
};
/** @param {string|symbol} event */


EventEmitter.prototype.hasEvent = function hasEvent(event) {
  if (typeof event === 'string' || _typeof(event) === 'symbol') {
    return Array.isArray(this._listeners[event]) ? !!this._listeners[event].length : false;
  }

  return false;
};
/**
 * @param {string|symbol|function} event
 * @param {function} [listener]
 */


EventEmitter.prototype.hasListener = function hasListener(event, listener) {
  if (typeof event === 'function') {
    return this.countListeners(event) > 0;
  }

  if (typeof listener === 'function') {
    return this.hasEvent(event) && findIndexBy.call(this._listeners[event], 'fn', listener) !== -1;
  }

  return this.hasEvent(event);
};

EventEmitter.prototype.emit = function emit(event, data) {
  var listeners = this._listeners[event] || [];
  var args;

  if (listeners && listeners.length && this.version === 1) {
    args = Array.prototype.slice.call(arguments, 1);
  }

  var size = listeners.length;

  for (var i = 0; i < listeners.length; ++i) {
    var listener = listeners[i];

    if (this.version === 1) {
      listener.fn.apply(listener.context, args);
    } else {
      listener.fn.call(listener.context, {
        type: event,
        data: data
      });
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

/***/ }),

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var EventEmitter = __webpack_require__(/*! ./event-emitter */ "./event-emitter.js");

module.exports = EventEmitter;

/***/ }),

/***/ "./utils.js":
/*!******************!*\
  !*** ./utils.js ***!
  \******************/
/*! no static exports found */
/***/ (function(module, exports) {

function findBy(key, value) {
  var index = findIndexBy.call(this, key, value);
  return index === -1 ? null : this[index];
}

function findIndexBy(key, value) {
  var array = this;

  for (var index = 0; index < array.length; ++index) {
    var item = array[index];

    if (item[key] === value) {
      return index;
    }
  }

  return -1;
}

module.exports = {
  findBy: findBy,
  findIndexBy: findIndexBy
};

/***/ })

/******/ });
});