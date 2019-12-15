const utils = require('./utils');

describe('utils methods', () => {
  test('findIndexBy', () => {
    const array = [];
    array.findIndexBy = utils.findIndexBy;
    const fn = () => {};
    array.push({ key: 1 }, { key: '1' }, { key: fn });
    expect(array.findIndexBy('key', 1)).toEqual(0);
    expect(array.findIndexBy('key', '1')).toEqual(1);
    expect(array.findIndexBy('key', fn)).toEqual(2);
    expect(array.findIndexBy('key', 'value')).toEqual(-1);
  });

  test('findBy', () => {
    const array = [];
    array.findBy = utils.findBy;
    const fn = () => {};
    array.push({ key: 1 }, { key: '1' }, { key: fn });
    expect(array.findBy('key', 1)).toEqual({ key: 1 });
    expect(array.findBy('key', '1')).toEqual({ key: '1' });
    expect(array.findBy('key', fn)).toEqual({ key: fn });
    expect(array.findBy('key', 'value')).toEqual(null);
  });
});