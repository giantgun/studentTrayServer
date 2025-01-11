declare namespace Express {
    export interface Request {
       urlToOverwrite?: string
       user?: any
       urlArrayToDelete?: any[]
    }
 }