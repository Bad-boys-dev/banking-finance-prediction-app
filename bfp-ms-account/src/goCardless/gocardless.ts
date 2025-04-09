// @ts-ignore
import { goCardlessClient } from 'go-cardless-client-lib/dist';
import cache from '../utils/cache';
import logger from '../utils/logger';

export interface IBuildLinkPayload {
  institution_id: string;
  agreement_id?: string;
  access_token: string;
}

// interface IConnector {
//   retrieveAccessToken: () => Promise<object|any>;
//   lookupInstitutions: (access_token: string) => Promise<Array<any>|any>;
//   lookupInstitution: (access_token: string, id: string) => Promise<object|any>;
//   createEndUserAgreement: (access_token: string, institution_id: string, max_historical_days: any, access_valid_for_days: any, access_scope: Array<String>) => Promise<object|any>;
//   linkToBuildForUser: (payload: IBuildLinkPayload) => Promise<object|any>;
// }

/**
 * This function generates us an access token
 */
export const getAccessToken = async (body: object) =>
  await goCardlessClient({
    url: `${process.env.BASE_URL}/api/v2/token/new/`,
    method: 'POST',
    body,
  });

export const retrieveAccessToken = async () => {
  const cachedToken = cache.get('token_cached');

  if (cachedToken) return cachedToken;

  const { SECRET_KEY, SECRET_ID } = process.env;

  const secrets = {
    secret_id: SECRET_ID,
    secret_key: SECRET_KEY,
  };
  const accessToken = await getAccessToken(secrets);

  const ttl = 36000;
  const cacheTTL = Math.max(ttl, 900);

  cache.set('token_cached', accessToken, cacheTTL);
  logger().info('Successfully cached an accessToken');

  return accessToken;
};

/**
 * This function looks up all the bank institutions available
 * in the go cardless api
 */
export const lookupInstitutions = async (access_token: string) =>
  await goCardlessClient({
    url: `${process.env.BASE_URL}/api/v2/institutions?country=GB`,
    method: 'GET',
    body: null,
    access_token,
  });

/**
 * This function looks up bank institution by id
 * in the go cardless api
 */
export const lookupInstitution = async (access_token: string, id: string) =>
  await goCardlessClient({
    url: `${process.env.BASE_URL}/api/v2/institutions/${id}`,
    method: 'GET',
    body: null,
    access_token,
  });

/**
 * Creates a end user agreement between client and the user
 */
export const createEndUserAgreement = async ({
  access_token,
  institution_id,
  max_historical_days,
  access_valid_for_days,
  access_scope,
}: any) =>
  await goCardlessClient({
    url: `${process.env.BASE_URL}/api/v2/agreements/enduser/`,
    method: 'POST',
    body: {
      institution_id,
      max_historical_days,
      access_valid_for_days,
      access_scope,
    },
    access_token,
  });

/**
 * Creates a requisition, this is the endpoint that builds
 * the link between the user and their bank.
 */
export const linkToBuildForUser = async (payload: IBuildLinkPayload) =>
  await goCardlessClient({
    url: `${process.env.BASE_URL}/api/v2/requisitions/`,
    method: 'POST',
    body: {
      institution_id: payload.institution_id,
      agreement: payload.agreement_id,
      redirect: 'http://localhost:5173',
    },
    access_token: payload.access_token,
  });

/**
 * Gets all the available accounts
 */
export const getAccounts = async (
  requisition_id: string,
  access_token: string
) =>
  await goCardlessClient({
    url: `${process.env.BASE_URL}/api/v2/requisitions/${requisition_id}`,
    method: 'GET',
    body: null,
    access_token,
  });

/**
 * Gets all the available bank connections
 */
export const lookupRequisitions = async (access_token: string) =>
  await goCardlessClient({
    url: `${process.env.BASE_URL}/api/v2/requisitions?limit=5&offset=0`,
    method: 'GET',
    body: null,
    access_token,
  });

/**
 * Gets all the available bank connections
 */
export const deleteRequisition = async (
  requisition_id: string,
  access_token: string
) =>
  await goCardlessClient({
    url: `${process.env.BASE_URL}/api/v2/requisitions/${requisition_id}`,
    method: 'DELETE',
    body: null,
    access_token,
  });

/**
 * Gains account access and retrieves all the account transactions
 */
export const accessAccounts = async (
  account_id: string,
  access_token: string
) =>
  await goCardlessClient({
    url: `${process.env.BASE_URL}/api/v2/accounts/${account_id}/transactions`,
    method: 'GET',
    body: null,
    access_token,
  });

export const accessAccountBalance = async (
  account_id: string,
  access_token: string
) =>
  await goCardlessClient({
    url: `${process.env.BASE_URL}/api/v2/accounts/${account_id}/balances`,
    method: 'GET',
    body: null,
    access_token,
  });

export const accessAccountDetails = async (
  account_id: string,
  access_token: string
) =>
  await goCardlessClient({
    url: `${process.env.BASE_URL}/api/v2/accounts/${account_id}/details`,
    method: 'GET',
    body: null,
    access_token,
  });
