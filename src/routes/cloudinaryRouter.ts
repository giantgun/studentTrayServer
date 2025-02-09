import express from "express";
import asyncHandler from "express-async-handler";
import { get_file_signature } from "../controllers/cloudinaryController";
import { authorization } from "../utils/authorization";
import { create_profile_photo_folder, get_user_photo_url_for_overwrite } from "../controllers/userController";
import {
  create_business_cover_photo_folder,
  create_business_profile_photo_folder,
  get_business_cover_photo_url_for_overwrite,
  get_business_photo_url_for_overwrite,
} from "../controllers/businessController";
import { create_item_images_folder, get_item_image_url_for_overwrite } from "../controllers/itemController";
import { create_service_images_folder, get_service_image_url_for_overwrite } from "../controllers/serviceController";
import { create_lodge_images_folder, get_lodge_image_url_for_overwrite } from "../controllers/lodgeController";
import { create_room_images_folder, get_room_image_url_for_overwrite } from "../controllers/roomController";

const router = express.Router();

router.get(
  "/listLodge",
  asyncHandler(authorization),
  asyncHandler(create_lodge_images_folder),
  asyncHandler(get_file_signature),
);

router.get(
  "/listRoom",
  asyncHandler(authorization),
  asyncHandler(create_room_images_folder),
  asyncHandler(get_file_signature),
);

router.get(
  "/listItem",
  asyncHandler(authorization),
  asyncHandler(create_item_images_folder),
  asyncHandler(get_file_signature),
);

router.get(
  "/listService",
  asyncHandler(authorization),
  asyncHandler(create_service_images_folder),
  asyncHandler(get_file_signature),
);

router.get(
  "/user/profile-photo",
  asyncHandler(authorization),
  asyncHandler(create_profile_photo_folder),
  asyncHandler(get_user_photo_url_for_overwrite),
  asyncHandler(get_file_signature),
);

router.get(
  "/business/profile-photo",
  asyncHandler(authorization),
  asyncHandler(create_business_profile_photo_folder),
  asyncHandler(get_business_photo_url_for_overwrite),
  asyncHandler(get_file_signature),
);

router.get(
  "/business/cover-photo",
  asyncHandler(authorization),
  asyncHandler(create_business_cover_photo_folder),
  asyncHandler(get_business_cover_photo_url_for_overwrite),
  asyncHandler(get_file_signature),
);

router.get(
  "/item/:itemId/image/:selectedIndex",
  asyncHandler(authorization),
  asyncHandler(get_item_image_url_for_overwrite),
  asyncHandler(get_file_signature),
);

router.get(
  "/service/:serviceId/image/:selectedIndex",
  asyncHandler(authorization),
  asyncHandler(get_service_image_url_for_overwrite),
  asyncHandler(get_file_signature),
);

router.get(
  "/lodge/:lodgeId/image/:selectedIndex",
  asyncHandler(authorization),
  asyncHandler(get_lodge_image_url_for_overwrite),
  asyncHandler(get_file_signature),
);

router.get(
  "/room/:roomId/image/:selectedIndex",
  asyncHandler(authorization),
  asyncHandler(get_room_image_url_for_overwrite),
  asyncHandler(get_file_signature),
);

export default router;
