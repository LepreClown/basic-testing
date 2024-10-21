// Uncomment the code below and write your tests
import { simpleCalculator, Action } from './index';

const testCases = [
  { a: 3, b: 5, action: Action.Add, expected: 8 },
  { a: 8, b: 5, action: Action.Subtract, expected: 3 },
  { a: 2, b: 4, action: Action.Multiply, expected: 8 },
  { a: 4, b: 2, action: Action.Divide, expected: 2 },
  { a: 4, b: 2, action: Action.Exponentiate, expected: 16 },
  { a: 4, b: 2, action: 'abc', expected: null },
  { a: null, b: 'abc', action: Action.Add, expected: null },
];

describe('simpleCalculator', () => {
  test.each(testCases)(
    'should return expected a and b for selected action',
    (data) => {
      const { a, b, action, expected } = data;
      const result = simpleCalculator({ a, b, action });

      expect(result).toBe(expected);
    },
  );
});
