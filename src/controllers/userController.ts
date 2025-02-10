import argon2 from "argon2";
import { Response, Request, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import {
  changePasswordMessage,
  sendAnEmail,
  sendAnEmailAsText,
  verifyEmailMessage,
} from "../utils/utils";

const prisma = new PrismaClient();

dotenv.config();

const tokenSecret = process.env.TOKEN_SECRET;

export async function create_profile_photo_folder(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> {
  const user = req.user;
  req.imageUploadFolderPath = `${user.email}/profilePhoto`;
  next();
}

export async function signUp_user(req: Request, res: Response): Promise<any> {
  try {
    const { username, email, password, phoneNumber, school } = req.body;
    if (!username || !email || !password || !school || !phoneNumber) {
      return res.status(400).json("Invalid input.");
    }

    const existingUserEmail = await prisma.user.findUnique({
      where: { email: email },
    });
    if (existingUserEmail) {
      return res.status(400).json("email already in use.");
    }

    const existingUserUsername = await prisma.user.findUnique({
      where: { username: username },
    });
    if (existingUserUsername) {
      return res.status(400).json("Username already exist.");
    }

    const existingSchool = await prisma.school.findFirst({
      where: { schoolName: school },
    });
    if (!existingSchool) {
      return res
        .status(400)
        .json("Sorry, we are not available in your school yet.");
    }

    const hashedPassword = await argon2.hash(password);
    const currentDate = new Date();
    const token = await generateEmailVerificationToken(email, phoneNumber);

    await prisma.user.create({
      data: {
        username: username,
        email: email,
        password: hashedPassword,
        schoolId: existingSchool!.schoolId,
        phoneNumber: phoneNumber.toString(),
        updatedAt: currentDate,
        emailVtoken: token,
        verified: true
      },
      select: {
        userId: true,
      },
    });

    return res.status(200).json("Sign up successfull.");
  } catch (error) {
    console.error(error);
    res.status(400).json("an error occurred");
  }
}

export async function verify_user(req: Request, res: Response): Promise<any> {
  try {
    const userId = Number(req.params.userId);
    const token = req.params.token;

    if (!userId || !token) {
      return res.status(400).json("Invalid input.");
    }

    const user = await prisma.user.findUnique({
      where: {
        userId: userId,
      },
      include: {
        school: true,
      },
    });
    if (!user) {
      return res.status(400).json("Invalid input.");
    }

    const isTokenValid = user.emailVtoken === token;

    if (!isTokenValid) {
      return res.status(400).json("token is either expired or never existed.");
    }
    await prisma.user.update({
      where: {
        userId: user.userId,
      },
      data: {
        verified: true,
      },
    });
    return res.json("email verified successfully.");
  } catch (error) {
    console.error(error);
  }
}

export async function resend_verification_email(
  req: Request,
  res: Response,
): Promise<any> {
  const userId = Number(req.params.userId);

  const user = await prisma.user.findUnique({
    where: {
      userId: userId,
    },
  });
  if (!user) {
    return res.status(400).json("user does not exist");
  }
  const token = await generateEmailVerificationToken(
    user.email,
    Number(user.phoneNumber),
  );

  await prisma.user.update({
    where: {
      userId: user.userId,
    },
    data: {
      emailVtoken: token,
    },
  });
  const verificationLink = `${process.env.SITE_URL}/account/verified/${user.userId}/${token}`;

  await sendAnEmail(
    user.email,
    "Verify Email",
    verifyEmailMessage(verificationLink),
    res,
  );

  return res
    .status(200)
    .json("A verification link has been sent to your email.");
}

export async function resend_change_password_email(
  req: Request,
  res: Response,
): Promise<any> {
  const { usernameOrEmail } = req.body;

  const user = await prisma.user.findFirst({
    where: {
      OR: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    },
  });

  if (!user) {
    return res
      .status(200)
      .json(
        "A link to change has been sent to your email if the email is registered1.",
      );
  }

  const currentDate = new Date();
  const token = await generateEmailVerificationToken(
    user.email,
    Number(user.phoneNumber),
    currentDate,
  );

  await prisma.user.update({
    where: {
      userId: user.userId,
    },
    data: {
      emailVtoken: token,
    },
  });
  const verificationLink = `${process.env.SITE_URL}/account/change-password/${user.userId}/${token}`;

  await sendAnEmail(
    user.email,
    "Change your Password",
    changePasswordMessage(verificationLink),
    res,
  );

  return res
    .status(200)
    .json(
      "A link to change has been sent to your email if the email is registered.",
    );
}

export async function send_suggestion_email(
  req: Request,
  res: Response,
): Promise<any> {
  const { userEmail, message } = req.body;

  await sendAnEmailAsText(
    "service@studenttray.com",
    "Suggestion",
    message,
    userEmail,
    res,
  );

  return res.status(200).json("Sent successfully.");
}

export async function send_support_email(
  req: Request,
  res: Response,
): Promise<any> {
  const { userEmail, message } = req.body;

  await sendAnEmailAsText(
    "service@studenttray.com",
    "Support",
    message,
    userEmail,
    res,
  );

  return res.status(200).json("Sent successfully.");
}

export async function update_password(
  req: Request,
  res: Response,
): Promise<any> {
  const { newPassword } = req.body;
  const userId = Number(req.params.userId);
  const token = req.params.token;

  if (!newPassword || !userId || !token) {
    return res.status(400).json("Invalid Input.");
  }

  const user = await prisma.user.findUnique({
    where: {
      userId: userId,
    },
    include: {
      school: true,
    },
  });
  if (!user) {
    return res.status(400).json("Invalid input.");
  }

  const isTokenValid = user.emailVtoken === token;

  if (!isTokenValid) {
    return res.status(400).json("token is either expired or never existed.");
  }

  const editedUser = await prisma.user.update({
    where: { userId: user.userId },
    data: {
      password: newPassword,
    },
    select: {
      school: true,
      password: true,
      username: true,
      userId: true,
      email: true,
      photoUrl: true,
    },
  });

  return res.status(200).json({
    username: editedUser!.username,
    school: editedUser!.school,
    photoUrl: editedUser!.photoUrl,
  });
}

export async function get_update_password_link(
  req: Request,
  res: Response,
): Promise<any> {
  const user = req.user;

  const currentDate = new Date();
  const token = await generateEmailVerificationToken(
    user.email,
    Number(user.phoneNumber),
    currentDate,
  );

  await prisma.user.update({
    where: {
      userId: user.userId,
    },
    data: {
      emailVtoken: token,
    },
  });
  const verificationLink = `${process.env.SITE_URL}/account/change-password/${user.userId}/${token}`;

  return res.status(200).json({
    changePasswordLink: verificationLink,
    userId: user.userId,
    token: token,
  });
}

export async function signIn_user(req: Request, res: Response): Promise<any> {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json("Invalid input.");
    }

    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
      include: {
        school: true,
      },
    });
    if (!user) {
      return res.status(400).json("Invalid Username or Password.");
    }

    const isPasswordValid = await argon2.verify(user!.password, password);
    if (!isPasswordValid) {
      return res.status(400).json("Invalid Username or Password.");
    }

    if (user.verified === false) {
      return res.status(403).json({
        message: "email not verified",
        userId: user.userId,
        email: user.email,
      });
    }
    const business = await prisma.business.findUnique({
      where: { userId: user.userId },
    });

    const token = await generateAccessToken(user.email);
    if (business) {
      const nearestSchool = await prisma.school.findUnique({
        where: { schoolId: business?.nearestSchoolId },
      });

      return res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
          secure: true,
          domain: process.env.SITE_URL,
          sameSite: 'none'
        })
        .json({
          user: {
            username: user.username,
            school: user.school,
            photoUrl: user.photoUrl,
            email: user.email,
            phoneNumber: user.phoneNumber,
          },
          business: {
            businessName: business.businessName,
            address: business.address,
            businessEmail: business.businessEmail,
            phoneNumber: business.phoneNumber,
            nearestSchool: nearestSchool,
            description: business.description,
            dateJoined: business.createdAt,
          },
        });
    }

    return res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
      })
      .json({
        user: {
          username: user.username,
          school: user.school,
          photoUrl: user.photoUrl,
          email: user.email,
          phoneNumber: user.phoneNumber,
        },
      });
  } catch (error) {
    console.error(error);
  }
}

