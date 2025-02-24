import express from "express";
import { index_get, not_found } from "../controllers/indexController";
import asyncHandler from "express-async-handler";

const router = express.Router();

router.get("/land", asyncHandler(index_get));

router.get("/", asyncHandler(not_found))

export default router;
