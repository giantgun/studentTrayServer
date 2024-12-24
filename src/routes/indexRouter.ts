import express from "express"

const indexRouter = express.Router()

indexRouter.get("/", function(req, res, next){
    res.send("NOT IMPLEMENTED: index yet")
})

export default indexRouter