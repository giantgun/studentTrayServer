import express from "express"
import { authorization } from "../config/authorization"
import asyncHandler from "express-async-handler"
import { list_lodge } from "../controllers/lodgeControllers"

const router = express.Router()

router.post("/listLodge", asyncHandler(authorization), asyncHandler(list_lodge))

export default router