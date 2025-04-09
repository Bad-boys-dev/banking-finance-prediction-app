import * as connector from './goCardless/gocardless';
import AccessService from './api/service/access/access.service';
import logger from './utils/logger';
import { db } from './db';
import { transaction } from './models';
import { BulkOps } from './operations';

export const service = new AccessService(connector, logger);
//@ts-ignore
export const bulkOps = new BulkOps(db, transaction);
