import express from "express"
import asyncHandler from "express-async-handler"
import { authorization } from "../utils/authorization"
import { delete_room, edit_room, get_a_room, get_all_rooms, list_room } from "../controllers/roomController"

const router = express.Router()

router.get("/", asyncHandler(authorization), asyncHandler(get_all_rooms))

router.get("/:roomId", asyncHandler(authorization), asyncHandler(get_a_room))

router.get("/:roomId/delete", asyncHandler(authorization), asyncHandler(delete_room))

router.post("/:roomId/edit", asyncHandler(authorization), asyncHandler(edit_room))

router.post("/listRoom", asyncHandler(authorization), asyncHandler(list_room))

export default router