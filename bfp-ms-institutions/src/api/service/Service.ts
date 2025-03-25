import { Institutions } from '../../models/institutions-model';

interface IService {
  searchInstitutionsByName (text: string): Promise<Array<Institutions>>
  lookupInstitutions(): Promise<Array<Institutions>>
}

class Service implements IService {
  private db: any;

  constructor(db: any) {
    this.db = db
  }

  async searchInstitutionsByName(text: any): Promise<Array<Institutions>> {
    return await this.db.searchByName.searchInstitutionByName(text);
  }

  async lookupInstitutions(): Promise<Array<Institutions>> {
    return await this.db.getList.lookupInstitutions();
  }
}

export default Service;