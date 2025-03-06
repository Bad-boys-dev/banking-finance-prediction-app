import * as connector from '../../../goCardless/gocardless';
import { BadRequest } from '../../../errors';
import logger from '../../../utils/logger';
import { getAccounts, lookupInstitution } from '../../../goCardless/gocardless';

interface IRequisition {
  name: string;
  logo: string;
  countries: string[];
  data: { ssn: any; accounts: string[]; status: string; created: Date };
}

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

const getRequisitions = async (log: object | any) => {
  const { access: access_token } = await connector.retrieveAccessToken();
  let res: IRequisition[] = [];
  let results: any;

  try {
    ({ results } = await connector.lookupRequisitions(access_token));
    log.info('Successful lookup of account requisitions');

    if (results.length === 0) return res;
  } catch (err: any) {
    log.error(err.message);
    throw new Error('Failed to retrieve the requisitions');
  }

  for (const result of results) {
    const { institution_id, created, status, accounts, ssn } = result;

    try {
      const institution = await connector.lookupInstitution(
        access_token,
        institution_id
      );

      res.push({
        name: institution.name,
        logo: institution.logo,
        countries: institution.countries,
        data: { ssn, accounts, status, created },
      });
    } catch (err: any) {
      log.error(err.message);
      throw new Error('Failed to pull back institution details');
    }
  }

  return res;
};

export const service = {
  createUserAgreement,
  createRequisition,
  getRequisitionAccounts,
  getRequisitions,
};
