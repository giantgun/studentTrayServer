import express from "express"
import asyncHandler from "express-async-handler"
import { get_image_signature } from "../controllers/cloudinaryController"
import { authorization } from "../utils/authorization"

const router = express.Router()

router.get("/listLodge", asyncHandler(authorization), asyncHandler(get_image_signature))

router.get("/listRoom",  asyncHandler(authorization), asyncHandler(get_image_signature))

router.get("/listItem",  asyncHandler(authorization), asyncHandler(get_image_signature))

router.get("/listService",  asyncHandler(authorization), asyncHandler(get_image_signature))

export default router