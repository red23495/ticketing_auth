import { Request, Response, NextFunction, request } from "express";
import NotAuthorizedError from "../error/notAuthorized";

const authRequired = (req: Request, res: Response, next: NextFunction) => {
    if(!req.currentUser) throw new NotAuthorizedError();
    next();
}

export default authRequired;