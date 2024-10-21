// Uncomment the code below and write your tests
import {
  BankAccount,
  getBankAccount,
  InsufficientFundsError,
  SynchronizationFailedError,
  TransferFailedError,
} from './index';
import { random } from 'lodash';

jest.mock('lodash', () => ({
  random: jest.fn(),
}));

const INITIAL_BALANCE = 1000;
const SECOND_INITIAL_BALANCE = 1500;

let bankAccount: BankAccount;
let secondBankAccount: BankAccount;

describe('BankAccount', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    bankAccount = getBankAccount(INITIAL_BALANCE);
    secondBankAccount = getBankAccount(SECOND_INITIAL_BALANCE);
  });

  test('should create account with initial balance', () => {
    expect(bankAccount.getBalance()).toBe(INITIAL_BALANCE);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const withdrawAmount = 1100;
    const withdraw = () => bankAccount.withdraw(withdrawAmount);

    expect(withdraw).toThrow(InsufficientFundsError);
  });

  test('should throw InsufficientFundsError when transferring more than balance', () => {
    const transferAmount = 1100;
    const transfer = () =>
      bankAccount.transfer(transferAmount, secondBankAccount);

    expect(transfer).toThrow(InsufficientFundsError);
  });

  test('should throw error when transferring to the same account', () => {
    const transferAmount = 1100;
    const transfer = () => bankAccount.transfer(transferAmount, bankAccount);

    expect(transfer).toThrow(TransferFailedError);
  });

  test('should deposit money', () => {
    const depositAmount = 500;
    bankAccount.deposit(depositAmount);

    const balance = bankAccount.getBalance();

    expect(balance).toBe(INITIAL_BALANCE + depositAmount);
  });

  test('should withdraw money', () => {
    const withdrawAmount = 500;
    bankAccount.withdraw(withdrawAmount);

    const balance = bankAccount.getBalance();

    expect(balance).toBe(INITIAL_BALANCE - withdrawAmount);
  });

  test('should transfer money', () => {
    const transferAmount = 500;
    bankAccount.transfer(transferAmount, secondBankAccount);

    const firstAccBal = bankAccount.getBalance();
    const secondAccBal = secondBankAccount.getBalance();

    expect(firstAccBal).toBe(INITIAL_BALANCE - transferAmount);
    expect(secondAccBal).toBe(SECOND_INITIAL_BALANCE + transferAmount);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    const balance = 500;
    (random as jest.Mock).mockReturnValueOnce(balance);
    const accountBalance = await bankAccount.fetchBalance();

    expect(accountBalance).toBe(balance);
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const balance = 1100;
    jest.spyOn(bankAccount, 'fetchBalance').mockResolvedValueOnce(balance);
    jest.spyOn(bankAccount, 'fetchBalance').mockResolvedValueOnce(balance);

    await bankAccount.synchronizeBalance();
    const accountBalance = bankAccount.getBalance();

    expect(accountBalance).toBe(balance);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    jest.spyOn(bankAccount, 'fetchBalance').mockResolvedValueOnce(null);

    const synchronizeBalance = bankAccount.synchronizeBalance();

    await expect(synchronizeBalance).rejects.toThrow(
      SynchronizationFailedError,
    );
  });
});
