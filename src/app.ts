import express from "express";
import logger from "morgan";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import indexRouter from "./routes/indexRouter";
import userRouter from "./routes/userRouter";
import lodgeRouter from "./routes/lodgeRouter";
import roomRouter from "./routes/roomRouter";
import itemRouter from "./routes/itemRouter";
import serviceRouter from "./routes/serviceRouter";
import businessRouter from "./routes/businessRouter";
import cloudinaryRouter from "./routes/cloudinaryRouter";
import webhookRouter from "./routes/webHookRouter";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const siteUrl =
  `https://${process.env.SITE_URL}` || "https://my-tray.vercel.app";

//middleware
app.use(logger("dev"));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: siteUrl,
    credentials: true,
  }),
);

//routes
app.use("/", indexRouter);
app.use(/\/cloudinary*/, cloudinaryRouter);
app.use(/\/user*/, userRouter);
app.use(/\/lodges*/, lodgeRouter);
app.use(/\/rooms*/, roomRouter);
app.use(/\/items*/, itemRouter);
app.use(/\/services*/, serviceRouter);
app.use(/\/business*/, businessRouter);
app.use(/\/webhook*/, webhookRouter);

//error handling
app.use((req, res, next) => {
  const err: any = new Error("Not Found");
  err["status"] = 404;
  next(err);
});

export default app;
