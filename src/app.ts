import express from "express"
import path from "path"
import logger from  "morgan"
import cookieParser from "cookie-parser"
import indexRouter from "./routes/indexRouter"
import userRouter from "./routes/userRouter"

const app = express()

//middleware
app.use(logger('dev'))
app.use(cookieParser())
app.use(express.urlencoded({extended: false}))
app.use(express.json())


//routes
app.use("/", indexRouter)
app.use("/user", userRouter)

//error handling
app.use((req, res, next) => {
    const err: any = new Error("Not Found")
    err["status"] = 404
    next(err)
})

export default app