import { and, eq, sql } from 'drizzle-orm';
import { DrizzleD1Database } from 'drizzle-orm/d1';

interface IRetrieveOps {
  getTransactionsByAccountId(
    accountId: string,
    paginationObj: {
      pages: number;
      limit: number;
      offSet: number;
      totalPages: number;
    },
    payload: any
  ): Promise<Array<any>>;
  getTransactionCount(accountId: string): Promise<Number>;
}

class RetrieveOps implements IRetrieveOps {
  private db: DrizzleD1Database;
  private model: any;

  constructor(db: DrizzleD1Database, model: any) {
    this.db = db;
    this.model = model;
  }

  async getTransactionsByAccountId(
    accountId: string,
    paginationObj: {
      limit: number;
      offSet: number;
    },
    payload: any
  ): Promise<Array<any>> {
    const response: any[] = await this.db
      .select(payload)
      .from(this.model)
      .where(and(eq(this.model.accountDetailsId, accountId)))
      .limit(paginationObj.limit)
      .offset(paginationObj.offSet);

    if (response.length === 0) return [];

    return response;
  }

  async getTransactionCount(accountId: string) {
    const response = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(this.model)
      .where(and(eq(this.model.accountDetailsId, accountId)));

    return response[0].count;
  }
}

export default RetrieveOps;
