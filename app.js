import express from "express";

import dotenv from "dotenv";

import mongoose from "mongoose";

import userRouter from "./router/user-routes";

import cors from "cors";

import otpRouter from "./router/otpRoutes";

import bookRouter from "./router/book-routes";

dotenv.config();

const app = express();

app.use(express.json());

app.use(cors());


// middle to handle the error of invalid json format
app.use((err, req, res, next) => {
  // body-parser will set this to 400 if the json is in error

  if (err.status === 400) {
    return res
      .status(err.status)
      .send({ success: false, message: "Bad Request" });
  } else {
    next();
  }
});


app.use("/api/v1/user", userRouter);

app.use("/api/v1/user", otpRouter);

app.use("/api/v1/book", bookRouter);

mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => app.listen(process.env.SERVER_PORT))
  .then(() =>
    console.log(
      "database connection successful and server listening to port " +
        process.env.SERVER_PORT
    )
  )
  .catch((err) => console.log(err));


  app.use((error, req, res, next) => {

    if (error.status === 500) {
      return res.status(500).json({success:false, message:error})
    } 

  });
