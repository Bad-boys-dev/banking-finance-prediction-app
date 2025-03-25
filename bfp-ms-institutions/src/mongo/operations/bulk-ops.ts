import {  Model } from 'mongoose';
import { Institutions } from '../../models/institutions-model';

interface IBulkOps {
  bulkWriteInstitutions (data: Institutions[]): Promise<any>
}

class BulkOps implements IBulkOps {
  private model: Model
  constructor(model: Model) {
    this.model = model;
  }

  async bulkWriteInstitutions (data: Institutions[]): Promise<any> {
    const bulkOps = data.map((institution: Institutions) => ({
      updateOne: {
        filter: { _id: institution.id },
        update: { institution },
        upsert: true
      }
    }));

    const response = await this.model.bulkWrite(bulkOps);
    console.log('Matched', response.matchedCount);
    console.log(`Modified: ${response.modifiedCount}`);
    console.log(`Inserted: ${response.upsertedCount}`);

    return response;
  }
}

export default BulkOps