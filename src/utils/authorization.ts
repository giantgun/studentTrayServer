import jwt from "jsonwebtoken"
import { Request, Response, NextFunction } from "express"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const authorization = async  (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const cookieName = 'access_token';
    const cookieValue = await req.cookies[cookieName]
    const tokenSecret = process.env.TOKEN_SECRET
  
    if (!cookieValue) {
      return res.status(401).json('Unauthorized')
    }
  
    const decodedToken = jwt.verify(cookieValue, tokenSecret! )
    const email = JSON.parse(JSON.stringify(decodedToken)).email

    const user = await prisma.user.findUnique({ 
      where: { email: email },
      select: {
        school: true,
        password: true,
        username: true,
        userId: true,
        email: true,
        photoUrl: true,    
        phoneNumber: true,  
        createdAt: true,   
        updatedAt: true,   
        schoolId: true,    
        business: true,    
        item: true,        
        lodge: true,       
        review: true,      
        room: true,        
        service: true,
      }
    })

    if (!user) {
      return res.status(401).json('Invalid token')
    }
    
    req.user = user
    next();
};