export async function signOut_user(req: Request, res: Response): Promise<any> {
  return res
    .clearCookie("access_token")
    .status(200)
    .json("Sign out successful.");
}

export async function edit_profile(req: Request, res: Response): Promise<any> {
  const { username, email, phoneNumber, school } = req.body;

  const user = req.user;
  if (!username || !email || !phoneNumber || !school) {
    return res.status(400).json("Invalid Input.");
  }

  const editedUser = await prisma.user.update({
    where: { userId: user.userId },
    data: {
      username: username,
      email,
      phoneNumber,
      school: {
        connect: {
          schoolName: school,
        },
      },
    },
    select: {
      school: true,
      password: true,
      username: true,
      userId: true,
      email: true,
      photoUrl: true,
    },
  });

  return res.status(200).json({
    username: editedUser!.username,
    school: editedUser!.school,
    photoUrl: editedUser!.photoUrl,
  });
}

export async function get_user_public(
  req: Request,
  res: Response,
): Promise<any> {
  const userId = req.params.userId;

  const user = await prisma.user.findUnique({
    where: { userId: Number(userId) },
    select: {
      school: true,
      password: true,
      username: true,
      userId: true,
      email: true,
      photoUrl: true,
      createdAt: true,
    },
  });
  const reviews = await prisma.review.findMany({
    where: { userId: Number(userId) },
  });

  if (!user) {
    return res.status(400).json("User does not exist");
  }

  let userReviews = [];

  for (let i = 0; i < reviews.length; i++) {
    const owner = await prisma.user.findFirst({
      where: { userId: reviews[i].ownerUserId },
    });
    const review = {
      ...reviews[i],
      ownerPhotoUrl: owner?.photoUrl,
      username: owner?.username,
    };
    userReviews.push(review);
  }

  return res.json({
    username: user?.username,
    school: user?.school,
    photoUrl: user?.photoUrl,
    dateJoined: user?.createdAt,
    reviews: userReviews,
  });
}

