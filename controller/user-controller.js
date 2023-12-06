import User from "../model/User";

import OTP from "../model/otpModel";

import dotenv from "dotenv";

import Jwt from "jsonwebtoken";

import bcryptjs from "bcryptjs";

import { sendRecoveryEmail } from "./Utils/recoveryMail";

import otpGenerator from "otp-generator";

dotenv.config();

const secret = process.env.SECRET;

export const registerUser = async (req, res) => {
  
  const { email, password } = req.body;

  const otp = req.query.otp;

  const hashedPassword = bcryptjs.hashSync(String(password));

  let existingUser;

  let newUser;

  existingUser = await User.findOne({ email });

  if (existingUser) {
    res.status(409).json({
      success: false,
      message: " user already exists with the email " + email,
    });
  } else {
    // Find the most recent OTP for the email
    const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);

    if (response.length === 0 || otp !== response[0].otp) {
      return res
        .status(409)
        .json({ success: false, message: "The OTP is not valid" });
    } else {
      newUser = new User({ email, password: hashedPassword });

      try {
        await newUser.save();
      } catch (error) {
        console.log(error);
      }
    }
    res
      .status(201)
      .json({ success: true, message: "user registered successfully" });
  }
};

export const loginUser = async (req, res) => {
  let decodedPassword;

  const { email, password } = req.body;

  let existingUser;

  existingUser = await User.findOne({ email });

  if (!existingUser) {
    res.status(404).json({
      success: false,
      message: "this username doesn't exist in the database",
    });
  } else {
    decodedPassword = bcryptjs.compareSync(
      String(password),
      existingUser.password
    );

    if (decodedPassword) {
      const payload = {
        email,
        role: existingUser.role,
        password: password,
      };
      const token = Jwt.sign(payload, secret, { expiresIn: "2h" });

      res.status(200).json({ success: true, message: token });
    } else {
      res
        .status(404)
        .json({
          success:false,
          message:
            "password entered is incorrect!, enter correct password to login",
        });
    }
  }
};

export const recoverPassword = async (req, res) => {
  const email = req.body.email;

  let existingUser;

  existingUser = await User.findOne({ email });

  if (!existingUser) {
    res
      .status(404)
      .json({ success: false, message: "This user doesn't exist in database" });
  } else {
    let otp = otpGenerator.generate(7, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    const hashpassword = bcryptjs.hashSync(otp);

    existingUser.password = hashpassword;

    await existingUser.save();

    sendRecoveryEmail(email, otp);

    res.status(201).json({
      success: true,
      message: `your password has been reset to ${otp} and sent to ${email} `,
    });
  }
}

export const resetPassword = async (req, res) => {
  const { oldPass, newPass } = req.body;

  const email = req.params.email;

  let existingUser;

  let decodedPassword;

  existingUser = await User.findOne({ email });

  if (existingUser) {
    decodedPassword = await bcryptjs.compare(
      String(oldPass),
      existingUser.password
    );

    if (decodedPassword) {
      existingUser.password = bcryptjs.hashSync(String(newPass));

      await existingUser.save();

      res
        .status(201)
        .json({ success: true, message: "password changed successfully" });
    } else {
      res.status(404).json({
        success: false,
        message: "please enter your previous password to reset password",
      });
    }
  } else {
    res.status(404).json({ message: "Username entered is incorrect" });
  }
}

export const addDownloads=async(req,res)=>{

  const url= req.body;

  let email;

  const header = await req.header("Authorization");


  if (!header) {
    res
      .status(404)
      .json({ success: false, message: "No token found in header" });
  } else {
    const token = await header.split(" ")[1];

  Jwt.verify(token, process.env.SECRET, async (err, userPayload) => {
    
    if(userPayload){
   email=userPayload.email
    }
  
})

  const existingUser= await User.findOne({email});

  existingUser.downloads.push(url)

  await existingUser.save();

  res.status(200).json({success:true, message:"download added to user profile"})

}
}
