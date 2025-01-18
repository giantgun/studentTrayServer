import express from "express"
import asyncHandler from "express-async-handler"
import { paystackWebHook } from "../controllers/webhookController"

const router = express.Router()

router.post("/paystack", asyncHandler(paystackWebHook))

export default router