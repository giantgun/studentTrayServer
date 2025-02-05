import express from "express";
import {
  signUp_user,
  signIn_user,
  signOut_user,
  edit_profile,
  get_user_public,
  get_user_private,
  save_user_photo_url,
  verify_user,
  resend_verification_email,
  update_password,
  resend_change_password_email,
  get_update_password_link,
} from "../controllers/userController";
import asyncHandler from "express-async-handler";
import dotenv from "dotenv";
import { index_get } from "../controllers/indexController";
import { authorization } from "../utils/authorization";
import { giveAuthorization } from "../utils/giveAuthorization";
import { create_user_review } from "../controllers/reviewController";
import { update_user_card } from "../controllers/paystackController";

dotenv.config();

const router = express.Router();

router.post("/signUp", asyncHandler(signUp_user));

router.get("/verify/:userId/:token", asyncHandler(verify_user));

router.get("/verify/:userId", asyncHandler(resend_verification_email));

router.post("/update-password/:userId/:token", asyncHandler(update_password))

router.post("/update-password", asyncHandler(resend_change_password_email));

router.get("/update-password", asyncHandler(authorization), asyncHandler(get_update_password_link));

router.post("/signIn", asyncHandler(signIn_user));

router.get("/signOut", asyncHandler(signOut_user));

router.get("/", asyncHandler(index_get));

router.get("/authorization", asyncHandler(giveAuthorization));

router.post(
  "/editProfile",
  asyncHandler(authorization),
  asyncHandler(edit_profile),
);

router.post(
  "/profile/edit/photo-url",
  asyncHandler(authorization),
  asyncHandler(save_user_photo_url),
);

router.post(
  "/profile/edit",
  asyncHandler(authorization),
  asyncHandler(edit_profile),
);

router.get(
  "/public/:userId",
  asyncHandler(authorization),
  asyncHandler(get_user_public),
);

router.get(
  "/profile",
  asyncHandler(authorization),
  asyncHandler(get_user_private),
);

router.post(
  "/review/:userId",
  asyncHandler(authorization),
  asyncHandler(create_user_review),
);

router.get(
  "/plan/:subCode",
  asyncHandler(authorization),
  asyncHandler(update_user_card),
);

export default router;
