import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";

const prisma = new PrismaClient();

export async function list_lodge(req: Request, res: Response): Promise<any> {
  const {
    propertyType,
    numberOfBedrooms,
    numberOfBathrooms,
    paymentFrequency,
    price,
    priceType,
    location,
    nearestSchool,
    walkingTime,
    kekeTime,
    description,
    WiFi,
    parking,
    electricity,
    water,
    electricityDescription,
    waterDescription,
    networkQuality,
    networkDescription,
    imagesUrlArrayString,
    numberOfLodges,
    agentFee,
    videoUrl,
  } = req.body;
  const userId = req.user.userId;

  if (
    !propertyType ||
    !paymentFrequency ||
    !numberOfLodges ||
    !price ||
    !priceType ||
    !location ||
    !nearestSchool ||
    !walkingTime ||
    !kekeTime ||
    !agentFee ||
    !description ||
    !networkQuality ||
    !imagesUrlArrayString ||
    imagesUrlArrayString.split(",").length <= 1
  ) {
    return res.status(400).json("Invalid input.");
  }

  const currentDate = new Date();
  await prisma.lodge.create({
    data: {
      propertyType: propertyType,
      numberOfBedrooms: Number(numberOfBedrooms),
      numberOfBathrooms: Number(numberOfBathrooms),
      paymentFrequency: paymentFrequency,
      price: Number(price),
      priceType: priceType,
      location: location,
      nearestSchool: nearestSchool,
      walkingTime: Number(walkingTime),
      kekeTime: Number(kekeTime),
      description: description,
      WiFi: WiFi,
      parking: parking,
      electricity: electricity,
      water: water,
      electricityDescription: electricityDescription,
      waterDescription: waterDescription,
      networkQuality: networkQuality,
      networkDescription: networkDescription,
      numberOfLodges: Number(numberOfLodges),
      imagesUrlArrayString: imagesUrlArrayString,
      agentFee: Number(agentFee),
      videoUrl,
      updatedAt: currentDate,
      user: {
        connect: {
          userId: userId,
        },
      },
      school: {
        connect: {
          schoolName: nearestSchool,
        },
      },
    },
  });
  return res.status(200).json("The lodge has been listed.");
}

