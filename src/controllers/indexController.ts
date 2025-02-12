import { NextFunction, Response, Request } from "express";

export async function index_get(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  res.json("");
}
