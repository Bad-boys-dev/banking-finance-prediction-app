import path from 'path';
import { FsConnector } from './connector';
import { Service } from './api/service';
// import './institutionHoldings/institutions.json';

const filepath = path.resolve(
  __dirname,
  './institutionHoldings/institutions.json'
);

const connector = new FsConnector(filepath);
export const service = new Service(connector);