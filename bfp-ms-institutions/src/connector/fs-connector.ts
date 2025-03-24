import fs from 'fs';
import { Institutions } from '../models/institutions-model';

interface IFsConnector {
  getInstitutions(): Promise<Array<Institutions>>;
}

class FsConnector implements IFsConnector {
  private readonly filepath: string;
  constructor(filepath: string) {
    this.filepath = filepath;
  }

  async getInstitutions(): Promise<Array<Institutions>> {
    const response = fs.readFileSync(this.filepath, { encoding: 'utf-8' });
    return JSON.parse(response);
  }
}

export default FsConnector;
