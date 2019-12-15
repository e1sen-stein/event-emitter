function findBy(key, value) {
  const index = findIndexBy.call(this, key, value);
  return index === -1 ? null : this[index];
}
function findIndexBy(key, value) {
  const array = this;
  for (let index = 0; index < array.length; ++index) {
    const item = array[index];
    if (item[key] === value) {
      return index;
    }
  }
  return -1;
}

module.exports = {
  findBy,
  findIndexBy,
};
