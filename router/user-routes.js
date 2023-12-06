import express from "express";
import { validationResult, check } from "express-validator";
import {
  addDownloads,
  loginUser,
  recoverPassword,
  registerUser,
  resetPassword,
} from "../controller/user-controller";
import { verifyUser } from "../controller/Utils/general-auth";

const userRouter = express.Router();

userRouter.post(
  "/signup",
  [
    check("email", "please provide a valid email").isEmail(),
    check(
      "password",
      "please provide a password more than 6 characters"
    ).isLength({ min: 7 }),
  ],
  async (req, res, next) => {
    const output = validationResult(req);

    console.log(output.isEmpty());

    if (output.isEmpty()) {
      next();
    } else {
      let errosMessages = [];
      output.array().forEach((data) => errosMessages.push(data.msg));

      res.status(200).json({ message: errosMessages });
    }
  },
  registerUser
);

userRouter.post("/download/add", verifyUser, addDownloads)

//endpoint for login
userRouter.post("/signin", loginUser);

//endpoint for forgotpassword
userRouter.post("/password/forgot", recoverPassword);

//endpoint
userRouter.post(
  "/password/change/:email",
  [
    check(
      "newPass",
      "please provide a password more than 6 characters"
    ).isLength({ min: 7 }),
  ],
  async (req, res, next) => {
    const output = validationResult(req);

    if (output.isEmpty()) {
      next();
    } else {
      let errosMessages = [];
      output.array().forEach((data) => errosMessages.push(data.msg));

      res.status(200).json({ message: errosMessages });
    }
  },
  resetPassword
);

export default userRouter;
