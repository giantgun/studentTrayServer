import express from "express"
import asyncHandler from "express-async-handler"
import { authorization } from "../config/authorization"
import { edit_business, register_business } from "../controllers/businessController"

const router =  express.Router()

router.post("/register", asyncHandler(authorization), asyncHandler(register_business))

router.post("/edit", asyncHandler(authorization), asyncHandler(edit_business))

export default router