export async function get_user_private(
  req: Request,
  res: Response,
): Promise<any> {
  const userId = req.user.userId;

  const reviews = await prisma.review.findMany({ where: { userId: userId } });
  const user = await prisma.user.findUnique({
    where: { userId: userId },
    include: {
      school: true,
      review: true,
      lodge: true,
      item: true,
      service: true,
      room: true,
      business: true,
    },
  });

  if (!user) {
    return res.status(400).json("User exist");
  }

  let userReviews = [];

  for (let i = 0; i < reviews.length; i++) {
    const owner = await prisma.user.findUnique({
      where: { userId: reviews[i].ownerUserId },
    });
    const review = {
      ...reviews[i],
      ownerPhotoUrl: owner?.photoUrl,
      username: owner?.username,
    };
    userReviews.push(review);
  }

  return res.json({
    username: user?.username,
    school: user?.school.schoolName,
    photoUrl: user?.photoUrl,
    businessId: user.business?.businessId,
    reviews: userReviews,
    items: user.item,
    services: user.service,
    lodges: user.lodge,
    rooms: user.room,
    createdAt: user.createdAt,
    email: user.email,
    phoneNumber: user.phoneNumber,
    itemFreeSlots: Number(process.env.ITEMS_FREE_SLOTS),
    serviceFreeSlots: Number(process.env.SERVICES_FREE_SLOTS),
    lodgeFreeSlots: Number(process.env.LODGES_FREE_SLOTS),
    roomFreeSlots: Number(process.env.ROOMS_FREE_SLOTS),
    itemSubPlans: user.itemsSubPlans,
    serviceSubPlans: user.servicesSubPlans,
    lodgeSubPlans: user.lodgesSubPlans,
    roomSubPlans: user.roomsSubPlans,
  });
}

