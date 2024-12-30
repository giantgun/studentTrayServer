import express from "express"
import asyncHandler from "express-async-handler"
import { authorization } from "../config/authorization"
import { all_rooms, list_room } from "../controllers/roomController"

const router = express.Router()

router.get("/", asyncHandler(authorization), asyncHandler(all_rooms))

router.post("/listRoom", asyncHandler(authorization), asyncHandler(list_room))

export default router