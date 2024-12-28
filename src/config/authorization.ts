import jwt from "jsonwebtoken"
import { Request, Response, NextFunction } from "express"
import { User } from "../models/user"
import { FindOptions, InferAttributes } from "@sequelize/core"

export const authorization = async  (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const cookieName = 'access_token';
    const cookieValue = await req.cookies[cookieName]
    const tokenSecret = process.env.TOKEN_SECRET
  
    if (!cookieValue) {
      return res.status(401).json('Unauthorized')
    }
  
    const decodedToken = jwt.verify(cookieValue, tokenSecret! )
    const email = JSON.parse(JSON.stringify(decodedToken)).email

    console.log(email)
    const user = await User.findOne({ where: { email: email } } )

    if (!user) {
      return res.status(401).json('Invalid token')
    }
    console.log(user)
    
    req.user = user
    next();
  };