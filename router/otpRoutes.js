import express from "express";
import { sendOTP } from "../controller/otpController";
import { validationResult, check } from "express-validator";

const otpRouter = express.Router();

otpRouter.post(
  "/send-otp",
  [check("email", "please provide a valid email adrress").isEmail()],
  async (req, res, next) => {
    const output = validationResult(req);
    console.log(output.isEmpty());

    if (output.isEmpty()) {
      next();
    } else {
      let validationMsg;
      output.array().forEach((data) => (validationMsg = data.msg));

      res.status(200).json({ success: false, message: validationMsg });
    }
  },
  sendOTP
);

export default otpRouter;
