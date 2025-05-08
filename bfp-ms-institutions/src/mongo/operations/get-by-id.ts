import { Model } from 'mongoose';

interface IGetInstitutionById {
  getInstitutionById(id: string): Promise<Object>;
}

class GetById implements IGetInstitutionById {
  private model: Model<any>;
  constructor(model: Model<any>) {
    this.model = model;
  }

  async getInstitutionById(id: string): Promise<Object> {
    const response = await this.model.findById(id);

    if (response === null) return {};

    return response;
  }
}

export default GetById;
