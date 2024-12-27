import express from "express"
import { signUp_user, signIn_user, signOut_user } from "../controllers/userController"
import asyncHandler from "express-async-handler"
import dotenv from "dotenv"
import { index_get } from "../controllers/indexController"

dotenv.config()



const router = express.Router()

router.post("/signUp", asyncHandler(signUp_user))

router.post("/signIn", asyncHandler(signIn_user))

router.get("/signOut", asyncHandler(signOut_user))

router.get("/", asyncHandler(index_get))

export default router