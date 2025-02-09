declare namespace Express {
  export interface Request {
    cid?: string; // For request tracking only
  }
}
