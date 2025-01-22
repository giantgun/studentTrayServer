import { NextFunction, Request, Response } from "express";
import crypto from "crypto";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

dotenv.config;

const prisma = new PrismaClient();
const secret = process.env.PAYSTACK_SECRET as string;

export async function paystack_web_hook(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const hash = crypto
    .createHmac("sha512", secret)
    .update(JSON.stringify(req.body))
    .digest("hex");
  if (hash == req.headers["x-paystack-signature"]) {
    res.sendStatus(200);
    const event = req.body;
    console.log("event", event.event);
    console.log(event);
    console.log(event.data.metadata.item_data);
    if (event.event === "charge.success") {
      console.log(event.data.metadata.item_data);
      if (
        event.data.metadata.item_data != undefined &&
        event.data.metadata.item_data != null
      ) {
        console.log("item_data is ruunninng");
        req.body = JSON.parse(event.data.metadata.item_data);
        req.user = JSON.parse(event.data.metadata.user);
        req.productTier = "paid";
        req.product = "item";
        req.urlArrayToDelete = undefined;
        req.referenceText = event.data.reference;
        console.log(event.data.reference);
        next();
      } else if (event.data.metadata.service_data) {
        req.body = JSON.parse(event.data.metadata.service_data);
        req.user = JSON.parse(event.data.metadata.user);
        req.productTier = "paid";
        req.product = "service";
        req.urlArrayToDelete = undefined;
        req.referenceText = event.data.reference;
        next();
      } else if (event.data.metadata.lodge_data) {
        req.body = JSON.parse(event.data.metadata.lodge_data);
        req.user = JSON.parse(event.data.metadata.user);
        req.productTier = "paid";
        req.product = "lodge";
        req.urlArrayToDelete = undefined;
        req.referenceText = event.data.reference;
        next();
      } else if (event.data.metadata.room_data) {
        req.body = JSON.parse(event.data.metadata.room_data);
        req.user = JSON.parse(event.data.metadata.user);
        req.productTier = "paid";
        req.product = "room";
        req.urlArrayToDelete = undefined;
        req.referenceText = event.data.reference;
        next();
      }
    } else if (
      event.event != "subscription.create" &&
      event.status != "charge.success"
    ) {
      if (event.data && event.data.metadata && event.data.metadata.item_data) {
        console.log("deleting files");
        const item_data = JSON.parse(event.data.metadata.item_data);
        req.urlArrayToDelete = item_data.imagesUrlArrayString.split(",");
        req.product = undefined;
        req.user = undefined;
        next();
      } else if (
        event.data &&
        event.data.metadata &&
        event.data.metadata.service_data_data
      ) {
        const service_data = JSON.parse(event.data.metadata.service_data);
        req.urlArrayToDelete = service_data.imagesUrlArrayString.split(",");
        req.product = undefined;
        req.user = undefined;
        next();
      } else if (
        event.data &&
        event.data.metadata &&
        event.data.metadata.lodge_data
      ) {
        const lodge_data = JSON.parse(event.data.metadata.lodge_data);
        req.urlArrayToDelete = lodge_data.imagesUrlArrayString.split(",");
        req.product = undefined;
        req.user = undefined;
        next();
      } else if (
        event.data &&
        event.data.metadata &&
        event.data.metadata.room_data
      ) {
        const room_data = JSON.parse(event.data.metadata.room_data);
        req.urlArrayToDelete = room_data.imagesUrlArrayString.split(",");
        req.product = undefined;
        req.user = undefined;
        next();
      }
    }
  }
}

export async function get_canceled_trans_image_urls_for_delete(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const transactionImages = await prisma.imagesfordelete.findMany();
  console.log(transactionImages)
  const imagesfordelete = filterOlderThan12Hours(transactionImages);
  const now = new Date(); // Get current time
  const twelveHoursAgo = new Date(now.getTime() - 12 * 60 * 60 * 1000); // 12 hours ago

  const imagesUrlArrayStringForDelete = imagesfordelete.map((imagesfordelete) =>
    imagesfordelete.imagesUrlArrayString.split(","),
  );

  let urlArrayToDelete = [];
  for (let i = 0; i < imagesUrlArrayStringForDelete.length; i++) {
    for (let j = 0; j < imagesUrlArrayStringForDelete[i].length; j++) {
      urlArrayToDelete.push(imagesUrlArrayStringForDelete[i][j]);
    }
  }
  console.log(urlArrayToDelete);

  await prisma.imagesfordelete.deleteMany({
    where: {
      createdAt: {
        lt: twelveHoursAgo,
      },
    },
  });

  res.sendStatus(200);
  req.urlArrayToDelete = urlArrayToDelete;
  next();
}

export async function delete_overdue_free_tier_products(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const now = new Date(); // Get current time
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(now.getMonth() - 1); // Subtract one month

  const freeTierItems = await prisma.item.findMany({
    where: {
      tier: "free",
      createdAt: {
        lt: oneMonthAgo,
      },
    },
    
  });

  const freeTierServices = await prisma.service.findMany({
    where: {
      tier: "free",
      createdAt: {
        lt: oneMonthAgo,
      },
    },
    
  });

  const freeTierLodges = await prisma.lodge.findMany({
    where: {
      tier: "free",
      createdAt: {
        lt: oneMonthAgo,
      },
    },
    
  });

  const freeTierRooms = await prisma.room.findMany({
    where: {
      tier: "free",
      createdAt: {
        lt: oneMonthAgo,
      },
    },
  });

  const freeTierProductsForDelete = [
    ...freeTierItems,
    ...freeTierServices,
    ...freeTierLodges,
    ...freeTierRooms,
  ];

  console.log(freeTierProductsForDelete)

  const imagesUrlArrayStringForDelete = freeTierProductsForDelete.map(
    (imagefordelete) => imagefordelete.imagesUrlArrayString.split(","),
  );
  let urlArrayToDelete = [];
  for (let i = 0; i < imagesUrlArrayStringForDelete.length; i++) {
    for (let j = 0; j < imagesUrlArrayStringForDelete[i].length; j++) {
      urlArrayToDelete.push(imagesUrlArrayStringForDelete[i][j]);
    }
  }
  console.log(urlArrayToDelete)

  for (let i = 0; i < freeTierItems.length; i++){
    await prisma.item_school.deleteMany({
      where: { itemId: freeTierItems[i].itemId },
    });
  }

  for (let i = 0; i < freeTierServices.length; i++){
    await prisma.service_school.deleteMany({
      where: { serviceId: freeTierServices[i].serviceId },
    });
  }

  await prisma.item.deleteMany({
    where: {
      tier: "free",
      createdAt: {
        lt: oneMonthAgo,
      },
    },
  });

  await prisma.service.deleteMany({
    where: {
      tier: "free",
      createdAt: {
        lt: oneMonthAgo,
      },
    },
  });

  await prisma.lodge.deleteMany({
    where: {
      tier: "free",
      createdAt: {
        lt: oneMonthAgo,
      },
    },
  });

  await prisma.room.deleteMany({
    where: {
      tier: "free",
      createdAt: {
        lt: oneMonthAgo,
      },
    },
  });
  console.log(urlArrayToDelete);

  res.sendStatus(200);
  req.urlArrayToDelete = urlArrayToDelete;
  next();
}

function filterOlderThan12Hours(elements: any[]) {
  const now = new Date(); // Get current time
  const twelveHoursAgo = new Date(now.getTime() - 12 * 60 * 60 * 1000); // 12 hours ago

  return elements.filter((element) => {
    const createdAt = new Date(element.createdAt);
    return createdAt < twelveHoursAgo;
  });
}


