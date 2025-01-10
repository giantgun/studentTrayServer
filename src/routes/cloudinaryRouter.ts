import express from "express"
import asyncHandler from "express-async-handler"
import { get_file_signature } from "../controllers/cloudinaryController"
import { authorization } from "../utils/authorization"
import { get_user_photo_url_for_overwrite } from "../controllers/userController"
import { get_business_cover_photo_url_for_overwrite, get_business_photo_url_for_overwrite } from "../controllers/businessController"

const router = express.Router()

router.get("/listLodge", asyncHandler(authorization), asyncHandler(get_file_signature))

router.get("/listRoom",  asyncHandler(authorization), asyncHandler(get_file_signature))

router.get("/listItem",  asyncHandler(authorization), asyncHandler(get_file_signature))

router.get("/listService",  asyncHandler(authorization), asyncHandler(get_file_signature))

router.get("/user/profile-photo",  asyncHandler(authorization), asyncHandler(get_user_photo_url_for_overwrite), asyncHandler(get_file_signature))

router.get("/business/profile-photo",  asyncHandler(authorization), asyncHandler(get_business_photo_url_for_overwrite), asyncHandler(get_file_signature))

router.get("/business/cover-photo",  asyncHandler(authorization), asyncHandler(get_business_cover_photo_url_for_overwrite), asyncHandler(get_file_signature))

export default router