export async function list_lodge_from_webhook(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> {
  const {
    propertyType,
    numberOfBedrooms,
    numberOfBathrooms,
    paymentFrequency,
    price,
    priceType,
    location,
    nearestSchool,
    walkingTime,
    kekeTime,
    description,
    WiFi,
    parking,
    electricity,
    water,
    electricityDescription,
    waterDescription,
    networkQuality,
    networkDescription,
    imagesUrlArrayString,
    numberOfLodges,
    agentFee,
    videoUrl,
  } = req.body;
  const userId = req.user.userId;
  const user = req.user;
  const product = req.product;

  if (user && product === "lodge") {
    const currentDate = new Date();
    await prisma.lodge.create({
      data: {
        propertyType: propertyType,
        numberOfBedrooms: Number(numberOfBedrooms),
        numberOfBathrooms: Number(numberOfBathrooms),
        paymentFrequency: paymentFrequency,
        price: Number(price),
        priceType: priceType,
        location: location,
        nearestSchool: nearestSchool,
        walkingTime: Number(walkingTime),
        kekeTime: Number(kekeTime),
        description: description,
        WiFi: WiFi,
        parking: parking,
        electricity: electricity,
        water: water,
        electricityDescription: electricityDescription,
        waterDescription: waterDescription,
        networkQuality: networkQuality,
        networkDescription: networkDescription,
        numberOfLodges: Number(numberOfLodges),
        imagesUrlArrayString: imagesUrlArrayString,
        agentFee: Number(agentFee),
        videoUrl,
        updatedAt: currentDate,
        user: {
          connect: {
            userId: userId,
          },
        },
        school: {
          connect: {
            schoolName: nearestSchool,
          },
        },
      },
    });
  }
  next();
}

export async function get_all_lodges(
  req: Request,
  res: Response,
): Promise<any> {
  const user = req.user;
  const searchedText = req.query.search;
  if (searchedText) {
    const lodges = await prisma.lodge.findMany({
      where: {
        OR: [
          { propertyType: { contains: `%${searchedText}%` } },
          { description: { contains: `%${searchedText}%` } },
        ],
        schoolId: user.school.schoolId,
      },
    });
    return res.status(200).json(lodges);
  }
  const allLodges = await prisma.lodge.findMany({
    where: { schoolId: user.school.schoolId },
  });
  return res.status(200).json(allLodges);
}

export async function get_a_lodge(req: Request, res: Response): Promise<any> {
  const user = req.user;
  const lodgeId = Number(req.params.lodgeId);

  const lodge = await prisma.lodge.findUnique({
    where: {
      lodgeId: lodgeId,
      schoolId: user.school.schoolId,
    },
  });

  if (!lodge) {
    return res.status(400).json("Lodge does not exist.");
  }

  const business = await prisma.business.findUnique({
    where: { userId: lodge.userId },
  });
  if (business) {
    return res.status(200).json({
      ...lodge,
      phoneNumber: business.phoneNumber,
      owner: "business",
      businessId: business.businessId,
      userId: 0,
    });
  }
  const owner = await prisma.user.findUnique({
    where: { userId: lodge?.userId },
  });

  return res.status(200).json({
    ...lodge,
    phoneNumber: owner?.phoneNumber,
    owner: "user",
  });
}

export async function delete_lodge(req: Request, res: Response): Promise<any> {
  const user = req.user;
  const lodgeId = Number(req.params.lodgeId);

  const oldLodge = await prisma.lodge.findFirst({
    where: { lodgeId: lodgeId, userId: user.userId },
  });

  if (!oldLodge) {
    return res.status(400).json("Unauthorized.");
  }

  await prisma.lodge.delete({
    where: { lodgeId: lodgeId, userId: user.userId },
  });

  return res.status(200).json("The lodge has been deleted successfully.");
}

export async function edit_lodge(req: Request, res: Response): Promise<any> {
  const {
    propertyType,
    numberOfBedrooms,
    numberOfBathrooms,
    paymentFrequency,
    price,
    priceType,
    location,
    nearestSchool,
    walkingTime,
    kekeTime,
    description,
    WiFi,
    parking,
    electricity,
    water,
    electricityDescription,
    waterDescription,
    networkQuality,
    networkDescription,
    numberOfLodges,
    agentFee,
  } = req.body;

  if (
    !propertyType ||
    !paymentFrequency ||
    !numberOfLodges ||
    !price ||
    !priceType ||
    !location ||
    !nearestSchool ||
    !walkingTime ||
    !kekeTime ||
    !agentFee ||
    !description ||
    !networkQuality
  ) {
    return res.status(400).json("Invalid input.");
  }

  const user = req.user;
  const lodgeId = Number(req.params.lodgeId);

  const lodge = await prisma.lodge.findFirst({
    where: { userId: user.userId, lodgeId: lodgeId },
  });

  if (!lodge) {
    return res.status(400).json("invalid input.");
  }

  await prisma.lodge.update({
    where: { userId: user.userId, lodgeId: lodgeId },
    data: {
      propertyType: propertyType,
      numberOfBedrooms: numberOfBedrooms,
      numberOfBathrooms: numberOfBathrooms,
      paymentFrequency: paymentFrequency,
      price: Number(price),
      priceType: priceType,
      location: location,
      nearestSchool: nearestSchool,
      walkingTime: Number(walkingTime),
      kekeTime: Number(kekeTime),
      description: description,
      WiFi: WiFi,
      parking: parking,
      electricity: electricity,
      water: water,
      electricityDescription: electricityDescription,
      waterDescription: waterDescription,
      networkQuality: networkQuality,
      networkDescription: networkDescription,
      userId: user.userId,
      numberOfLodges: Number(numberOfLodges),
      agentFee: Number(agentFee),
    },
  });

  return res.status(200).json("The lodge has been edited.");
}

export async function get_a_lodge_for_edit(
  req: Request,
  res: Response,
): Promise<any> {
  const lodgeId = Number(req.params.lodgeId);

  const lodge = await prisma.lodge.findUnique({
    where: { lodgeId: lodgeId },
    include: {
      school: true,
    },
  });

  return res.status(200).json(lodge);
}

export async function get_lodge_image_url_for_overwrite(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> {
  const user = req.user;
  const lodgeId = Number(req.params.lodgeId);
  const selectedIndex = req.params.selectedIndex;

  const lodges = user.lodge;

  function getImagesUrlArrayString() {
    for (let i = 0; i < lodges.length; i++) {
      if (lodges[i].lodgeId === lodgeId) {
        return lodges[i].imagesUrlArrayString;
      }
    }
    return null;
  }

  let imagesUrlArrayString = getImagesUrlArrayString();

  if (!imagesUrlArrayString) {
    return res.status(403).json("forbidden");
  }

  let imagesUrlArray = imagesUrlArrayString.split(",");

  req.urlToOverwrite = imagesUrlArray[selectedIndex];
  next();
}

export async function save_lodge_image_url(
  req: Request,
  res: Response,
): Promise<any> {
  const user = req.user;
  const lodgeId = Number(req.params.lodgeId);
  const selectedIndex = req.params.selectedIndex;
  const { imageUrl } = req.body;

  const lodges = user.lodge;
  function getImagesUrlArrayString() {
    for (let i = 0; i < lodges.length; i++) {
      if (lodges[i].lodgeId === lodgeId) {
        return lodges[i].imagesUrlArrayString;
      }
    }
    return null;
  }

  let imagesUrlArrayString = getImagesUrlArrayString();

  if (!imagesUrlArrayString) {
    return res.status(403).json("Unauthorized");
  }

  let imagesUrlArray = imagesUrlArrayString.split(",");
  imagesUrlArray[selectedIndex] = imageUrl;

  imagesUrlArrayString = imagesUrlArray.toString();

  await prisma.lodge.update({
    where: {
      userId: user.userId,
      lodgeId: Number(lodgeId),
    },
    data: {
      imagesUrlArrayString: imagesUrlArrayString,
    },
  });

  return res.json("Upload succesful.");
}

export async function get_lodge_images_url_for_delete(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> {
  const user = req.user;
  const lodgeId = Number(req.params.lodgeId);

  if (!lodgeId || !Number.isInteger(lodgeId)) {
    return res.status(400).json("Invalid Input.");
  }

  const oldlodge = await prisma.lodge.findFirst({
    where: { lodgeId: lodgeId, userId: user.userId },
  });

  if (!oldlodge) {
    return res.status(400).json("Item has been deleted, or never existed.");
  }
  req.urlArrayToDelete = oldlodge.imagesUrlArrayString.split(",");
  next();
}
