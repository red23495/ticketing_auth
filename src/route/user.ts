import express, { Request, Response } from "express";
import { body } from "express-validator";
import { validateRequest } from "../middleware/error";
import User from "../model/user";
import jwt from "jsonwebtoken";
import config from "../../config";
import BadRequestError from "../error/badRequest";
import Password from "../service/password";
import "express-async-errors";
import authRequired from "../middleware/authRequired";

const router = express.Router();

const EmailAlreadyInUseValidator = async (email: string) => {
  const user = await User.findOne({ email });
  if (user) throw Error("User with provided email already exists");
  return true;
};

router.post(
  "/api/users/signup/",
  [
    body("email")
      .isEmail()
      .withMessage("Enter a valid email")
      .custom(EmailAlreadyInUseValidator),
    body("password")
      .trim()
      .isLength({ min: 8, max: 20 })
      .withMessage("Password must be between 8 to 20 characters"),
    validateRequest,
  ],
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await User.build({ email, password }).save();
    const token = jwt.sign(
      {
        email: user.email,
        id: user.id,
      },
      config.jwtKey
    );
    req.session = { token };
    return res.status(201).send(user);
  }
);

router.post(
  "/api/users/signin/",
  [
    body("email").isEmail().withMessage("Enter a valid email"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("You must provide a password"),
    validateRequest,
  ],
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) throw new BadRequestError({ message: "Invalid Credentials" });
    if (!await Password.compare(password, user.password))
      throw new BadRequestError({ message: "Invalid Credentials" });
    const token = jwt.sign(
      {
        email: user.email,
        id: user.id,
      },
      config.jwtKey
    );
    req.session = { token };
    return res.status(200).send(user);
  }
);

router.get(
  "/api/users/current_user/",
  authRequired,
  (req: Request, res: Response) => {
    return res.send({currentUser: req.currentUser});
  }
);

router.get("/api/users/signout/", (req: Request, res: Response) => {
  req.session = null;
  res.send({});
});

export default router;
