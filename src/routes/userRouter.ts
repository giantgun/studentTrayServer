import express from "express"
import { signUp_user, signIn_user, signOut_user, edit_profile } from "../controllers/userController"
import asyncHandler from "express-async-handler"
import dotenv from "dotenv"
import { index_get } from "../controllers/indexController"
import { authorization } from "../utils/authorization"

dotenv.config()



const router = express.Router()

router.post("/signUp", asyncHandler(signUp_user))

router.post("/signIn", asyncHandler(signIn_user))

router.get("/signOut", asyncHandler(signOut_user))

router.get("/", asyncHandler(index_get))

router.post("/editProfile", asyncHandler(authorization), asyncHandler(edit_profile))

export default router