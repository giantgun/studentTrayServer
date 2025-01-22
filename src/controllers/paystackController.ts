import { Response, Request, NextFunction } from "express";
import https from "https";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

dotenv.config;
const prisma = new PrismaClient();

export async function pay_for_item_listing(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> {
  const user = req.user;
  const email = user.email;
  const listedItems = user.item.length;
  const numberOfItemsPaidFor = user.itemsPaidFor;
  const {
    imagesUrlArrayString,
    title,
    description,
    price,
    condition,
    category,
    schoolArray,
    numberInStock,
  } = req.body;

  const priceOfProduct = (230 + 100 * (schoolArray.length - 1)) * 100;

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

  if (listedItems === 0 && numberOfItemsPaidFor === 0) {
    req.productTier = "free";
    next();
  } else if (numberOfItemsPaidFor - listedItems > 0) {
    req.productTier = "paid";
    next();
  } else {
    const stringifiedUser = JSON.stringify(user);
    const createParams = JSON.stringify({
      name: `list an item in ${schoolArray.length} school${schoolArray.length > 1 ? "s" : ""}`,
      interval: "monthly",
      amount: `${priceOfProduct}`,
    });

    const createOptions = {
      hostname: "api.paystack.co",
      port: 443,
      path: "/plan",
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
        "Content-Type": "application/json",
      },
    };

    const createReq = https
      .request(createOptions, (createRes) => {
        let createdata = "";

        createRes.on("data", (chunk) => {
          createdata += chunk;
        });

        createRes.on("end", () => {
          const createData = JSON.parse(createdata);
          const stringifiedItemData = JSON.stringify(req.body);
          const params = JSON.stringify({
            email: email,
            amount: `${priceOfProduct}`,
            plan: `${createData.data.plan_code}`,
            metadata: {
              item_data: stringifiedItemData,
              user: stringifiedUser,
              cancel_action: "http://localhost:5173",
            },
          });

          const options = {
            hostname: "api.paystack.co",
            port: 443,
            path: "/transaction/initialize",
            method: "POST",
            headers: {
              Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
              "Content-Type": "application/json",
            },
          };

          const httpReq = https
            .request(options, (httpRes) => {
              let data = "";

              httpRes.on("data", (chunk) => {
                data += chunk;
              });

              httpRes.on("end", () => {
                const newdata = JSON.parse(data);
                const access_code = newdata.data.access_code;
                res.json({ access_code: access_code });
                prisma.imagesfordelete.create({
                  data: {
                    referenceText: newdata.data.reference,
                    imagesUrlArrayString: imagesUrlArrayString,
                  },
                });
              });
            })
            .on("error", (error) => {
              console.error(error);
            });

          httpReq.write(params);
          httpReq.end();
        });
      })
      .on("error", (error) => {
        console.error(error);
      });

    createReq.write(createParams);
    createReq.end();
  }
}
