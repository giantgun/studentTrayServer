import { PrismaClient } from "@prisma/client";
import { NextFunction, Response, Request } from "express";
import { shuffleArray } from "../utils/utils";

const prisma = new PrismaClient();

export async function index_get(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  let items = shuffleArray(await prisma.item.findMany({ take: 10, include: {item_school: {
    include: {
      school: true
    }
  }} })).slice(0, 2)
  let services = shuffleArray(await prisma.service.findMany({ take: 10, include: {service_school: {
    include: {
      school: true
    }
  }} })).slice(0, 2)
  let lodges = shuffleArray(await prisma.lodge.findMany({ take: 10 })).slice(0, 2)
  let rooms = shuffleArray(await prisma.room.findMany({ take: 10 })).slice(0, 2)

  res.json({
    items,
    services,
    lodges,
    rooms
  });
}
