import express from "express"
import asyncHandler from "express-async-handler"
import { authorization } from "../utils/authorization"
import { edit_business, get__business_public, register_business } from "../controllers/businessController"
import { create_business_review } from "../controllers/reviewController"

const router =  express.Router()

router.post("/register", asyncHandler(authorization), asyncHandler(register_business))

router.post("/edit", asyncHandler(authorization), asyncHandler(edit_business))

router.get("/public/:businessId", asyncHandler(authorization), asyncHandler(get__business_public))

router.post("/public/:businessId/review", asyncHandler(authorization), asyncHandler(create_business_review))

export default router