import express from "express";
import { index_get } from "../controllers/indexController";
import asyncHandler from "express-async-handler";

const router = express.Router();

router.get("/", asyncHandler(index_get));

export default router;
