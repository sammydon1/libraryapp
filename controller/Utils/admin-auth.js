import Jwt from "jsonwebtoken";

import bcryptjs from "bcryptjs";

import dotenv from "dotenv";

import User from "../../model/User";

dotenv.config();

export const verifyAdmin = async (req, res, next) => {
  const header = await req.header("Authorization");

  let email;

  let decodedPassword;

  let password;

  let roleToken;

  let existingUser;

  if (!header) {
    res
      .status(404)
      .json({ success: false, message: "No token found in header" });
  } else {
    const token = await header.split(" ")[1];

    Jwt.verify(token, process.env.SECRET, async (err, userPayload) => {
      if (err) {
        res.status(404).json({ success: false, message: "invalid token" });
      }
      if (userPayload) {
        email = userPayload.email;

        password = userPayload.password;

        roleToken = userPayload.role;

        existingUser = await User.findOne({ email });

        if (!existingUser) {
          res.status(401).json({
            success: false,
            message:
              "you can't perform the operation because you are not a registered user",
          });
        } else {
          decodedPassword = bcryptjs.compareSync(
            String(password),
            String(existingUser.password)
          );

          if (
            decodedPassword &&
            roleToken === "admin" &&
            roleToken === existingUser.role
          ) {
            next();
          } else {
            res.status(401).json({
              success: false,
              message: "you are not authorized, to carry out this operation",
            });
          }
        }
      }
    });
  }
};
