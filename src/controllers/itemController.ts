import { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { IsProductAllowed } from "../utils/utils";

const prisma = new PrismaClient();

export async function list_item(req: Request, res: Response): Promise<any> {
  const {
    videoUrl,
    imagesUrlArrayString,
    title,
    description,
    price,
    condition,
    category,
    schoolArray,
    numberInStock,
  } = req.body;
  const userId = req.user.userId;
  const productTier = req.productTier;

  if (
    !imagesUrlArrayString ||
    imagesUrlArrayString.split(",").length <= 1 ||
    !title ||
    !description ||
    !price ||
    !condition ||
    !category ||
    !schoolArray ||
    !numberInStock
  ) {
    return res.status(400).json("Invalid Input.");
  }

  const saveSchools = schoolArray.map((school: string) => ({
    school: {
      connect: {
        schoolName: school,
      },
    },
  }));

  const currentDate = new Date();
  await prisma.item.create({
    data: {
      videoUrl,
      imagesUrlArrayString,
      title,
      description,
      price: Number(price),
      condition,
      category,
      userId,
      numberInStock: Number(numberInStock),
      updatedAt: currentDate,
      tier: productTier,
      item_school: {
        create: saveSchools,
      },
    },
  });
  return res.status(200).json("The Item has been listed succesfully.");
}

export async function list_item_from_webhook(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> {
  const user = req.user;
  const product = req.product;
  const productTier = req.productTier;
  const referenceText = req.referenceText;

  if (user && product === "item") {
    const {
      videoUrl,
      imagesUrlArrayString,
      title,
      description,
      price,
      condition,
      category,
      schoolArray,
      numberInStock,
    } = req.body;
    const userId = req.user.userId;

    const saveSchools = schoolArray.map((school: string) => ({
      school: {
        connect: {
          schoolName: school,
        },
      },
    }));

    const currentDate = new Date();

    await prisma.item.create({
      data: {
        videoUrl,
        imagesUrlArrayString,
        title,
        description,
        price: Number(price),
        condition,
        category,
        userId,
        numberInStock: Number(numberInStock),
        updatedAt: currentDate,
        tier: productTier,
        item_school: {
          create: saveSchools,
        },
      },
    });

    await prisma.imagesfordelete.delete({
      where: { referenceText: referenceText },
    });

    if (productTier === "paid") {
      const newItemsPaidFor = user.itemsPaidFor + 1;
      await prisma.user.update({
        where: { userId: user.userId },
        data: {
          itemsPaidFor: newItemsPaidFor,
        },
      });
    }
  }
  next();
}

export async function get_all_items(req: Request, res: Response): Promise<any> {
  const user = req.user;
  const searchedText = req.query.search;
  if (searchedText) {
    const items = await prisma.item.findMany({
      where: {
        OR: [
          { title: { contains: `%${searchedText}%` } },
          { description: { contains: `%${searchedText}%` } },
        ],
        item_school: {
          some: {
            schoolId: user.school.schoolId,
          },
        },
      },
    });
    return res.status(200).json(items);
  }

  const allItems = await prisma.item.findMany({
    where: { item_school: { some: { schoolId: user.school.schoolId } } },
  });
  return res.status(200).json(allItems);
}

export async function get_an_item(req: Request, res: Response): Promise<any> {
  const user = req.user;
  const itemId = Number(req.params.itemId);

  const item = await prisma.item.findUnique({
    where: { itemId: itemId },
    include: {
      item_school: true,
    },
  });

  if (!item?.item_school) {
    return res.status(400).json("Item does not exist.");
  }

  if (!IsProductAllowed(item.item_school, user.school.schoolId)) {
    return res.json("Item does not exist.");
  }

  const business = await prisma.business.findUnique({
    where: { userId: item?.userId },
  });
  if (business) {
    return res.status(200).json({
      ...item,
      phoneNumber: business.phoneNumber,
      owner: "business",
      businessId: business.businessId,
      userId: 0,
    });
  }
  const owner = await prisma.user.findUnique({
    where: { userId: item?.userId },
  });

  return res.status(200).json({
    ...item,
    phoneNumber: owner?.phoneNumber,
    owner: "user",
  });
}

export async function delete_item(req: Request, res: Response): Promise<any> {
  const user = req.user;
  const itemId = Number(req.params.itemId);

  const oldItem = await prisma.item.findFirst({
    where: { itemId: itemId, userId: user.userId },
  });

  if (!oldItem) {
    return res.status(400).json("Unauthorized.");
  }

  const deleteItemSchoolRecord = prisma.item_school.deleteMany({
    where: { itemId: itemId },
  });
  const deleteItem = prisma.item.deleteMany({
    where: { itemId: itemId, userId: user.userId },
  });

  await prisma.$transaction([deleteItemSchoolRecord, deleteItem]);

  return res.status(200).json("The item has been deleted successfully.");
}

export async function get_item_images_url_for_delete(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> {
  const user = req.user;
  const itemId = Number(req.params.itemId);

  if (!itemId || !Number.isInteger(itemId)) {
    return res.status(400).json("Invalid Input.");
  }

  const oldItem = await prisma.item.findFirst({
    where: { itemId: itemId, userId: user.userId },
  });

  if (!oldItem) {
    return res.status(400).json("Item has been deleted, or never existed.");
  }
  req.urlArrayToDelete = oldItem.imagesUrlArrayString.split(",");
  next();
}

export async function edit_item(req: Request, res: Response): Promise<any> {
  const {
    title,
    description,
    price,
    condition,
    category,
    schoolArray,
    numberInStock,
  } = req.body;
  const userId = req.user.userId;
  const itemId = Number(req.params.itemId);

  if (
    !title ||
    !description ||
    !price ||
    !condition ||
    !category ||
    !schoolArray ||
    !numberInStock
  ) {
    return res.status(400).json("Invalid Input.");
  }

  const oldItem = await prisma.item.findFirst({
    where: {
      itemId: itemId,
      userId: userId,
    },
  });

  if (!oldItem) {
    return res.status(400).json("Item does not exist.");
  }

  const deleteItemSchoolRecord = prisma.item_school.deleteMany({
    where: { itemId: itemId },
  });

  const saveSchools = schoolArray.map((school: string) => ({
    school: {
      connect: {
        schoolName: school,
      },
    },
  }));
  const currentDate = new Date();
  const editItem = prisma.item.update({
    where: {
      itemId: itemId,
      userId: userId,
    },
    data: {
      title: title,
      description: description,
      price: Number(price),
      category: category,
      condition: condition,
      numberInStock: Number(numberInStock),
      userId,
      updatedAt: currentDate,
      item_school: {
        create: saveSchools,
      },
    },
  });

  await prisma.$transaction([deleteItemSchoolRecord, editItem]);

  return res.status(200).json("Item edited successfully.");
}

export async function get_an_item_for_edit(
  req: Request,
  res: Response,
): Promise<any> {
  const itemId = Number(req.params.itemId);

  const item = await prisma.item.findUnique({
    where: { itemId: itemId },
    include: {
      item_school: {
        include: {
          school: true,
        },
      },
    },
  });

  if (!item?.item_school) {
    return res.status(400).json("Item does not exist.");
  }

  return res.status(200).json(item);
}

export async function get_item_image_url_for_overwrite(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> {
  const user = req.user;
  const itemId = Number(req.params.itemId);
  const selectedIndex = req.params.selectedIndex;

  const items = user.item;
  console.log(itemId);
  console.log(items);
  function getImagesUrlArrayString() {
    for (let i = 0; i < items.length; i++) {
      if (items[i].itemId === itemId) {
        return items[i].imagesUrlArrayString;
      }
    }
    return null;
  }

  let imagesUrlArrayString = getImagesUrlArrayString();
  console.log(imagesUrlArrayString);

  if (!imagesUrlArrayString) {
    return res.status(403).json("forbidden");
  }

  let imagesUrlArray = imagesUrlArrayString.split(",");

  req.urlToOverwrite = imagesUrlArray[selectedIndex];
  next();
}

export async function save_item_image_url(
  req: Request,
  res: Response,
): Promise<any> {
  const user = req.user;
  const itemId = Number(req.params.itemId);
  const selectedIndex = req.params.selectedIndex;
  const { imageUrl } = req.body;

  const items = user.item;
  function getImagesUrlArrayString() {
    for (let i = 0; i < items.length; i++) {
      if (items[i].itemId === itemId) {
        return items[i].imagesUrlArrayString;
      }
    }
    return null;
  }

  let imagesUrlArrayString = getImagesUrlArrayString();

  if (!imagesUrlArrayString) {
    return res.status(403).json("Forbidden.");
  }

  let imagesUrlArray = imagesUrlArrayString.split(",");
  imagesUrlArray[selectedIndex] = imageUrl;

  imagesUrlArrayString = imagesUrlArray.toString();

  await prisma.item.update({
    where: {
      userId: user.userId,
      itemId: Number(itemId),
    },
    data: {
      imagesUrlArrayString: imagesUrlArrayString,
    },
  });

  return res.json("Upload succesful.");
}
