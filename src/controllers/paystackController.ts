import { Response, Request, NextFunction } from "express";
import https from "https";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { hasDuplicates } from "../utils/utils";

dotenv.config;
const prisma = new PrismaClient();
const ambassadorEmails = process.env.AMBASSADOR_EMAILS?.split(",") || [];
const maxAmbassadorListings = Number(process.env.AMBASSADOR_LISTING) || 0;

export async function pay_for_item_listing(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> {
  const user = req.user;
  const email = user.email;
  const ambassador = ambassadorEmails?.filter((ambassadorEmail) => {
    if (ambassadorEmail == user.email) {
      return user.email;
    }
  });
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
  const itemFreeSlots = Number(process.env.ITEMS_FREE_SLOTS);
  const itemPrice = Number(process.env.ITEM_PRICE);
  const pricePerSchool = Number(process.env.PRICE_PER_SCHOOL);

  const priceOfProduct =
    (itemPrice + pricePerSchool * (schoolArray.length - 1)) * 100;

  if (
    !imagesUrlArrayString ||
    imagesUrlArrayString.split(",").length < 1 ||
    !title ||
    !description ||
    !price ||
    !Number.isInteger(Number(price)) ||
    !condition ||
    !category ||
    schoolArray.length < 1 ||
    hasDuplicates(schoolArray) ||
    !numberInStock ||
    !requestedPlan
  ) {
    return res.status(400).json("Invalid Input.");
  }

  if (requestedPlan === "free") {
    const FreeProductsListed = user.item.filter(
      (item: any) => item.tier === "free",
    );
    if (FreeProductsListed.length >= itemFreeSlots) {
      return res.json("Your free slots have been used up");
    }
    req.productTier = "free";
    next();
  } else if (requestedPlan === "paid" && ambassador[0]) {
    const paidListings =
      user.item.filter((listing: any) => {
        if (listing.tier === "paid") {
          return listing;
        }
      }) || [];
    if (maxAmbassadorListings > paidListings?.length) {
      req.plan = {
        planName: user.email,
        planCode: user.email,
        maxNumberOfSchools: schoolArray.length,
        maxNumberOfProducts: 1,
      };
      req.productTier = "paid";
      next();
    } else {
      if (user.paystackCustomerCode) {
        const paystackCustomerCode = user.paystackCustomerCode;
        const stringifiedUser = JSON.stringify(user);
        const createParams = JSON.stringify({
          name: `list 1 item in ${schoolArray.length} school${schoolArray.length > 1 ? "s" : ""}`,
          interval: process.env.SUBSCRIPTION_DURATION,
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
      } else {
        const stringifiedUser = JSON.stringify(user);
        const createParams = JSON.stringify({
          name: `list 1 item in ${schoolArray.length} school${schoolArray.length > 1 ? "s" : ""}`,
          interval: process.env.SUBSCRIPTION_DURATION,
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
      if (user.paystackCustomerCode) {
        const paystackCustomerCode = user.paystackCustomerCode;
        const stringifiedUser = JSON.stringify(user);
        const createParams = JSON.stringify({
          name: `list 1 item in ${schoolArray.length} school${schoolArray.length > 1 ? "s" : ""}`,
          interval: process.env.SUBSCRIPTION_DURATION,
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
      } else {
        const stringifiedUser = JSON.stringify(user);
        const createParams = JSON.stringify({
          name: `list 1 item in ${schoolArray.length} school${schoolArray.length > 1 ? "s" : ""}`,
          interval: process.env.SUBSCRIPTION_DURATION,
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
  const ambassador = ambassadorEmails?.filter((ambassadorEmail) => {
    if (ambassadorEmail == user.email) {
      return user.email;
    }
  });
  const {
    title,
    description,
    price,
    priceType,
    category,
    online,
    inPerson,
    availability,
    imagesUrlArrayString,
    schoolArray,
    videoUrl,
    requestedPlan,
  } = req.body;
  const serviceFreeSlots = Number(process.env.SERVICES_FREE_SLOTS);
  const servicePrice = Number(process.env.SERVICE_PRICE);
  const pricePerSchool = Number(process.env.PRICE_PER_SCHOOL);

  const priceOfProduct =
    (servicePrice + pricePerSchool * (schoolArray.length - 1)) * 100;

  if (
    schoolArray.length < 1 ||
    hasDuplicates(schoolArray) ||
    !title ||
    !priceType ||
    !description ||
    !price ||
    price <= 0 ||
    !Number.isInteger(Number(price)) ||
    !category ||
    (!online && !inPerson) ||
    !availability ||
    !imagesUrlArrayString ||
    imagesUrlArrayString.split(",").length < 1 ||
    !requestedPlan
  ) {
    return res.status(400).json("Invalid input.");
  }

  if (requestedPlan === "free") {
    const FreeProductsListed = user.service.filter(
      (service: any) => service.tier === "free",
    );
    if (FreeProductsListed.length >= serviceFreeSlots) {
      return res.json("Your free slots have been used up");
    }
    req.productTier = "free";
    next();
  } else if (requestedPlan === "paid" && ambassador[0]) {
    const paidListings =
      user.item.filter((listing: any) => {
        if (listing.tier === "paid") {
          return listing;
        }
      }) || [];
    if (maxAmbassadorListings > paidListings?.length) {
      req.plan = {
        planName: user.email,
        planCode: user.email,
        maxNumberOfSchools: schoolArray.length,
        maxNumberOfProducts: 1,
      };
      req.productTier = "paid";
      next();
    } else {
      if (user.paystackCustomerCode) {
        const paystackCustomerCode = user.paystackCustomerCode;
        const stringifiedUser = JSON.stringify(user);
        const createParams = JSON.stringify({
          name: `list 1 service in ${schoolArray.length} school${schoolArray.length > 1 ? "s" : ""}`,
          interval: process.env.SUBSCRIPTION_DURATION,
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
              const stringifiedServiceData = JSON.stringify(req.body);
              const params = JSON.stringify({
                email: email,
                amount: `${priceOfProduct}`,
                plan: `${createData.data.plan_code}`,
                customer: paystackCustomerCode,
                metadata: {
                  service_data: stringifiedServiceData,
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
      } else {
        const stringifiedUser = JSON.stringify(user);
        const createParams = JSON.stringify({
          name: `list 1 service in ${schoolArray.length} school${schoolArray.length > 1 ? "s" : ""}`,
          interval: process.env.SUBSCRIPTION_DURATION,
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
              const stringifiedServiceData = JSON.stringify(req.body);
              const params = JSON.stringify({
                email: email,
                amount: `${priceOfProduct}`,
                plan: `${createData.data.plan_code}`,
                metadata: {
                  service_data: stringifiedServiceData,
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
  } else if (requestedPlan === "paid") {
    const unUsedPlan = getUnusedPlan(
      user.service,
      `${user.servicesSubPlans}`,
      schoolArray.length,
    );
    if (unUsedPlan != null) {
      req.plan = unUsedPlan;
      req.productTier = "paid";
      next();
    } else {
      if (user.paystackCustomerCode) {
        const paystackCustomerCode = user.paystackCustomerCode;
        const stringifiedUser = JSON.stringify(user);
        const createParams = JSON.stringify({
          name: `list 1 service in ${schoolArray.length} school${schoolArray.length > 1 ? "s" : ""}`,
          interval: process.env.SUBSCRIPTION_DURATION,
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
              const stringifiedServiceData = JSON.stringify(req.body);
              const params = JSON.stringify({
                email: email,
                amount: `${priceOfProduct}`,
                plan: `${createData.data.plan_code}`,
                customer: paystackCustomerCode,
                metadata: {
                  service_data: stringifiedServiceData,
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
      } else {
        const stringifiedUser = JSON.stringify(user);
        const createParams = JSON.stringify({
          name: `list 1 service in ${schoolArray.length} school${schoolArray.length > 1 ? "s" : ""}`,
          interval: process.env.SUBSCRIPTION_DURATION,
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
              const stringifiedServiceData = JSON.stringify(req.body);
              const params = JSON.stringify({
                email: email,
                amount: `${priceOfProduct}`,
                plan: `${createData.data.plan_code}`,
                metadata: {
                  service_data: stringifiedServiceData,
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

export async function pay_for_lodge_listing(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> {
  const user = req.user;
  const email = user.email;
  const ambassador = ambassadorEmails?.filter((ambassadorEmail) => {
    if (ambassadorEmail == user.email) {
      return user.email;
    }
  });
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
    requestedPlan,
  } = req.body;
  const lodgeFreeSlots = Number(process.env.LODGES_FREE_SLOTS);
  const lodgePrice = Number(process.env.LODGE_PRICE);

  const priceOfProduct = lodgePrice * 100;

  if (
    !propertyType ||
    !paymentFrequency ||
    !numberOfLodges ||
    !Number.isInteger(Number(numberOfLodges)) ||
    !price ||
    !Number.isInteger(Number(price)) ||
    !priceType ||
    !location ||
    !nearestSchool ||
    !walkingTime ||
    !Number.isInteger(Number(walkingTime)) ||
    !kekeTime ||
    !Number.isInteger(Number(kekeTime)) ||
    !agentFee ||
    !Number.isInteger(Number(agentFee)) ||
    !description ||
    !networkQuality ||
    !imagesUrlArrayString ||
    !numberOfBedrooms ||
    !Number.isInteger(Number(numberOfBedrooms)) ||
    !numberOfBathrooms ||
    !Number.isInteger(Number(numberOfBathrooms)) ||
    imagesUrlArrayString.split(",").length < 1 ||
    !requestedPlan
  ) {
    return res.status(400).json("Invalid input.");
  }

  if (requestedPlan === "free") {
    const FreeProductsListed = user.lodge.filter(
      (lodge: any) => lodge.tier === "free",
    );
    if (FreeProductsListed.length >= lodgeFreeSlots) {
      return res.json("Your free slots have been used up");
    }
    req.productTier = "free";
    next();
  } else if (requestedPlan === "paid" && ambassador[0]) {
    const paidListings =
      user.lodge.filter((listing: any) => {
        if (listing.tier === "paid") {
          return listing;
        }
      }) || [];
    if (maxAmbassadorListings > paidListings?.length) {
      req.plan = {
        planName: user.email,
        planCode: user.email,
        maxNumberOfSchools: 1,
        maxNumberOfProducts: 1,
      };
      req.productTier = "paid";
      next();
    } else {
      if (user.paystackCustomerCode) {
        const paystackCustomerCode = user.paystackCustomerCode;
        const stringifiedUser = JSON.stringify(user);
        const createParams = JSON.stringify({
          name: `list 1 lodge in 1`,
          interval: process.env.SUBSCRIPTION_DURATION,
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
              const stringifiedLodgeData = JSON.stringify(req.body);
              const params = JSON.stringify({
                email: email,
                amount: `${priceOfProduct}`,
                plan: `${createData.data.plan_code}`,
                customer: paystackCustomerCode,
                metadata: {
                  lodge_data: stringifiedLodgeData,
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
      } else {
        const stringifiedUser = JSON.stringify(user);
        const createParams = JSON.stringify({
          name: `list 1 lodge in 1`,
          interval: process.env.SUBSCRIPTION_DURATION,
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
              const stringifiedLodgeData = JSON.stringify(req.body);
              const params = JSON.stringify({
                email: email,
                amount: `${priceOfProduct}`,
                plan: `${createData.data.plan_code}`,
                metadata: {
                  lodge_data: stringifiedLodgeData,
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
  } else if (requestedPlan === "paid") {
    const unUsedPlan = getUnusedPlanForLdge(
      user.lodge,
      `${user.lodgesSubPlans}`,
    );
    if (unUsedPlan != null) {
      req.plan = unUsedPlan;
      req.productTier = "paid";
      next();
    } else {
      if (user.paystackCustomerCode) {
        const paystackCustomerCode = user.paystackCustomerCode;
        const stringifiedUser = JSON.stringify(user);
        const createParams = JSON.stringify({
          name: `list 1 lodge in 1`,
          interval: process.env.SUBSCRIPTION_DURATION,
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
              const stringifiedLodgeData = JSON.stringify(req.body);
              const params = JSON.stringify({
                email: email,
                amount: `${priceOfProduct}`,
                plan: `${createData.data.plan_code}`,
                customer: paystackCustomerCode,
                metadata: {
                  lodge_data: stringifiedLodgeData,
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
      } else {
        const stringifiedUser = JSON.stringify(user);
        const createParams = JSON.stringify({
          name: `list 1 lodge in 1`,
          interval: process.env.SUBSCRIPTION_DURATION,
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
              const stringifiedLodgeData = JSON.stringify(req.body);
              const params = JSON.stringify({
                email: email,
                amount: `${priceOfProduct}`,
                plan: `${createData.data.plan_code}`,
                metadata: {
                  lodge_data: stringifiedLodgeData,
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

export async function pay_for_room_listing(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> {
  const user = req.user;
  const email = user.email;
  const ambassador = ambassadorEmails?.filter((ambassadorEmail) => {
    if (ambassadorEmail == user.email) {
      return user.email;
    }
  });
  const {
    imagesUrlArrayString,
    propertyType,
    numberOfBedrooms,
    numberOfBathrooms,
    paymentFrequency,
    price,
    priceType,
    location,
    school,
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
    ownerName,
    ownerPhone,
    ownerProgramme,
    yearOfStudy,
    dateOfBirth,
    additionalInfo,
    videoUrl,
    requestedPlan,
  } = req.body;
  const roomFreeSlots = Number(process.env.ROOMS_FREE_SLOTS);
  const roomPrice = Number(process.env.LODGE_PRICE);

  const priceOfProduct = roomPrice * 100;

  if (
    !propertyType ||
    !paymentFrequency ||
    !price ||
    !Number.isInteger(Number(price)) ||
    !priceType ||
    !location ||
    !school ||
    !walkingTime ||
    !Number.isInteger(Number(walkingTime)) ||
    !kekeTime ||
    !Number.isInteger(Number(kekeTime)) ||
    !description ||
    !networkQuality ||
    !ownerName ||
    !ownerPhone ||
    !ownerProgramme ||
    !yearOfStudy ||
    !dateOfBirth ||
    !additionalInfo ||
    !imagesUrlArrayString ||
    !numberOfBedrooms ||
    !Number.isInteger(Number(numberOfBedrooms)) ||
    !numberOfBathrooms ||
    !Number.isInteger(Number(numberOfBathrooms)) ||
    !requestedPlan ||
    imagesUrlArrayString.split(",").length < 1
  ) {
    return res.status(400).json("Invalid input.");
  }

  if (requestedPlan === "free") {
    const FreeProductsListed = user.room.filter(
      (room: any) => room.tier === "free",
    );
    if (FreeProductsListed.length >= roomFreeSlots) {
      return res.json("Your free slots have been used up");
    }
    req.productTier = "free";
    next();
  } else if (requestedPlan === "paid" && ambassador[0]) {
    const paidListings =
      user.lodge.filter((listing: any) => {
        if (listing.tier === "paid") {
          return listing;
        }
      }) || [];
    if (maxAmbassadorListings > paidListings?.length) {
      req.plan = {
        planName: user.email,
        planCode: user.email,
        maxNumberOfSchools: 1,
        maxNumberOfProducts: 1,
      };
      req.productTier = "paid";
      next();
    } else {
      if (user.paystackCustomerCode) {
        const paystackCustomerCode = user.paystackCustomerCode;
        const stringifiedUser = JSON.stringify(user);
        const createParams = JSON.stringify({
          name: `list 1 room in 1`,
          interval: process.env.SUBSCRIPTION_DURATION,
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
              const stringifiedRoomData = JSON.stringify(req.body);
              const params = JSON.stringify({
                email: email,
                amount: `${priceOfProduct}`,
                plan: `${createData.data.plan_code}`,
                customer: paystackCustomerCode,
                metadata: {
                  room_data: stringifiedRoomData,
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
      } else {
        const stringifiedUser = JSON.stringify(user);
        const createParams = JSON.stringify({
          name: `list 1 room in 1`,
          interval: process.env.SUBSCRIPTION_DURATION,
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
              const stringifiedRoomData = JSON.stringify(req.body);
              const params = JSON.stringify({
                email: email,
                amount: `${priceOfProduct}`,
                plan: `${createData.data.plan_code}`,
                metadata: {
                  room_data: stringifiedRoomData,
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
  } else if (requestedPlan === "paid") {
    const unUsedPlan = getUnusedPlanForLdge(
      user.room,
      `${user.lodgesSubPlans}`,
    );
    if (unUsedPlan != null) {
      req.plan = unUsedPlan;
      req.productTier = "paid";
      next();
    } else {
      if (user.paystackCustomerCode) {
        const paystackCustomerCode = user.paystackCustomerCode;
        const stringifiedUser = JSON.stringify(user);
        const createParams = JSON.stringify({
          name: `list 1 room in 1`,
          interval: process.env.SUBSCRIPTION_DURATION,
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
              const stringifiedRoomData = JSON.stringify(req.body);
              const params = JSON.stringify({
                email: email,
                amount: `${priceOfProduct}`,
                plan: `${createData.data.plan_code}`,
                customer: paystackCustomerCode,
                metadata: {
                  room_data: stringifiedRoomData,
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
      } else {
        const stringifiedUser = JSON.stringify(user);
        const createParams = JSON.stringify({
          name: `list 1 room in 1`,
          interval: process.env.SUBSCRIPTION_DURATION,
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
              const stringifiedRoomData = JSON.stringify(req.body);
              const params = JSON.stringify({
                email: email,
                amount: `${priceOfProduct}`,
                plan: `${createData.data.plan_code}`,
                metadata: {
                  room_data: stringifiedRoomData,
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
  const user = req.user;
  const subCode = req.params.subCode;

  const itemsSubPlans = JSON.parse(`${user.itemsSubPlans}`) || [];
  const servicesSubPlans = JSON.parse(`${user.servicesSubPlans}`) || [];
  const lodgesSubPlans = JSON.parse(`${user.lodgesSubPlans}`) || [];
  const roomsSubPlans = JSON.parse(`${user.roomsSubPlans}`) || [];

  const userSubPlans = [
    ...itemsSubPlans,
    ...servicesSubPlans,
    ...lodgesSubPlans,
    ...roomsSubPlans,
  ];

  const doesPlanCodeBelongToUser = userSubPlans.filter(
    (plan) => subCode === plan.subCode,
  );

  if (doesPlanCodeBelongToUser[0] === doesPlanCodeBelongToUser[0]) {
    const options = {
      hostname: "api.paystack.co",
      port: 443,
      path: `/subscription/${subCode}/manage/link`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
      },
    };

    const Req = https
      .request(options, (Res) => {
        let data = "";

        Res.on("data", (chunk) => {
          data += chunk;
        });

        Res.on("end", () => {
          res.json(JSON.parse(data));
        });
      })
      .on("error", (error) => {
        console.error(error);
      });
    Req.end();
  } else {
    return res
      .status(403)
      .json("This plan has either been disabled or no longer exists");
  }
}

function getUnusedPlan(
  listedProducts: any[],
  userSubPlans: string,
  schoolArrayLength: number,
) {
  if (userSubPlans) {
    const userPlans = JSON.parse(userSubPlans) || [];
    for (let i = 0; i < userPlans.length; i++) {
      const thePlansListedProducts =
        listedProducts.filter((product: any) => {
          return (
            JSON.parse(`${product.plan}`).planCode == userPlans[i].planCode
          );
        }) || [];

      if (
        userPlans[i].maxNumberOfProducts > thePlansListedProducts.length &&
        userPlans[i].maxNumberOfSchools >= schoolArrayLength
      ) {
        return userPlans[i];
      }
    }
    return null;
  } else {
    return null;
  }
}

function getUnusedPlanForLdge(listedProducts: any[], userSubPlans: string) {
  if (userSubPlans) {
    const userPlans = JSON.parse(userSubPlans) || [];
    for (let i = 0; i < userPlans.length; i++) {
      const thePlansListedProducts =
        listedProducts.filter((product: any) => {
          return (
            JSON.parse(`${product.plan}`).planCode == userPlans[i].planCode
          );
        }) || [];

      if (userPlans[i].maxNumberOfProducts > thePlansListedProducts.length) {
        return userPlans[i];
      }
    }
    return null;
  } else {
    return null;
  }
}
