import express from "express";

import { verifyAdmin } from "../controller/Utils/admin-auth";

import dotenv from "dotenv";

import Books from "../model/Books";

import { verifyUser } from "../controller/Utils/general-auth";

import {
  deleteAllBooks,
  deleteBookByFields,
  getAllBooks,
  getBookByField,
} from "../controller/book-controller";

import multer from "multer";

import { v2 as cloudinary } from "cloudinary";

dotenv.config();

const bookRouter = express.Router();

cloudinary.config({
  cloud_name: "dpgymrbdr",
  api_key: "413614379232288",
  api_secret: "RA3o6-J91ScShnHqlAiHdi2N4NA",
});

const storage = multer.diskStorage({
  filename: function (req, files, callback) {
    callback(null, Date.now() + files.originalname);
  },
  destination: function (req, files, callback) {
    callback(null, "uploads");
  },
});

// multer configuration to save files
const upload = multer({ storage: storage });

//endpoint to add book
bookRouter.post(
  "/upload",
  verifyAdmin,
  upload.fields([
    {
      name: "image",
      maxCount: 1,
    },
    {
      name: "ebook",
      maxCount: 1,
    },
  ]),
  async (req, res) => {
    const { title, description, author, category, isbn } = req.body;

    let book;

    let image = req.files.image;

    let ebook = req.files.ebook;



    if (
      !title ||
      !description ||
      !author ||
      !category ||
      !isbn ||
      !image ||
      !ebook
    ) {
      res
        .status(400)
        .json({
          status: false,
          message: "fields cant be empty! all fields are mandatory",
        });
    } else {
      try {

        const files = [...image, ...ebook];

        if (!files )
          return res.status(400).json({ message: "no files attached" });
        //map through images and create a promise array using cloudinary upload function
        let multipleFilePromise = files.map((file) =>
          cloudinary.uploader.upload(file.path)
        );

        // await all the cloudinary upload functions in promise.all
        let fileResponses = await Promise.all(multipleFilePromise);

        const imageUrl=fileResponses[0].url;

        const ebookUrl=fileResponses[1].url;
        
        book=new Books({title,description,author,category,isbn,image:imageUrl,ebook:ebookUrl})

       const result= await book.save();

        res.status(201).json({success:true,message: book });

      } catch (err) {
        res.status(500).json({success:false,
          message: "upload not successful",
        });
      }
    }
  }
);

//endpoint to get all books
bookRouter.get("/find/all", verifyUser, getAllBooks);

bookRouter.get("/find", verifyUser, getBookByField);

bookRouter.delete("/delete/all", verifyAdmin, deleteAllBooks);

bookRouter.delete("/delete", verifyAdmin, deleteBookByFields);

export default bookRouter;
