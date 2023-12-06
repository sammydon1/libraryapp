import otpGenerator from "otp-generator";
import OTP from "../model/otpModel";
import User from "../model/User";

export const sendOTP = async (req, res) => {
  const email = req.body.email;
  // Check if user is already present
  const checkUserPresent = await User.findOne({ email });
  // If user found with provided email
  if (checkUserPresent) {
    return res.status(409).json({
      success: false,
      message: "User is already registered, please enter another valid email",
    });
  } else if (!checkUserPresent && email) {
    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    let result = await OTP.findOne({ otp: otp });
    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
      });
      result = await OTP.findOne({ otp: otp });
    }
    const otpPayload = { email, otp };
    await OTP.create(otpPayload);
    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      otp,
    });
  } else {
    res
      .status(409)
      .json({
        success: false,
        message: "you sent a null email address to the server",
      });
  }
};
