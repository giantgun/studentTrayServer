import express from "express"
import { authorization } from "../utils/authorization"
import asyncHandler from "express-async-handler"
import { get_a_lodge, get_all_lodges, list_lodge } from "../controllers/lodgeControllers"

const router = express.Router()

router.get("/", asyncHandler(authorization), asyncHandler(get_all_lodges))

router.get("/:lodgeId", asyncHandler(authorization), asyncHandler(get_a_lodge))

router.post("/listLodge", asyncHandler(authorization), asyncHandler(list_lodge))

export default router