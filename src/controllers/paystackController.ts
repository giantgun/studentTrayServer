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
  const {
    imagesUrlArrayString,
    title,
    description,
    price,
    condition,
    category,
    schoolArray,
    numberInStock,
    requestedPlan,
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
    !numberInStock ||
    !requestedPlan
  ) {
    return res.status(400).json("Invalid Input.");
  }

  if (requestedPlan === "free") {
    const FreeProductsListed = user.item.filter(
      (item: any) => item.tier === "free",
    );
    if (FreeProductsListed.length >= 2) {
      return res.json("Your free slots have been used up");
    }
    req.productTier = "free";
    next();
  } else if (requestedPlan === "paid") {
    const unUsedPlan = getUnusedPlan(
      user.item,
      `${user.itemsSubPlans}`,
      schoolArray.length,
    );
    if (unUsedPlan != null) {
      req.plan = unUsedPlan;
      req.productTier = "paid";
      next();
    } else {
      if(user.paystackCustomerCode){
        const paystackCustomerCode = user.paystackCustomerCode
        const stringifiedUser = JSON.stringify(user);
        const createParams = JSON.stringify({
          name: `list 1 item in ${schoolArray.length} school${schoolArray.length > 1 ? "s" : ""}`,
          interval: "hourly",
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
                customer: paystackCustomerCode,
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

                  httpRes.on("end", async () => {
                    const newdata = JSON.parse(data);
                    const access_code = newdata.data.access_code;
                    res.json({ access_code: access_code });
                    await prisma.imagesfordelete.create({
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
      }else{
        const stringifiedUser = JSON.stringify(user);
        const createParams = JSON.stringify({
          name: `list 1 item in ${schoolArray.length} school${schoolArray.length > 1 ? "s" : ""}`,
          interval: "hourly",
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
  
                  httpRes.on("end", async () => {
                    const newdata = JSON.parse(data);
                    const access_code = newdata.data.access_code;
                    res.json({ access_code: access_code });
                    await prisma.imagesfordelete.create({
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
  }
}

export async function pay_for_service_listing(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> {
  const user = req.user;
  const email = user.email;
  const {
    imagesUrlArrayString,
    title,
    description,
    price,
    condition,
    category,
    schoolArray,
    numberInStock,
    requestedPlan,
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
    !numberInStock ||
    !requestedPlan
  ) {
    return res.status(400).json("Invalid Input.");
  }

  if (requestedPlan === "free") {
    const FreeProductsListed = user.item.filter(
      (item: any) => item.tier === "free",
    );
    if (FreeProductsListed.length >= 2) {
      return res.json("Your free slots have been used up");
    }
    req.productTier = "free";
    next();
  } else if (requestedPlan === "paid") {
    const unUsedPlan = getUnusedPlan(
      user.item,
      `${user.itemsSubPlans}`,
      schoolArray.length,
    );
    if (unUsedPlan != null) {
      req.plan = unUsedPlan;
      req.productTier = "paid";
      next();
    } else {
      if(user.paystackCustomerCode){
        const paystackCustomerCode = user.paystackCustomerCode
        const stringifiedUser = JSON.stringify(user);
        const createParams = JSON.stringify({
          name: `list 1 item in ${schoolArray.length} school${schoolArray.length > 1 ? "s" : ""}`,
          interval: "hourly",
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
                customer: paystackCustomerCode,
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

                  httpRes.on("end", async () => {
                    const newdata = JSON.parse(data);
                    const access_code = newdata.data.access_code;
                    res.json({ access_code: access_code });
                    await prisma.imagesfordelete.create({
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
      }else{
        const stringifiedUser = JSON.stringify(user);
        const createParams = JSON.stringify({
          name: `list 1 item in ${schoolArray.length} school${schoolArray.length > 1 ? "s" : ""}`,
          interval: "hourly",
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
  
                  httpRes.on("end", async () => {
                    const newdata = JSON.parse(data);
                    const access_code = newdata.data.access_code;
                    res.json({ access_code: access_code });
                    await prisma.imagesfordelete.create({
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
  }
}

export async function update_user_card(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> {
  const user = req.user
  const subCode = req.params.subCode
  console.log(subCode)
  console.log(user.paystackCustomerCode)

  const itemsSubPlans = JSON.parse(`${user.itemsSubPlans}`) || []
  const servicesSubPlans = JSON.parse(`${user.servicesSubPlans}`) || []
  const lodgesSubPlans = JSON.parse(`${user.lodgesSubPlans}`) || []
  const roomsSubPlans = JSON.parse(`${user.roomsSubPlans}`) || []

  const userSubPlans = [...itemsSubPlans, ...servicesSubPlans, ...lodgesSubPlans, ...roomsSubPlans]

  const doesPlanCodeBelongToUser = userSubPlans.filter(plan=> subCode === plan.subCode) 

  if(doesPlanCodeBelongToUser[0]){
    const options = {
      hostname: 'api.paystack.co',
      port: 443,
      path: `/subscription/${subCode}/manage/link`,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`
      }
    }

    const Req = https.request(options, Res => {
      let data = ''

      Res.on('data', (chunk) => {
        data += chunk
      });

      Res.on('end', () => {
        console.log(JSON.parse(data))
        res.json((JSON.parse(data)))
      })
    }).on('error', error => {
      console.error(error)
    })
    Req.end()
  }else{
    return res.status(403).json("This plan has either been disabled or no longer exists")
  }


}

function getUnusedPlan(
  listedProducts: any[],
  userSubPlans: string,
  schoolArrayLength: number,
) {
  if(userSubPlans){
    console.log(userSubPlans)
    const userPlans = JSON.parse(userSubPlans)
    for (let i = 0; i < userPlans.length; i++) {
      const thePlansListedProducts = listedProducts.filter(
        (product: any) =>{
          return JSON.parse(`${product.plan}`).planCode == userPlans[i].planCode
        }
      );

      if (
        (userPlans[i].maxNumberOfProducts > thePlansListedProducts.length) &&
        (userPlans[i].maxNumberOfSchools >= schoolArrayLength)
      ) {
        console.log(userPlans[i])
        return userPlans[i];
      }
    }
    return null;
  }else{
    return null 
  }
}
