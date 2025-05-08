import { Model } from 'mongoose';
import { Institutions } from '../../models/institutions-model';

interface IGetList {
  lookupInstitutions(
    limit?: number,
    skip?: number
  ): Promise<Array<Institutions>>;
  countInstitutions(): Promise<Number>;
}

class GetList implements IGetList {
  private model: Model<any>;
  constructor(model: Model<any>) {
    this.model = model;
  }

  async lookupInstitutions(
    limit?: number,
    skip?: number
  ): Promise<Array<Institutions>> {
    let institutions;
    if (typeof limit === 'number' && typeof skip === 'number') {
      institutions = await this.model.find({}).limit(limit).skip(skip);
    }

    if (!institutions) {
      return [];
    }

    return institutions;
  }

  async countInstitutions(): Promise<Number> {
    const count = await this.model.countDocuments();

    if (!count) return 0;

    return count;
  }
}

export default GetList;