export async function get_user_photo_url_for_overwrite(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const user = req.user;

  req.urlToOverwrite = user?.photoUrl;
  next();
}

export async function save_user_photo_url(
  req: Request,
  res: Response,
): Promise<any> {
  const user = req.user;
  const { photoUrl } = req.body;

  await prisma.user.update({
    where: { userId: user.userId },
    data: {
      photoUrl: photoUrl,
    },
  });

  return res.json("Upload succesful.");
}

export async function save_user_new_subscription_plan(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const user = req.user;
  const plan = req.plan;
  const product = req.product;
  const productTier = req.productTier;
  const paystackCustomerCode = req.paystackCustomerCode;

  try {
    if (plan && user) {
      if (!user.paystackCustomerCode) {
        await prisma.user.update({
          where: {
            userId: user.userId,
          },
          data: {
            paystackCustomerCode: paystackCustomerCode,
          },
        });
      }
      if (product === "item") {
        if (productTier === "paid") {
          if (user.itemsSubPlans) {
            let newItemPlans = JSON.parse(user.itemsSubPlans);
            newItemPlans.push(plan);
            await prisma.user.update({
              where: { userId: user.userId },
              data: {
                itemsSubPlans: JSON.stringify(newItemPlans),
              },
            });
          } else {
            let newItemPlans = [];
            newItemPlans.push(plan);
            await prisma.user.update({
              where: { userId: user.userId },
              data: {
                itemsSubPlans: JSON.stringify(newItemPlans),
              },
            });
          }
        }
        next();
      } else if (product === "service") {
        if (productTier === "paid") {
          if (user.servicesSubPlans) {
            let newServicesPlans = JSON.parse(user.servicesSubPlans);
            newServicesPlans.push(plan);
            await prisma.user.update({
              where: { userId: user.userId },
              data: {
                servicesSubPlans: JSON.stringify(newServicesPlans),
              },
            });
          } else {
            let newServicesPlans = [];
            newServicesPlans.push(plan);
            await prisma.user.update({
              where: { userId: user.userId },
              data: {
                servicesSubPlans: JSON.stringify(newServicesPlans),
              },
            });
          }
        }
        next();
      } else if (product === "lodge") {
        if (productTier === "paid") {
          if (user.lodgesSubPlans) {
            let newLodgePlans = JSON.parse(user.lodgesSubPlans);
            newLodgePlans.push(plan);
            await prisma.user.update({
              where: { userId: user.userId },
              data: {
                lodgesSubPlans: JSON.stringify(newLodgePlans),
              },
            });
          } else {
            let newLodgePlans = [];
            newLodgePlans.push(plan);
            await prisma.user.update({
              where: { userId: user.userId },
              data: {
                lodgesSubPlans: JSON.stringify(newLodgePlans),
              },
            });
          }
        }
        next();
      } else if (product === "room") {
        if (productTier === "paid") {
          if (user.roomsSubPlans) {
            let newRoomPlans = JSON.parse(user.roomsSubPlans);
            newRoomPlans.push(plan);
            await prisma.user.update({
              where: { userId: user.userId },
              data: {
                roomsSubPlans: JSON.stringify(newRoomPlans),
              },
            });
          } else {
            let newRoomPlans = [];
            newRoomPlans.push(plan);
            await prisma.user.update({
              where: { userId: user.userId },
              data: {
                roomsSubPlans: JSON.stringify(newRoomPlans),
              },
            });
          }
        }
        next();
      }
    }
  } catch (error: any) {
    console.error(error);
  }
}

async function generateAccessToken(email: string) {
  return jwt.sign({ email: email }, tokenSecret!, { expiresIn: "7d" });
}

async function generateEmailVerificationToken(
  email: string,
  phoneNumber: number,
  date?: Date,
) {
  return jwt.sign(
    { email: email, phoneNumber: phoneNumber, timeStamp: date },
    tokenSecret!,
    {
      expiresIn: "1d",
    },
  );
}
