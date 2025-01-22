import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const giveAuthorization = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  const cookieName = "access_token";
  const cookieValue = await req.cookies[cookieName];
  const tokenSecret = process.env.TOKEN_SECRET;

  if (!cookieValue) {
    return res.status(401).json("Unauthorized");
  }

  const decodedToken = jwt.verify(cookieValue, tokenSecret!);
  const email = JSON.parse(JSON.stringify(decodedToken)).email;

  const user = await prisma.user.findUnique({ where: { email: email } });

  if (!user) {
    return res.status(401).json("Invalid token");
  }

  return res.status(200).json("authorized");
};
