import * as connector from '../../../goCardless/gocardless';
import { BadRequest } from '../../../errors';
import logger from '../../../utils/logger';

const createUserAgreement = async (
  institutionId: string,
  maxHistoricalDays: number,
  accessValidForDays: number,
  accessScope: string[],
  cid?: string
) => {
  const { access } = await connector.retrieveAccessToken();
  if (!access) throw new BadRequest('Access token missing!');

  let response: object;

  try {
    response = await connector.createEndUserAgreement({
      access_token: access,
      institution_id: institutionId,
      max_historical_days: +maxHistoricalDays,
      access_valid_for_days: +accessValidForDays,
      access_scope: accessScope,
    });
    logger(cid, { accessScope }).info('Created new agreement');
  } catch (err) {
    logger(cid).error('Failed to create user agreement');
    throw err;
  }

  return response;
};

const createRequisition = async (
  institutionId: string,
  agreementId: string
) => {
  const { access: access_token } = await connector.retrieveAccessToken();
  let response;
  try {
    response = await connector.linkToBuildForUser({
      institution_id: institutionId,
      agreement_id: agreementId,
      access_token,
    });
  } catch (err: any) {
    logger(undefined).error('Failed to create requisition for user');
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
    logger(undefined).error('Failed to get a requisition for end user');
    throw new Error(err.message);
  }

  return requisition;
};

const getInstitution = async (institutionId: any, log: object | any) => {
  const { access: access_token } = await connector.retrieveAccessToken();
  try {
    const response = await connector.lookupInstitution(
      access_token,
      institutionId
    );
    return response;
  } catch (err: any) {
    log.error(err.message);
    throw new Error('Failed to retrieve the institution');
  }
};

const getRequisitions = async (log: object | any) => {
  const { access: access_token } = await connector.retrieveAccessToken();
  try {
    const response = await connector.lookupRequisitions(access_token);

    return response;
  } catch (err: any) {
    log.error(err.message);
    throw new Error('Failed to retrieve the requisitions');
  }
};

export const service = {
  createUserAgreement,
  createRequisition,
  getRequisitionAccounts,
  getInstitution,
  getRequisitions,
};
