import express from "express";
import asyncHandler from "express-async-handler";
import { authorization } from "../utils/authorization";
import {
  delete_item,
  edit_item,
  get_all_items,
  get_an_item,
  get_an_item_for_edit,
  get_item_images_url_for_delete,
  list_item,
  save_item_image_url,
} from "../controllers/itemController";
import { delete_files_conditionally } from "../controllers/cloudinaryController";
import { pay_for_item_listing } from "../controllers/paystackController";

const router = express.Router();

router.get("/", asyncHandler(authorization), asyncHandler(get_all_items));

router.get("/:itemId", asyncHandler(authorization), asyncHandler(get_an_item));

router.get(
  "/:itemId/edit",
  asyncHandler(authorization),
  asyncHandler(get_an_item_for_edit),
);

router.post(
  "/:itemId/edit",
  asyncHandler(authorization),
  asyncHandler(edit_item),
);

router.get(
  "/:itemId/delete",
  asyncHandler(authorization),
  asyncHandler(get_item_images_url_for_delete),
  asyncHandler(delete_files_conditionally),
  asyncHandler(delete_item),
);

router.post(
  "/listItem",
  asyncHandler(authorization),
  asyncHandler(pay_for_item_listing),
  asyncHandler(list_item),
);

router.post(
  "/:itemId/edit/image-url/:selectedIndex",
  asyncHandler(authorization),
  asyncHandler(save_item_image_url),
);

export default router;
