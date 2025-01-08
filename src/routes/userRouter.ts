import express from "express"
import { signUp_user, signIn_user, signOut_user, edit_profile, get_user_public, get_user_private } from "../controllers/userController"
import asyncHandler from "express-async-handler"
import dotenv from "dotenv"
import { index_get } from "../controllers/indexController"
import { authorization } from "../utils/authorization"
import { giveAuthorization } from "../utils/giveAuthorization"
import { create_user_review } from "../controllers/reviewController"

dotenv.config()



const router = express.Router()

router.post("/signUp", asyncHandler(signUp_user))

router.post("/signIn", asyncHandler(signIn_user))

router.get("/signOut", asyncHandler(signOut_user))

router.get("/", asyncHandler(index_get))

router.get("/authorization", asyncHandler(giveAuthorization))

router.post("/editProfile", asyncHandler(authorization), asyncHandler(edit_profile))

router.get("/public/:userId", asyncHandler(authorization), asyncHandler(get_user_public))

router.get("/profile", asyncHandler(authorization), asyncHandler(get_user_private))

router.post("/public/:userId/review", asyncHandler(authorization), asyncHandler(create_user_review))

export default router