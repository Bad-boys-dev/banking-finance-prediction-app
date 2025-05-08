import { Model } from 'mongoose';
import { Institutions } from '../../models/institutions-model';

interface ISearchInstitution {
  searchInstitutionByName(text: string): Promise<Array<Institutions>>;
}

class SearchInstitution implements ISearchInstitution {
  private model: Model<any>;
  constructor(model: Model<any>) {
    this.model = model;
  }

  async searchInstitutionByName(text: string): Promise<Array<Institutions>> {
    const response = await this.model.find({
      name: { $regex: `${text}`, $options: 'i' },
    });

    if (response === null) return [];

    return response;
  }
}

export default SearchInstitution;
