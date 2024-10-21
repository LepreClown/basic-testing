// Uncomment the code below and write your tests
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import {
  readFileAsynchronously,
  doStuffByTimeout,
  doStuffByInterval,
} from './index';

const FILE_NAME = 'file.txt';
const FILE_CONTENT = 'File test content';
const TIMEOUT_DURATION = 1000;
const INTERVAL_DURATION = 1000;

jest.mock('fs/promises', () => ({
  ...jest.requireActual('fs/promises'),
  readFile: jest.fn(),
}));
jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  existsSync: jest.fn(),
}));
jest.mock('path', () => ({
  ...jest.requireActual('path'),
  join: jest.fn(),
}));

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    const callbackFunc = jest.fn();
    const timeoutSpy = jest.spyOn(global, 'setTimeout');

    doStuffByTimeout(callbackFunc, TIMEOUT_DURATION);

    expect(timeoutSpy).toHaveBeenCalledWith(callbackFunc, TIMEOUT_DURATION);
  });

  test('should call callback only after timeout', () => {
    const callbackFunc = jest.fn();

    doStuffByTimeout(callbackFunc, TIMEOUT_DURATION);
    jest.advanceTimersByTime(TIMEOUT_DURATION);

    expect(callbackFunc).toHaveBeenCalledTimes(1);
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    const callbackFunc = jest.fn();
    const intervalSpy = jest.spyOn(global, 'setInterval');

    doStuffByInterval(callbackFunc, INTERVAL_DURATION);

    expect(intervalSpy).toHaveBeenCalledWith(callbackFunc, INTERVAL_DURATION);
  });

  test('should call callback multiple times after multiple intervals', () => {
    const callbackFunc = jest.fn();

    doStuffByInterval(callbackFunc, INTERVAL_DURATION);
    jest.advanceTimersByTime(INTERVAL_DURATION * 3);

    expect(callbackFunc).toHaveBeenCalledTimes(3);
  });
});

describe('readFileAsynchronously', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test('should call join with pathToFile', async () => {
    await readFileAsynchronously(FILE_NAME);

    expect(path.join).toHaveBeenCalledWith(__dirname, FILE_NAME);
  });

  test('should return null if file does not exist', async () => {
    (existsSync as jest.Mock).mockReturnValue(false);
    const result = await readFileAsynchronously(FILE_NAME);

    expect(result).toBeNull();
  });

  test('should return file content if file exists', async () => {
    (existsSync as jest.Mock).mockReturnValue(true);
    (readFile as jest.Mock).mockResolvedValue(Buffer.from(FILE_CONTENT));

    const result = await readFileAsynchronously(FILE_NAME);

    expect(result).toBe(FILE_CONTENT);
  });
});
