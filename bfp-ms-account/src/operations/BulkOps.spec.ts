import BulkOps from './BulkOps';
import _ from 'lodash';
import { transaction } from '../models';
import { db } from '../db';

jest.mock('lodash', () => ({
  map: jest.fn(),
}));

describe('bulkWriteOps', () => {
  let service: BulkOps;
  let mockDb: any;
  let mockTrx: any;

  beforeEach(() => {
    mockTrx = {
      delete: jest.fn().mockReturnThis(),
      where: jest.fn().mockResolvedValue(undefined),
      insert: jest.fn().mockReturnThis(),
      values: jest.fn().mockReturnThis(),
      onConflictDoUpdate: jest
        .fn()
        .mockResolvedValue({ command: 'INSERT', rowCount: 3 }),
    };

    mockDb = {
      transaction: jest.fn(fn => fn(mockTrx)),
    };
    //@ts-ignore
    service = new BulkOps(db, transaction);
    service.db = mockDb;
    service.model = {
      id: 'id',
      accountDetailsId: 'accountDetailsId',
      bookingDate: 'bookingDate',
      valueDate: 'valueDate',
      bookingDateTime: 'bookingDateTime',
      valueDateTime: 'valueDateTime',
      transactionAmount: 'transactionAmount',
      creditorName: 'creditorName',
      creditorAccount: 'creditorAccount',
      debtorName: 'debtorName',
      debtorAccount: 'debtorAccount',
      remittanceInformationUnstructuredArray:
        'remittanceInformationUnstructuredArray',
      proprietaryBankTransactionCode: 'proprietaryBankTransactionCode',
      internalTransactionId: 'internalTransactionId',
    };
  });

  it('should delete existing transactions and bulk insert new ones', async () => {
    const inputTransactions = [
      { creditorName: 'Amazon', debtorName: 'User', transactionAmount: 100 },
      { creditorName: 'Netflix', debtorName: 'User', transactionAmount: 15 },
    ];

    // Stub lodash.map to return transformed transactions
    (_.map as jest.Mock).mockImplementation((transactions, iteratee) =>
      transactions.map(iteratee)
    );

    await service.bulkWriteOps(inputTransactions, 'account123');

    expect(mockDb.transaction).toHaveBeenCalledTimes(1);
    expect(mockTrx.delete).toHaveBeenCalledWith(service.model);
    expect(mockTrx.where).toHaveBeenCalledTimes(1);

    expect(mockTrx.insert).toHaveBeenCalledWith(service.model);
    expect(mockTrx.values).toHaveBeenCalledWith([
      {
        accountDetailsId: 'account123',
        creditorName: 'Amazon',
        debtorName: 'User',
        id: expect.any(String),
        transactionAmount: 100,
      },
      {
        accountDetailsId: 'account123',
        creditorName: 'Netflix',
        debtorName: 'User',
        id: expect.any(String),
        transactionAmount: 15,
      },
    ]);

    expect(mockTrx.onConflictDoUpdate).toHaveBeenCalledWith({
      target: ['id'],
      set: expect.any(Object),
    });
  });
});
