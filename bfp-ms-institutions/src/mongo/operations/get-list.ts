import { Model } from 'mongoose';
import { Institutions } from '../../models/institutions-model';

interface IGetList {
  lookupInstitutions (): Promise<Array<Institutions>>
}

class GetList implements IGetList {
  private model: Model<any>
  constructor(model: Model<any>) {
    this.model = model;
  }

  async lookupInstitutions(): Promise<Array<Institutions>> {
    const institutions = await this.model.find({});

    if(!institutions) {
      return []
    }

    return institutions
  }
}

export default GetList;