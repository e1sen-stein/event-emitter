# event-emitter

Lightweight synchronous javascript event emitter

## Getting started

### Run tests

```bash
npm run test
```

### Installing

Using npm

```bash
npm install @e1sen-stein/event-emitter
```

Using yarn

```bash
yarn add @e1sen-stein/event-emitter
```

Using cdn

```html
<script src="https://cdn.jsdelivr.net/npm/@e1sen-stein/event-emitter@1.1.2/dist/event-emitter.min.js"></script>
```

### Build

```bash
npm run build
```

### Usage

nodejs

```javascript
const EventEmitter = require('event-emitter');

const emitter = new EventEmitter();
```

browser

```javascript
const EventEmitter = window.EventEmitter;

const emitter = new EventEmitter();
```

```javascript
emitter.on('my-event', (...args) => {
  console.log(...args);
});
emitter.emit('my-event', 1, 2); // should print "1 2"

emitter.once('my-event', (...args) => {
  console.log(...args);
});
emitter.emit('my-event', 1, 2, 3); // should print twice "1 2 3"
emitter.emit('my-event', 1, 2, 3, 4, 5); // should print once "1 2 3 4 5"
```

Using with context

```javascript
const context = { my: 'context' };
const fn = function fn (...args) {
  console.log('context: ', this); // should print { my: "context" }
  console.log('arguments: ', ...args);
};
// register listener
emitter.on('my-event', fn, context);

// if context not specified, will be called in null context
emitter.once('my-event', function (...args) {
  console.log('[once] context: ', this); // should print "null"
  console.log('[once] arguments: ', ...args);
});

emitter.emit('my-event', 1, 2, 3, 4);
emitter.emit('my-event', 2, 3, 4, 5);
```

Count listeners
```javascript
const fn = () => {};
emitter.on('event-1', fn);
emitter.on('event-2', fn);
emitter.on('event-3', () => {});
emitter.countListeners('event-1'); // return 1 (number of "event-1" listeners)
emitter.countListeners(fn); // return 2
emitter.countListeners(); // return 3

emitter.countAllListeners(); // return 3
```

Removing listeners

```javascript
// unregister listeners
emitter.off('my-event', fn); // remove "fn" from 'my-event' listeners
emitter.off('my-event'); // remove "my-event" listeners
emitter.off(); // remove all listeners
```
