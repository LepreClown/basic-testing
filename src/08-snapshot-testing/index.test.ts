// Uncomment the code below and write your tests
import { generateLinkedList } from './index';

const LIST_ITEMS = [1, 2, 3, 4];

describe('generateLinkedList', () => {
  test('should generate linked list from values 1', () => {
    const result = generateLinkedList(LIST_ITEMS);
    const expectedResult = {
      value: 1,
      next: {
        value: 2,
        next: {
          value: 3,
          next: {
            value: 4,
            next: {
              value: null,
              next: null,
            },
          },
        },
      },
    };

    expect(result).toStrictEqual(expectedResult);
  });

  test('should generate linked list from values 2', () => {
    const result = generateLinkedList(LIST_ITEMS);

    expect(result).toMatchSnapshot();
  });
});
