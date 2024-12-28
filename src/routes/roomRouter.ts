import express from "express"
import asyncHandler from "express-async-handler"
import { authorization } from "../config/authorization"

const router = express.Router()

router.post("/listRoom", asyncHandler(authorization))