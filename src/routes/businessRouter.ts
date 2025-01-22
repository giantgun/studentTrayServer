import express from "express";
import asyncHandler from "express-async-handler";
import { authorization } from "../utils/authorization";
import {
  edit_business,
  get__business_private,
  get__business_public,
  register_business,
  save_business_cover_photo_url,
  save_business_photo_url,
} from "../controllers/businessController";
import { create_business_review } from "../controllers/reviewController";

const router = express.Router();

router.post(
  "/register",
  asyncHandler(authorization),
  asyncHandler(register_business),
);

router.post("/edit", asyncHandler(authorization), asyncHandler(edit_business));

router.post(
  "/profile/edit/photo-url",
  asyncHandler(authorization),
  asyncHandler(save_business_photo_url),
);

router.post(
  "/profile/edit/cover-photo-url",
  asyncHandler(authorization),
  asyncHandler(save_business_cover_photo_url),
);

router.get(
  "/public/:businessId",
  asyncHandler(authorization),
  asyncHandler(get__business_public),
);

router.get(
  "/profile",
  asyncHandler(authorization),
  asyncHandler(get__business_private),
);

router.post(
  "/review/:businessId",
  asyncHandler(authorization),
  asyncHandler(create_business_review),
);

export default router;
