declare namespace Express {
  export interface Request {
    urlToOverwrite?: string;
    user?: any;
    urlArrayToDelete?: any[];
    productTier?: "free" | "paid";
    product?: "item" | "service" | "lodge" | "room";
    referenceText: string;
    planType: "unused" | "used" | undefined;
    paystackCustomerCode: string;
    plan: {
      planName: string;
      planCode: string;
      maxNumberOfSchools: number;
      maxNumberOfProducts: number;
    };
  }
}

declare module "node-cron";

declare module "nodemailer";
