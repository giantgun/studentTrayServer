import express from "express";
import asyncHandler from "express-async-handler";
import { authorization } from "../utils/authorization";
import {
  delete_service,
  edit_service,
  get_a_service,
  get_a_service_for_edit,
  get_all_services,
  get_service_images_url_for_delete,
  list_service,
  save_service_image_url,
} from "../controllers/serviceController";
import { delete_files_conditionally } from "../controllers/cloudinaryController";
import { pay_for_service_listing } from "../controllers/paystackController";
import { not_found } from "../controllers/indexController";

const router = express.Router();

router.get("/", asyncHandler(authorization), asyncHandler(get_all_services));

router.get(
  "/:serviceId",
  asyncHandler(authorization),
  asyncHandler(get_a_service),
);

router.get(
  "/:serviceId/delete",
  asyncHandler(authorization),
  asyncHandler(get_service_images_url_for_delete),
  asyncHandler(delete_files_conditionally),
  asyncHandler(delete_service),
);

router.post(
  "/:serviceId/edit",
  asyncHandler(authorization),
  asyncHandler(edit_service),
);

router.post(
  "/listService",
  asyncHandler(authorization),
  asyncHandler(pay_for_service_listing),
  asyncHandler(list_service),
);

router.get(
  "/:serviceId/edit",
  asyncHandler(authorization),
  asyncHandler(get_a_service_for_edit),
);

router.post(
  "/:serviceId/edit/image-url/:selectedIndex",
  asyncHandler(authorization),
  asyncHandler(save_service_image_url),
);

router.get(/\/*/, asyncHandler(not_found));

router.post(/\/*/, asyncHandler(not_found));

export default router;
