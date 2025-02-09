import { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function create_business_profile_photo_folder(req: Request, res: Response, next: NextFunction): Promise<any>{
  const user = req.user
  req.imageUploadFolderPath = `${user.email}/businessProfilePhoto`
  next()
}

export async function create_business_cover_photo_folder(req: Request, res: Response, next: NextFunction): Promise<any>{
  const user = req.user
  req.imageUploadFolderPath = `${user.email}/businessCoverPhoto`
  next()
}

export async function register_business(
  req: Request,
  res: Response,
): Promise<any> {
  const {
    businessName,
    address,
    businessEmail,
    phoneNumber,
    nearestSchool,
    description,
    firstName,
    lastName,
  } = req.body;
  const userId = req.user.userId;
  const user = req.user;

  if (
    !businessName ||
    !address ||
    !businessEmail ||
    !phoneNumber ||
    !nearestSchool ||
    !description ||
    !firstName ||
    !lastName
  ) {
    return res.status(400).json("Invalid input.");
  }

  const school = await prisma.school.findUnique({
    where: { schoolName: nearestSchool },
  });

  if (!school) {
    return res.status(400).json("Invalid input.");
  }

  const currentDate = new Date();
  await prisma.business.create({
    data: {
      businessName: businessName,
      address: address,
      businessEmail: businessEmail,
      phoneNumber: phoneNumber,
      description: description,
      firstName: firstName,
      lastName: lastName,
      updatedAt: currentDate,
      nearestSchoolId: school?.schoolId,
      userId: userId,
    },
  });

  const business = await prisma.business.findUnique({
    where: { userId: userId },
    include: {
      school: true,
    },
  });

  return res.status(200).json({
    user: {
      username: user.username,
      school: user.school,
      photoUrl: user.photoUrl,
    },
    business: {
      businessName: business!.businessName,
      address: business!.address,
      businessEmail: business!.businessEmail,
      phoneNumber: business!.phoneNumber,
      nearestSchool: business!.school.schoolName,
      description: business!.description,
      dateJoined: business!.createdAt,
    },
  });
}

export async function edit_business(req: Request, res: Response): Promise<any> {
  const {
    businessName,
    businessEmail,
    phoneNumber,
    nearestSchool,
    description,
  } = req.body;
  const userId = req.user.userId;
  const user = req.user;

  if (
    !businessName ||
    !businessEmail ||
    !phoneNumber ||
    !nearestSchool ||
    !description
  ) {
    return res.status(400).json("Invalid input.");
  }

  const business = await prisma.business.update({
    where: { userId: userId },
    data: {
      businessName: businessName,
      businessEmail: businessEmail,
      phoneNumber: phoneNumber,
      description: description,
      school: {
        connect: {
          schoolName: nearestSchool,
        },
      },
    },
    include: {
      school: true,
    },
  });

  return res.status(200).json({
    user: {
      username: user.username,
      school: user.school,
      dateOfBirth: user.dateOfBirth,
      photoUrl: user.photoUrl,
    },
    business: {
      businessName: business!.businessName,
      address: business!.address,
      businessEmail: business!.businessEmail,
      phoneNumber: business!.phoneNumber,
      nearestSchool: business!.school.schoolName,
      description: business!.description,
      dateJoined: business!.createdAt,
    },
  });
}

export async function get__business_public(
  req: Request,
  res: Response,
): Promise<any> {
  const businessId = Number(req.params.businessId);

  const reviews = await prisma.review.findMany({
    where: { businessId: businessId },
  });
  const business = await prisma.business.findUnique({
    where: { businessId: businessId },
    include: {
      school: true,
    },
  });

  if (!business) {
    return res.status(400).json("Business does not exist");
  }

  const user = await prisma.user.findUnique({
    where: { userId: business.userId },
    include: {
      item: true,
      lodge: true,
      service: true,
      room: true,
    },
  });

  let businessReviews = [];

  for (let i = 0; i < reviews.length; i++) {
    const owner = await prisma.user.findUnique({
      where: { userId: reviews[i].ownerUserId },
    });
    const review = {
      ...reviews[i],
      ownerPhotoUrl: owner?.photoUrl,
      username: owner?.username,
    };
    businessReviews.push(review);
  }

  return res.json({
    businessName: business?.businessName,
    businessEmail: business?.businessEmail,
    nearestSchool: business?.school.schoolName,
    photoUrl: business?.photoUrl,
    coverPhotoUrl: business?.coverPhotoUrl,
    businessId: business?.businessId,
    phoneNumber: business?.phoneNumber,
    dateJoined: business?.createdAt,
    description: business?.description,
    reviews: businessReviews,
    items: user!.item,
    services: user!.service,
    lodges: user!.lodge,
    rooms: user!.room,
  });
}

export async function get__business_private(
  req: Request,
  res: Response,
): Promise<any> {
  const userId = req.user.userId;
  const user = req.user;

  const business = await prisma.business.findUnique({
    where: { userId: userId },
    include: {
      school: true,
      review: true,
    },
  });

  if (!business) {
    return res.status(400).json("Business does not exist");
  }

  let businessReviews = [];

  for (let i = 0; i < business.review.length; i++) {
    const owner = await prisma.user.findUnique({
      where: { userId: business.review[i].ownerUserId },
    });
    const review = {
      ...business.review[i],
      ownerPhotoUrl: owner?.photoUrl,
      username: owner?.username,
    };
    businessReviews.push(review);
  }

  return res.json({
    businessName: business?.businessName,
    businessEmail: business?.businessEmail,
    nearestSchool: business?.school.schoolName,
    photoUrl: business?.photoUrl,
    coverPhotoUrl: business?.coverPhotoUrl,
    businessId: business?.businessId,
    phoneNumber: business?.phoneNumber,
    dateJoined: business?.createdAt,
    description: business?.description,
    reviews: businessReviews,
    items: user!.item,
    services: user!.service,
    lodges: user!.lodge,
    rooms: user!.room,
  });
}

export async function get_business_photo_url_for_overwrite(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const user = req.user;

  const business = await prisma.business.findUnique({
    where: { userId: user.userId },
  });

  req.urlToOverwrite = business?.photoUrl as string;
  next();
}

export async function save_business_photo_url(
  req: Request,
  res: Response,
): Promise<any> {
  const user = req.user;
  const { photoUrl } = req.body;

  await prisma.business.update({
    where: { userId: user.userId },
    data: {
      photoUrl: photoUrl,
    },
  });

  return res.json("Upload succesful.");
}

export async function get_business_cover_photo_url_for_overwrite(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const user = req.user;

  const business = await prisma.business.findUnique({
    where: { userId: user.userId },
  });

  req.urlToOverwrite = business?.coverPhotoUrl as string;
  next();
}

export async function save_business_cover_photo_url(
  req: Request,
  res: Response,
): Promise<any> {
  const user = req.user;
  const { coverPhotoUrl } = req.body;

  await prisma.business.update({
    where: { userId: user.userId },
    data: {
      coverPhotoUrl: coverPhotoUrl,
    },
  });

  return res.json("Upload succesful.");
}
