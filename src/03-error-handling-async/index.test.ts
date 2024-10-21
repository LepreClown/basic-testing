// Uncomment the code below and write your tests
import {
  throwError,
  throwCustomError,
  resolveValue,
  MyAwesomeError,
  rejectCustomError,
} from './index';

describe('resolveValue', () => {
  test('should resolve provided value', async () => {
    const value = 'abc';
    const result = await resolveValue(value);

    expect(result).toBe(value);
  });
});

describe('throwError', () => {
  test('should throw error with provided message', () => {
    const msg = 'Custom provided message';
    const errorFunc = () => throwError(msg);

    expect(errorFunc).toThrow(msg);
  });

  test('should throw error with default message if message is not provided', () => {
    const defaultMsg = 'Oops!';
    const errorFunc = () => throwError();

    expect(errorFunc).toThrow(defaultMsg);
  });
});

describe('throwCustomError', () => {
  test('should throw custom error', () => {
    const errorFunc = () => throwCustomError();

    expect(errorFunc).toThrow(MyAwesomeError);
  });
});

describe('rejectCustomError', () => {
  test('should reject custom error', async () => {
    const errorFunc = () => rejectCustomError();

    await expect(errorFunc).rejects.toThrow(MyAwesomeError);
  });
});
