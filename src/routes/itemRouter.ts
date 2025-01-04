import express from "express"
import asyncHandler from "express-async-handler"
import { authorization } from "../utils/authorization"
import { delete_item, edit_item, get_all_items, get_an_item, list_item } from "../controllers/itemController"

const router = express.Router()

router.get("/", asyncHandler(authorization), asyncHandler(get_all_items))

router.get("/:itemId", asyncHandler(authorization), asyncHandler(get_an_item))

router.get("/:itemId/delete", asyncHandler(authorization), asyncHandler(delete_item))

router.get("/:itemId/edit", asyncHandler(authorization), asyncHandler(edit_item))

router.post("/listItem", asyncHandler(authorization), asyncHandler(list_item))

export default router