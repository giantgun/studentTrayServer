import express from "express";
import asyncHandler from "express-async-handler";
import { authorization } from "../utils/authorization";
import {
  delete_room,
  edit_room,
  get_a_room,
  get_a_room_for_edit,
  get_all_rooms,
  get_room_images_url_for_delete,
  list_room,
  save_room_image_url,
} from "../controllers/roomController";
import { delete_files_conditionally } from "../controllers/cloudinaryController";
import { pay_for_room_listing } from "../controllers/paystackController";
import { not_found } from "../controllers/indexController";

const router = express.Router();

router.get("/", asyncHandler(authorization), asyncHandler(get_all_rooms));

router.get("/:roomId", asyncHandler(authorization), asyncHandler(get_a_room));

router.post(
  "/:roomId/edit",
  asyncHandler(authorization),
  asyncHandler(edit_room),
);

router.get(
  "/:roomId/edit",
  asyncHandler(authorization),
  asyncHandler(get_a_room_for_edit),
);

router.post(
  "/:roomId/edit/image-url/:selectedIndex",
  asyncHandler(authorization),
  asyncHandler(save_room_image_url),
);

router.get(
  "/:roomId/delete",
  asyncHandler(authorization),
  asyncHandler(get_room_images_url_for_delete),
  asyncHandler(delete_files_conditionally),
  asyncHandler(delete_room),
);

router.post(
  "/listRoom",
  asyncHandler(authorization),
  asyncHandler(pay_for_room_listing),
  asyncHandler(list_room),
);

router.get(/\/*/, asyncHandler(not_found));

router.post(/\/*/, asyncHandler(not_found));

export default router;
