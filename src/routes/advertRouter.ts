import express from "express"
import asyncHandler from "express-async-handler"
import { create_business_advert, create_user_advert, get_all_adverts } from "../controllers/advertController"
import { authorization } from "../utils/authorization"

const router = express.Router()

router.post("/user", asyncHandler(authorization), asyncHandler(create_user_advert))

router.post("/business", asyncHandler(authorization), asyncHandler(create_business_advert))

router.get("/", asyncHandler(authorization), asyncHandler(get_all_adverts))

export default router