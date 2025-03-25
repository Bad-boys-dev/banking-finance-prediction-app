import path from 'path';
import { CronJob } from 'cron';
import { FsConnector } from './connector';
import { Service } from './api/service';
import { institutions } from './mongo';
import { BulkOps, GetList, SearchInstitutions } from './mongo/operations';

const filepath = path.resolve(
  __dirname,
  './institutionHoldings/institutions.json'
);

const connector = new FsConnector(filepath);
const searchByName = new SearchInstitutions(institutions);
const getList = new GetList(institutions);
export const service = new Service({ searchByName, getList });

const bulkOperation = new BulkOps(institutions);

export const startSyncingJob = () => {
  new CronJob('* * 16 1 1 7', async function() {
    await bulkOperation.bulkWriteInstitutions(await connector.getInstitutions());
    console.log('Institutions sync successful 🚀');
  },
    null, // onComplete
    true
    )
}