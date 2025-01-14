import express from "express"
import asyncHandler from "express-async-handler"
import { authorization } from "../utils/authorization"
import { 
    delete_service, 
    edit_service, 
    get_a_service, 
    get_all_services, 
    list_service, 
} from "../controllers/serviceController"


const router = express.Router()

router.get("/", asyncHandler(authorization), asyncHandler(get_all_services))

router.get("/:serviceId", asyncHandler(authorization), asyncHandler(get_a_service))

router.get("/:serviceId/delete", asyncHandler(authorization), asyncHandler(delete_service))

router.post("/:serviceId/edit", asyncHandler(authorization), asyncHandler(edit_service))

router.post("/listService", asyncHandler(authorization), asyncHandler(list_service))

export default router