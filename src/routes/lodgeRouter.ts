import express from "express"
import { authorization } from "../utils/authorization"
import asyncHandler from "express-async-handler"
import { delete_lodge, edit_lodge, get_a_lodge, get_a_lodge_for_edit, get_all_lodges, get_lodge_images_url_for_delete, list_lodge, save_lodge_image_url } from "../controllers/lodgeController"
import { delete_files } from "../controllers/cloudinaryController"

const router = express.Router()

router.get("/", asyncHandler(authorization), asyncHandler(get_all_lodges))

router.get("/:lodgeId", asyncHandler(authorization), asyncHandler(get_a_lodge))


router.post("/:lodgeId/edit", asyncHandler(authorization), asyncHandler(edit_lodge))

router.get("/:lodgeId/edit", asyncHandler(authorization), asyncHandler(get_a_lodge_for_edit))

router.post("/:lodgeId/edit/image-url/:selectedIndex", asyncHandler(authorization), asyncHandler(save_lodge_image_url))

router.get("/:lodgeId/delete", asyncHandler(authorization), asyncHandler(get_lodge_images_url_for_delete), asyncHandler(delete_files), asyncHandler(delete_lodge))

router.post("/listLodge", asyncHandler(authorization), asyncHandler(list_lodge))

export default router