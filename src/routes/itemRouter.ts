import express from "express"
import asyncHandler from "express-async-handler"
import { authorization } from "../config/authorization"
import { list_item } from "../controllers/itemController"

const router = express.Router()

router.post("/listItem", asyncHandler(authorization), asyncHandler(list_item))

export default router