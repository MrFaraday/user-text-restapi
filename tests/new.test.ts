
const multiply = require('../src/newFile').multiply

test('must return new value', () => {
  expect(multiply(3, 2)).toBe(9)
})
