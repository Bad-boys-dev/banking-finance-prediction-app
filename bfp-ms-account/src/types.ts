import { accessAccounts } from './goCardless/gocardless';

export interface IAccessService {
  connectBankAccount(institutionId: any, cid: string | undefined): Promise<any>;
  retrieveRequisition(
    requisitionId: string,
    cid: string | undefined
  ): Promise<any>;
}

export interface IAgreement {
  access_token: string;
  institution_id: string;
  max_historical_days: any;
  access_valid_for_days: any;
  access_scope: Array<String>;
}

export interface IBuildLinkPayload {
  institution_id: string;
  agreement_id?: string;
  access_token: string;
}

export interface IConnector {
  retrieveAccessToken: () => Promise<object | any>;
  lookupInstitutions: (access_token: string) => Promise<Array<any> | any>;
  lookupInstitution: (
    access_token: string,
    id: string
  ) => Promise<object | any>;
  createEndUserAgreement: ({
    access_token,
    institution_id,
    max_historical_days,
    access_valid_for_days,
    access_scope,
  }: IAgreement) => Promise<object | any>;
  linkToBuildForUser: (payload: IBuildLinkPayload) => Promise<object | any>;
  getAccounts: (
    requisition_id: string,
    access_token: string
  ) => Promise<Object>;
  accessAccounts: (account_id: string, access_token: string) => Promise<any>;
}
