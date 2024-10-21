// Uncomment the code below and write your tests
import axios from 'axios';
import { throttledGetDataFromApi } from './index';

jest.mock('axios');
jest.mock('lodash', () => ({
  throttle: jest.fn((fn) => fn),
}));

const URL = 'https://jsonplaceholder.typicode.com';
const ENDPOINT = '/todos/26';
const CURRENT_RESPONSE = {
  userId: 2,
  id: 26,
  title: 'aliquam aut quasi',
  completed: true,
};

describe('throttledGetDataFromApi', () => {
  let axiosInstance: jest.Mocked<typeof axios>;

  beforeEach(() => {
    axiosInstance = axios as jest.Mocked<typeof axios>;
    axiosInstance.create.mockReturnValue(axiosInstance);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should create instance with provided base url', async () => {
    axiosInstance.get.mockResolvedValue({ data: CURRENT_RESPONSE });

    await throttledGetDataFromApi(ENDPOINT);

    expect(axiosInstance.create).toHaveBeenCalledWith({ baseURL: URL });
  });

  test('should perform request to correct provided url', async () => {
    axiosInstance.get.mockResolvedValue({ data: CURRENT_RESPONSE });

    await throttledGetDataFromApi(ENDPOINT);

    expect(axiosInstance.get).toHaveBeenCalledWith(ENDPOINT);
  });

  test('should return response data', async () => {
    axiosInstance.get.mockResolvedValue({ data: CURRENT_RESPONSE });

    const result = await throttledGetDataFromApi(ENDPOINT);
    expect(result).toEqual(CURRENT_RESPONSE);
  });
});
