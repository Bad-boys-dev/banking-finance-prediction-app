import { Model } from 'mongoose';
import { Institutions } from '../../models/institutions-model';

interface IBulkOps {
  bulkWriteInstitutions(data: Institutions[]): Promise<any>;
}

class BulkOps implements IBulkOps {
  private model: Model<any>;
  constructor(model: Model<any>) {
    this.model = model;
  }

  async bulkWriteInstitutions(data: Institutions[]): Promise<any> {
    try {
      const bulkOps = data.map((institution: Institutions) => ({
        updateOne: {
          filter: { _id: institution.id },
          update: { $set: institution },
          upsert: true,
        },
      }));

      const response = await this.model.bulkWrite(bulkOps);
      console.log('Matched', response.matchedCount);
      console.log(`Modified: ${response.modifiedCount}`);
      console.log(`Inserted: ${response.upsertedCount}`);

      if (data.length === 0) {
        return [];
      }

      return response;
    } catch (err: any) {
      console.log(err.message);
      throw err;
    }
  }
}

export default BulkOps;
