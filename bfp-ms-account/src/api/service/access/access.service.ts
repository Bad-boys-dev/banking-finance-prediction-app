import * as connector from '../../../goCardless/gocardless';
import { BadRequest } from '../../../errors';

const createUserAgreement = async (
  institutionId: string,
  maxHistoricalDays: number,
  accessValidForDays: number,
  accessScope: string[]
) => {
  const { access } = await connector.retrieveAccessToken();
  // const { access } = await store();

  if (!access) throw new BadRequest('Access token missing!');

  let response: object;

  try {
    response = await connector.createEndUserAgreement({
      access_token: access,
      institution_id: institutionId,
      max_historical_days: maxHistoricalDays,
      access_valid_for_days: accessValidForDays,
      access_scope: accessScope,
    });
  } catch (err) {
    console.log('Failed to create user agreement:', err);
    throw err;
  }

  return response;
};

const createRequisition = async (
  institutionId: string,
  agreementId: string
) => {
  console.log(institutionId, agreementId);

  const { access: access_token } = await connector.retrieveAccessToken();
  let response;
  try {
    response = await connector.linkToBuildForUser({
      institution_id: institutionId,
      agreement_id: agreementId,
      access_token,
    });
  } catch (err: any) {
    console.log('Failed to create requisition for user:', err);
    throw new Error(err.message);
  }

  return response;
};

const getRequisitionAccounts = async (requisitionId: string) => {
  const { access: access_token } = await connector.retrieveAccessToken();
  let requisition: object;

  try {
    requisition = await connector.getAccounts(requisitionId, access_token);
  } catch (err: any) {
    console.log('Failed to get requisition for end user:', err);
    throw new Error(err.message);
  }

  return requisition;
};

export const service = {
  createUserAgreement,
  createRequisition,
  getRequisitionAccounts,
};
