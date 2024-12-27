import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: any; // or a specific type, e.g., { id: number, name: string }
    }
  }
}

type signUpReqBody = { body:
     { 
        username: string;
        firstName: string;
        lastName: string; 
        email: string; 
        password: string;
     }
}