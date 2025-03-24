import { Institutions } from '../../models/institutions-model';

interface IService {
  lookupInstitutions (): Promise<Array<Institutions>>
}

class Service implements IService {
  private connector: any;

  constructor(connector: any) {
    this.connector = connector
  }

  async lookupInstitutions(): Promise<Array<Institutions>> {
    return await this.connector.getInstitutions();
  }
}

export default Service;