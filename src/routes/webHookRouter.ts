import express from "express";
import asyncHandler from "express-async-handler";
import {
  delete_overdue_free_tier_products,
  get_canceled_trans_image_urls_for_delete,
  paystack_web_hook,
} from "../controllers/webhookController";
import { delete_files_conditionally } from "../controllers/cloudinaryController";
import { list_item_from_webhook } from "../controllers/itemController";
import { list_service_from_webhook } from "../controllers/serviceController";
import { list_lodge_from_webhook } from "../controllers/lodgeController";
import { list_room_from_webhook } from "../controllers/roomController";

const router = express.Router();

router.post(
  "/paystack",
  asyncHandler(paystack_web_hook),
  asyncHandler(delete_files_conditionally),
  asyncHandler(list_item_from_webhook),
  asyncHandler(list_service_from_webhook),
  asyncHandler(list_lodge_from_webhook),
  asyncHandler(list_room_from_webhook),
);

router.get(
  "/canceled-transactions",
  asyncHandler(get_canceled_trans_image_urls_for_delete),
  asyncHandler(delete_files_conditionally),
);

router.get(
  "/free-tier",
  asyncHandler(delete_overdue_free_tier_products),
  asyncHandler(delete_files_conditionally),
);

export default router;
