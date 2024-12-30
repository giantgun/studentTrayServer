import express from "express"
import { authorization } from "../config/authorization"
import asyncHandler from "express-async-handler"
import { all_lodges, list_lodge } from "../controllers/lodgeControllers"

const router = express.Router()

router.get("/", asyncHandler(authorization), asyncHandler(all_lodges))

router.post("/listLodge", asyncHandler(authorization), asyncHandler(list_lodge))

export default router