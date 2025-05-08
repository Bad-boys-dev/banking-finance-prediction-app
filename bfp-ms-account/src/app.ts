import * as connector from './goCardless/gocardless';
import AccessService from './api/service/access/access.service';
import DetailsService from './api/service/bankDetails/details.service';
import logger from './utils/logger';
import { db } from './db';
import { transaction as model } from './models';
import { BulkOps, RetrieveOps } from './operations';

//@ts-ignore
export const bulkOps = new BulkOps(db, model);
//@ts-ignore
export const retrieveTransactions = new RetrieveOps(db, model);
export const service = new AccessService(connector, logger);
export const detailsService = new DetailsService(
  connector,
  { bulkOps, retrieveTransactions },
  logger
);
