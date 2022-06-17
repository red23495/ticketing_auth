import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import BaseError, { SerializedError } from "../error/base";
import ValidationError from "../error/validation";

export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    next(new ValidationError("Please correct the following errors", errors));
  next();
};

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let errorMessage: SerializedError;
  if (err instanceof BaseError) errorMessage = err.serialize();
  else
    errorMessage = {
      message: "Something went wrong!",
      status: 500,
      details: [],
    };
  return res.status(errorMessage.status).send(errorMessage);
};

export default errorHandler;
