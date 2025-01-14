import express from "express"
import { authorization } from "../utils/authorization"
import asyncHandler from "express-async-handler"
import { delete_lodge, edit_lodge, get_a_lodge, get_all_lodges, list_lodge } from "../controllers/lodgeController"

const router = express.Router()

router.get("/", asyncHandler(authorization), asyncHandler(get_all_lodges))

router.get("/:lodgeId", asyncHandler(authorization), asyncHandler(get_a_lodge))

router.get("/:lodgeId/delete", asyncHandler(authorization), asyncHandler(delete_lodge))

router.get("/:lodgeId/edit", asyncHandler(authorization), asyncHandler(edit_lodge))

router.post("/listLodge", asyncHandler(authorization), asyncHandler(list_lodge))

export default router