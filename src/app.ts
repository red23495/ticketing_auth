import express from "express";
import { json } from "body-parser";
import config from "../config";
import userRouter from "./route/user";
import { errorHandler, currentUser, NotFoundError } from "@mrticketing/common";
import cookieSession from "cookie-session";

const app = express();

app.set("trust proxy", true);
app.use(
  cookieSession({
    signed: false,
    secure: config.httpsEnabled,
  })
);

app.use(json());
app.use(currentUser(config.jwtKey));
app.use(userRouter);

app.all("*", (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export default app;
