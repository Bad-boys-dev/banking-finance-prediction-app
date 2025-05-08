import { Institutions } from '../../models/institutions-model';

interface IService {
  searchInstitutionsByName(text: string): Promise<Array<Institutions>>;
  lookupInstitutions(
    page: number,
    limit: number
  ): Promise<{
    institutions: any;
    pagination: {
      pages: number;
      offset: number;
      limit: number;
      totalPages: number;
    };
  }>;
  getInstitutionById(id: string): Promise<Object>;
}

class Service implements IService {
  private db: any;

  constructor(db: any) {
    this.db = db;
  }

  async searchInstitutionsByName(text: any): Promise<Array<Institutions>> {
    return await this.db.searchByName.searchInstitutionByName(text);
  }

  async lookupInstitutions(
    page: number,
    limit: number
  ): Promise<{
    institutions: any;
    pagination: {
      pages: number;
      offset: number;
      limit: number;
      totalPages: number;
    };
  }> {
    const offset = (page - 1) * limit;

    const count = await this.db.getList.countInstitutions();
    const totalPages = Math.ceil(count / limit);

    const institutions = await this.db.getList.lookupInstitutions(
      limit,
      offset
    );

    return {
      institutions,
      pagination: {
        pages: page,
        limit,
        offset,
        totalPages,
      },
    };
  }

  async getInstitutionById(id: string) {
    return this.db.getById.getInstitutionById(id);
  }
}

export default Service;
