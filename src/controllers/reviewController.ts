import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export async function create_user_review(
  req: Request,
  res: Response,
): Promise<any> {
  const ownerUserId = req.user.userId;
  const { numberOfStars, description } = req.body;
  const userId = Number(req.params.userId);

  if (Number(ownerUserId) == userId){
    return res.status(403).json("You cannot review your own account!")
  }

  const currentDate = new Date();
  await prisma.review.create({
    data: {
      numberOfStars,
      description,
      userId,
      ownerUserId,
      updatedAt: currentDate,
    },
  });

  return res.status(200).json("You've successfully reviewed the user.");
}

export async function create_business_review(
  req: Request,
  res: Response,
): Promise<any> {
  const ownerUserId = req.user.userId;
  const { numberOfStars, description } = req.body;
  const businessId = Number(req.params.businessId);
  const user = req.user

  const business = await prisma.business.findUnique({
    where: {
      businessId
    }
  })

  if(!business){
    return res.status(400).json("Invalid input.")
  }

  if (ownerUserId === business.userId ){
    return res.status(403).json("You cannot review your own business!")
  }

  const currentDate = new Date();
  await prisma.review.create({
    data: {
      numberOfStars,
      description,
      businessId,
      ownerUserId,
      updatedAt: currentDate,
    },
  });

  return res.status(200).json("You've successfully reviewed the business.");
}
