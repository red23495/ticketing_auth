import express from "express";
import { json } from "body-parser";
import config from "../config";
import userRouter from "./route/user";
import errorHandler from "./middleware/error";
import cookieSession from "cookie-session";
import { currentUser } from "./middleware/currentUser";

const app = express();

app.set("trust proxy", true);
app.use(
  cookieSession({
    signed: false,
    secure: config.httpsEnabled,
  })
);

app.use(json());
app.use(currentUser);
app.use(userRouter);

app.use(errorHandler);

export default app;