import { NextFunction, Request, Response } from "express";
import crypto from "crypto";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { sleep } from "../utils/utils";

dotenv.config;

const prisma = new PrismaClient();
const secret = process.env.PAYSTACK_SECRET as string;

export async function paystack_web_hook(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try{
    const hash = crypto
      .createHmac("sha512", secret)
      .update(JSON.stringify(req.body))
      .digest("hex");
    if (hash == req.headers["x-paystack-signature"]) {
      res.sendStatus(200);
      const event = req.body;
      console.log("event", event.event);
      if (event.event === "charge.success") {
        console.log(event);
        if (event.data.metadata.item_data) {
          console.log("item_data is ruunninng");
          req.body = JSON.parse(event.data.metadata.item_data);
          req.user = JSON.parse(event.data.metadata.user);
          req.productTier = "paid";
          req.product = "item";
          req.urlArrayToDelete = undefined;
          req.referenceText = event.data.reference;
          req.paystackCustomerCode = event.data.customer.customer_code
          req.plan = {
            planName: event.data.plan.name,
            planCode: event.data.plan.plan_code,
            maxNumberOfSchools: Number(event.data.plan.name.split(" ")[4]),
            maxNumberOfProducts: Number(event.data.plan.name.split(" ")[1]),
          };
          console.log(event.data.reference);
          next();
        } else if (event.data.metadata.service_data) {
          req.body = JSON.parse(event.data.metadata.service_data);
          req.user = JSON.parse(event.data.metadata.user);
          req.productTier = "paid";
          req.product = "service";
          req.urlArrayToDelete = undefined;
          req.referenceText = event.data.reference;
          req.paystackCustomerCode = event.data.customer.customer_code
          req.plan = {
            planName: event.data.plan.name,
            planCode: event.data.plan.plan_code,
            maxNumberOfSchools: Number(event.data.plan.name.split(" ")[4]),
            maxNumberOfProducts: Number(event.data.plan.name.split(" ")[1]),
          };
          next();
        } else if (event.data.metadata.lodge_data) {
          req.body = JSON.parse(event.data.metadata.lodge_data);
          req.user = JSON.parse(event.data.metadata.user);
          req.productTier = "paid";
          req.product = "lodge";
          req.urlArrayToDelete = undefined;
          req.referenceText = event.data.reference;
          req.paystackCustomerCode = event.data.customer.customer_code
          req.plan = {
            planName: event.data.plan.name,
            planCode: event.data.plan.plan_code,
            maxNumberOfSchools: Number(event.data.plan.name.split(" ")[4]),
            maxNumberOfProducts: Number(event.data.plan.name.split(" ")[1]),
          };
          next();
        } else if (event.data.metadata.room_data) {
          req.body = JSON.parse(event.data.metadata.room_data);
          req.user = JSON.parse(event.data.metadata.user);
          req.productTier = "paid";
          req.product = "room";
          req.urlArrayToDelete = undefined;
          req.referenceText = event.data.reference;
          req.paystackCustomerCode = event.data.customer.customer_code
          req.plan = {
            planName: event.data.plan.name,
            planCode: event.data.plan.plan_code,
            maxNumberOfSchools: Number(event.data.plan.name.split(" ")[4]),
            maxNumberOfProducts: Number(event.data.plan.name.split(" ")[1]),
          };
          next();
        }
      } else if (event.event === "subscription.create") {
        sleep(5000)
        console.log(event);
        const plan = {
          planName: event.data.plan.name,
          planCode: event.data.plan.plan_code,
          maxNumberOfSchools: Number(event.data.plan.name.split(" ")[4]),
          maxNumberOfProducts: Number(event.data.plan.name.split(" ")[1]),
          subCode: event.data.subscription_code,
        }
  
        const user = await prisma.user.findUnique({ where: { email: event.data.customer.email } })
        
        if(user){
          if(user.itemsSubPlans){
            const updatedItemPlans = JSON.parse(`${user.itemsSubPlans}`).map(
              (productPlan: any) =>{
                const theProductPlan = productPlan
                if(theProductPlan.planCode === plan.planCode){
                  return {
                    ...plan,
                    subCode: event.data.subscription_code
                  }
                }else {
                  return theProductPlan
                }
              }
            );
            await prisma.user.update({
              where: {
                userId: user.userId
              },
              data: {
                itemsSubPlans: JSON.stringify(updatedItemPlans)
              }
            })
          }
          if(user.servicesSubPlans){
            const updatedServicePlans = JSON.parse(`${user.servicesSubPlans}`).map(
              (productPlan: any) =>{
                const theProductPlan = productPlan
                if(theProductPlan.planCode === plan.planCode){
                  return {
                    ...plan,
                    subCode: event.data.subscription_code
                  }
                }else {
                  return theProductPlan
                }
              }
            );
            await prisma.user.update({
              where: {
                userId: user.userId
              },
              data: {
                servicesSubPlans: JSON.stringify(updatedServicePlans)
              }
            })
          }
          if(user.lodgesSubPlans){
            const updatedLodgePlans = JSON.parse(`${user.lodgesSubPlans}`).map(
              (productPlan: any) =>{
                const theProductPlan = productPlan
                if(theProductPlan.planCode === plan.planCode){
                  return {
                    ...plan,
                    subCode: event.data.subscription_code
                  }
                }else {
                  return theProductPlan
                }
              }
            );
            await prisma.user.update({
              where: {
                userId: user.userId
              },
              data: {
                lodgesSubPlans: JSON.stringify(updatedLodgePlans)
              }
            })
          }
          if(user.roomsSubPlans){
            const updatedRoomPlans = JSON.parse(`${user.roomsSubPlans}`).map(
              (productPlan: any) =>{
                const theProductPlan = productPlan
                if(theProductPlan.planCode === plan.planCode){
                  return {
                    ...plan,
                    subCode: event.data.subscription_code
                  }
                }else {
                  return theProductPlan
                }
              }
            );
            await prisma.user.update({
              where: {
                userId: user.userId
              },
              data: {
                roomsSubPlans: JSON.stringify(updatedRoomPlans)
              }
            })
          }
        }
  
        const planCode = plan.planCode
        await prisma.item.updateMany({
          where: {
            planCode: planCode
          },
          data: {
            plan: JSON.stringify(plan)
          }
        })
  
        await prisma.service.updateMany({
          where: {
            planCode: planCode
          },
          data: {
            plan: JSON.stringify(plan)
          }
        })
  
        await prisma.lodge.updateMany({
          where: {
            planCode: planCode
          },
          data: {
            plan: JSON.stringify(plan)
          }
        })
  
        await prisma.room.updateMany({
          where: {
            planCode: planCode
          },
          data: {
            plan: JSON.stringify(plan)
          }
        })
  
      } else if (event.event === "subscription.not_renew") {
        try{
          console.log(event);
          const plan = {
            planName: event.data.plan.name,
            planCode: event.data.plan.plan_code,
            maxNumberOfSchools: Number(event.data.plan.name.split(" ")[4]),
            maxNumberOfProducts: Number(event.data.plan.name.split(" ")[1]),
          }
    
          console.log(plan)
          const planCode = plan.planCode
          console.log(planCode)
          await prisma.item.updateMany({
            where: {
              planCode: planCode
            },
            data: {
              planStatus: "disabled"
            }
          })
    
          await prisma.service.updateMany({
            where: {
              planCode: planCode
            },
            data: {
              planStatus: "disabled"
            }
          })
    
          await prisma.lodge.updateMany({
            where: {
              planCode: planCode
            },
            data: {
              planStatus: "disabled"
            }
          })
    
          await prisma.room.updateMany({
            where: {
              planCode: planCode
            },
            data: {
              planStatus: "disabled"
            }
          })
        }catch(error){
          console.error(error)
        }
  
  
      } else if (event.event === "subscription.disable") {
        console.log(event);
  
        const plan = {
          planName: event.data.plan.name,
          planCode: event.data.plan.plan_code,
          maxNumberOfSchools: Number(event.data.plan.name.split(" ")[4]),
          maxNumberOfProducts: Number(event.data.plan.name.split(" ")[1]),
        }
  
        const user = await prisma.user.findUnique({ where: { email: event.data.customer.email } })
        
        if(user){
          if(user.itemsSubPlans){
            const filteredItemPlans = JSON.parse(`${user.itemsSubPlans}`).filter(
              (productPlan: any) =>{
                return JSON.parse(`${productPlan}`).planCode !== plan.planCode
              }
            );
            await prisma.user.update({
              where: {
                userId: user.userId
              },
              data: {
                itemsSubPlans: JSON.stringify(filteredItemPlans)
              }
            })
          }
          if(user.servicesSubPlans){
            const filteredServicePlans = JSON.parse(`${user.servicesSubPlans}`).filter(
              (productPlan: any) =>{
                return JSON.parse(`${productPlan}`).planCode !== plan.planCode
              }
            );
            await prisma.user.update({
              where: {
                userId: user.userId
              },
              data: {
                servicesSubPlans: JSON.stringify(filteredServicePlans)
              }
            })
          }
          if(user.lodgesSubPlans){
            const filteredLodgePlans = JSON.parse(`${user.lodgesSubPlans}`).filter(
              (productPlan: any) =>{
                return JSON.parse(`${productPlan}`).planCode !== plan.planCode
              }
            );
            await prisma.user.update({
              where: {
                userId: user.userId
              },
              data: {
                lodgesSubPlans: JSON.stringify(filteredLodgePlans)
              }
            })
          }
          if(user.roomsSubPlans){
            const filteredRoomPlans = JSON.parse(`${user.roomsSubPlans}`).filter(
              (productPlan: any) =>{
                return JSON.parse(`${productPlan}`).planCode !== plan.planCode
              }
            );
            await prisma.user.update({
              where: {
                userId: user.userId
              },
              data: {
                roomsSubPlans: JSON.stringify(filteredRoomPlans)
              }
            })
          }
        }
  
        const planCode = plan.planCode
        await prisma.item.deleteMany({
          where: {
            planCode: planCode
          }
        })
  
        await prisma.service.deleteMany({
          where: {
            planCode: planCode
          }
        })
  
        await prisma.lodge.deleteMany({
          where: {
            planCode: planCode
          }
        })
  
        await prisma.room.deleteMany({
          where: {
            planCode: planCode
          }
        })
      }
    }
  }catch(error){
    console.error(error)
  }
}

export async function get_canceled_trans_image_urls_for_delete(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const transactionImages = await prisma.imagesfordelete.findMany();
  console.log(transactionImages);
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

  console.log(freeTierProductsForDelete);

  const imagesUrlArrayStringForDelete = freeTierProductsForDelete.map(
    (imagefordelete) => imagefordelete.imagesUrlArrayString.split(","),
  );
  let urlArrayToDelete = [];
  for (let i = 0; i < imagesUrlArrayStringForDelete.length; i++) {
    for (let j = 0; j < imagesUrlArrayStringForDelete[i].length; j++) {
      urlArrayToDelete.push(imagesUrlArrayStringForDelete[i][j]);
    }
  }
  console.log(urlArrayToDelete);

  for (let i = 0; i < freeTierItems.length; i++) {
    await prisma.item_school.deleteMany({
      where: { itemId: freeTierItems[i].itemId },
    });
  }

  for (let i = 0; i < freeTierServices.length; i++) {
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
