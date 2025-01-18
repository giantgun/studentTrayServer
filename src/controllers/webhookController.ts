import { NextFunction, Request, Response } from "express"
import crypto from 'crypto'
 
const secret = process.env.PAYSTACK_SECRET_KEY as string

export async function paystackWebHook(req: Request, res: Response) {
    //validate event
    const hash = crypto.createHmac('sha512', secret).update(JSON.stringify(req.body)).digest('hex');
    if (hash == req.headers['x-paystack-signature']) {
    // Retrieve the request's body
    const event = req.body
    // Do something with event  
    }
    res.send(200)
}