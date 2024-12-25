import express from "express"
import { register_user } from "../controllers/userController"
import asyncHandler from "express-async-handler"

const router = express.Router()

router.post("/user/register", asyncHandler(register_user))

export default router