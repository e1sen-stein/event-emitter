const EventEmitter = require('./event-emitter');

describe('emitter methods', () => {
  describe('"count + has" methods', () => {
    test('should count registered listeners', () => {
      const emitter = new EventEmitter();
      // event-1
      emitter.on('event-1', () => {});
      emitter.on('event-1', () => {});
      const fn = () => {};
      emitter.on('event-1', fn);
      emitter.on('event-1', fn);
      // event-2
      emitter.on('event-2', fn);
      expect(emitter.countListeners('event-2')).toEqual(1);
      expect(emitter.countListeners(fn)).toEqual(2);
      expect(emitter.countListeners('event-1')).toEqual(3);
      expect(emitter.countAllListeners()).toEqual(4);
      expect(emitter.countListeners()).toEqual(4);
      emitter.off();
    });

    test('should find whether listener is registered', () => {
      const emitter = new EventEmitter();
      const fn = () => {};
      emitter.on('event-1', fn);
      expect(emitter.hasListener(fn)).toEqual(true);
      expect(emitter.hasListener('event-1', fn)).toEqual(true);
      expect(emitter.hasListener(() => {})).toEqual(false);
      emitter.off('event-1');
      expect(emitter.hasListener(fn)).toEqual(false);
      expect(emitter.hasListener('event-1', fn)).toEqual(false);
      emitter.off();
    });

    test('should find whether event has listeners', () => {
      const emitter = new EventEmitter();
      const fn = () => {};
      emitter.on('event-1', fn);
      emitter.on('event-1', () => {});
      expect(emitter.hasListener('event-1')).toEqual(true);
      expect(emitter.hasListener('event-2')).toEqual(false);
      expect(emitter.hasEvent('event-1')).toEqual(true);
      emitter.off('event-1');
      expect(emitter.hasListener('event-1')).toEqual(false);
      const name = undefined; // missed event name
      expect(emitter.hasEvent(name)).toEqual(false);
      emitter.off();
    });

  });

  describe('"on[ce]/off" methods', () => {
    test('should register/unregister listener[s]', () => {
      const emitter = new EventEmitter();
      emitter.on('my-event', () => {});
      emitter.on('my-event', () => {});
      expect(emitter.countListeners('my-event')).toEqual(2);
      emitter.off('my-event');
      expect(emitter.countListeners('my-event')).toEqual(0);
    });

    test('should be called once if listener registered by "once" method', () => {
      const emitter = new EventEmitter();
      let count = 0;
      // register listener
      emitter.once('my-event', () => { ++count; });
      expect(emitter.countListeners('my-event')).toEqual(1);
      // emit event
      emitter.emit('my-event');
      expect(count).toEqual(1);
      expect(emitter.countListeners('my-event')).toEqual(0);
      // emit event
      emitter.emit('my-event');
      expect(count).toEqual(1);
    });

    test('should unregister specific listener', () => {
      const emitter = new EventEmitter();
      emitter.on('my-event', () => { });
      const fn = () => { };
      emitter.on('my-event', fn);
      expect(emitter.countListeners('my-event')).toEqual(2);
      emitter.off('my-event', fn);
      expect(emitter.countListeners('my-event')).toEqual(1);
    });

    test('should unregister all listener of one event', () => {
      const emitter = new EventEmitter();
      emitter.on('my-event', () => { });
      const fn = () => { };
      emitter.on('my-event', fn);
      emitter.on('my-event-123', () => {});
      expect(emitter.countListeners('my-event')).toEqual(2);
      emitter.off('my-event');
      expect(emitter.countListeners('my-event')).toEqual(0);
      expect(emitter.countListeners('my-event-123')).toEqual(1);
    });

    test('should unregister all listener', () => {
      const emitter = new EventEmitter();
      emitter.on('my-event', () => { });
      const fn = () => { };
      emitter.on('my-event', fn);
      emitter.on('my-event-123', () => {});
      expect(emitter.countListeners('my-event')).toEqual(2);
      emitter.off();
      expect(emitter.countListeners('my-event')).toEqual(0);
      expect(emitter.countListeners('my-event-123')).toEqual(0);
    });

  });

  describe('emitter version 2', () => {
    test('should emit { type: "event-name", data: any }', () => {
      expect.assertions(1);
      const emitter = new EventEmitter({ version: 2 });
      const name = 'my-event-1';
      const payload = { my: 'data' };
      const fn = (event) => {
        expect(event).toEqual({ type: 'my-event-1', data: { my: 'data' } });
      };
      emitter.on(name, fn);
      emitter.emit(name, payload);
    });
  });

  describe('misc', () => {
    test('should throw error if try to register not function listener', () => {
      expect.assertions(1);
      const emitter = new EventEmitter();
      try {
        emitter.on('event', {});
      } catch (e) {
        expect(e instanceof Error).toBe(true);
      }
    });

    test('should pass if try to emit unspecified event', () => {
      expect.assertions(1);
      try {
        const emitter = new EventEmitter();
        expect(emitter.countListeners('event')).toBe(0);
        emitter.emit('event', 1);
      } catch (e) {
        expect(1).toBe(1);
      }
    });

    test('should pass if try to remove listener 2 times', () => {
      expect.assertions(3);
      try {
        const emitter = new EventEmitter();
        const fn = () => {};
        emitter.on('event', fn);
        emitter.on('event', () => {});
        expect(emitter.countListeners('event')).toBe(2);
        emitter.off('event', fn);
        expect(emitter.countListeners('event')).toBe(1);
        emitter.off('event', fn);
        expect(emitter.countListeners('event')).toBe(1);
      } catch (e) {
        expect(1).toBe(1);
      }
    });

    test('should pass if try to remove listener from unspecified event', () => {
      expect.assertions(3);
      try {
        const emitter = new EventEmitter();
        const fn = () => {};
        expect(emitter.countListeners('event')).toBe(0);
        emitter.off('event', fn);
        expect(emitter.countListeners('event')).toBe(0);
        emitter.off('event');
        expect(emitter.countListeners('event')).toBe(0);
      } catch (e) {
        expect(1).toBe(1);
      }
    });

    test('addListener should set default value isOnce to false', () => {
      expect.assertions(2);
      try {
        const emitter = new EventEmitter();
        const fn = (data) => {
          expect(data).toEqual(123);
        };
        emitter.addListener('event-1', fn);
        emitter.emit('event-1', 123);
        emitter.emit('event-1', 123);
      } catch (e) {
        expect(1).toBe(1);
      }
    });
  });

});