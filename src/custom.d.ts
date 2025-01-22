declare namespace Express {
  export interface Request {
    urlToOverwrite?: string;
    user?: any;
    urlArrayToDelete?: any[];
    productTier?: "free" | "paid";
    product?: "item" | "service" | "lodge" | "room";
    referenceText: string;
  }
}

declare module "node-cron";
