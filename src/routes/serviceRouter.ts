import express from "express"
import asyncHandler from "express-async-handler"
import { authorization } from "../config/authorization"
import { list_service } from "../controllers/serviceController"

const router = express.Router()

router.post("/listService", asyncHandler(authorization), asyncHandler(list_service))

export default router