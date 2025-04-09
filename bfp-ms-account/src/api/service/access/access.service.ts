import { BadRequest, NotAuthorized } from '../../../errors';
import { IConnector, IAccessService } from '../../../types';

// scope access array with the list of access props
const accessScope = ['balances', 'details', 'transactions'];

class AccessService implements IAccessService {
  private readonly connector: IConnector;
  private logger: object | any;
  constructor(connector: IConnector, logger: object | any) {
    this.connector = connector;
    this.logger = logger;
  }

  async connectBankAccount(
    institutionId: any,
    cid: string | undefined
  ): Promise<any> {
    let access: string = '';

    try {
      ({ access } = await this.connector.retrieveAccessToken());
    } catch (err: any) {
      throw new Error('Failed to retrieve access token!');
    }

    if (!access) throw new NotAuthorized('access token is required!');

    try {
      this.logger(cid).info('Starting process to build a link for user...');
      const institution = await this.connector.lookupInstitution(
        access,
        institutionId
      );

      const agreement = await this.connector.createEndUserAgreement({
        access_token: access,
        institution_id: institution.id,
        max_historical_days: 730,
        access_valid_for_days: 30,
        access_scope: accessScope,
      });

      const response = await this.connector.linkToBuildForUser({
        institution_id: institution.id,
        agreement_id: agreement.id,
        access_token: access,
      });

      this.logger(cid).info('Done');
      return response;
    } catch (err: any) {
      this.logger(cid).error(`Failed to build new link: ${err.message}`);
      throw new Error('Failed to build new link!');
    }
  }

  async retrieveRequisition(
    requisitionId: string,
    cid: string | undefined
  ): Promise<any> {
    let access: string = '';

    try {
      ({ access } = await this.connector.retrieveAccessToken());
    } catch (err: any) {
      throw new Error("Couldn't to retrieve access token!");
    }

    if (!access) throw new NotAuthorized('access token is required!');

    let response: object = {};
    try {
      response = await this.connector.getAccounts(requisitionId, access);
      this.logger(cid).info('Loaded account requisition for user');
    } catch (err: unknown) {
      if (typeof err === 'object' && err !== null && 'message' in err)
        console.error(err.message);

      throw new Error('Could not fetch requisition');
    }

    if (Object.keys(response).length === 0)
      throw new BadRequest('Account Requisition was not found!');

    return response;
  }
}

export default AccessService;
