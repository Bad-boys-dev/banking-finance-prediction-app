import { z } from 'zod';

export const transactionsSyncSchema = z.object({
  body: z.object({
    accountId: z.string({
      required_error: 'accountId is required',
      invalid_type_error: 'accountId must be a string',
    }),
  }),
});

export const balancesSyncSchema = z.object({
  body: z.object({
    accountId: z.string({
      required_error: 'accountId is required',
      invalid_type_error: 'accountId must be a string',
    }),
  }),
});
