import { z } from 'zod';

export const createUserAgreementSchema = z.object({
  body: z.object({
    institutionId: z
      .string({
        required_error: 'You must have a institutionId',
        invalid_type_error: 'Your institutionId must be a string',
      })
      .max(255)
      .min(4),
    maxHistoricalDays: z.number({
      required_error: 'You must have a maxHistoricalDays',
      invalid_type_error: 'Your maxHistoricalDays must be a number',
    }),
    accessValidForDays: z.number({
      required_error: 'You must have a accessValidForDays',
      invalid_type_error: 'Your accessValidForDays must be a number',
    }),
  }),
});

export const requisitionsSchema = z.object({
  body: z.object({
    institutionId: z
      .string({
        required_error: 'You must have a institutionId',
        invalid_type_error: 'Your institutionId must be a string',
      })
      .max(255)
      .min(4),
    agreementId: z
      .string({
        required_error: 'You must have an agreementId',
        invalid_type_error: 'Your agreementId must be a valid string',
      })
      .max(255)
      .min(4),
  }),
});

export const retrieveAccountSchema = z.object({
  params: z.object({
    requisitionId: z
      .string({
        required_error: 'You must have a requisitionId',
        invalid_type_error: 'Your requisitionId must be a string',
      })
      .max(255)
      .min(4),
  }),
});
