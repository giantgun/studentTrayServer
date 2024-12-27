import express from "express"
import logger from  "morgan"
import cookieParser from "cookie-parser"
import bodyParser from "body-parser"
import indexRouter from "./routes/indexRouter"
import userRouter from "./routes/userRouter"
import lodgeRouter from "./routes/lodgeRouter"
import cors from "cors"

const app = express()

//middleware
app.use(logger('dev'))
app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
  }))

//routes
app.use("/", indexRouter)
app.use(/\/user*/, userRouter)
app.use(/\/lodges*/, lodgeRouter)

//error handling
app.use((req, res, next) => {
    const err: any = new Error("Not Found")
    err["status"] = 404
    next(err)
})

export default app
