import Books from "../model/Books";

import dotenv from "dotenv";

dotenv.config();

export const getAllBooks = async (req, res) => {
  const books = await Books.find();

  if (books.length > 0) {
    res.status(200).json({ status: true, message: books });
  } else {
    res
      .status(404)
      .json({ status: false, message: "no books found in database" });
  }
};

export const getBookByField = async (req, res) => {
  const { author, category, isbn, title } = req.body;

  const value = req.query;

  const books = await Books.find(value);

  if (books.length > 0) {
    res.status(200).json({ status: true, message: books });
  } else {
    res
      .status(404)
      .json({ status: false, message: "no books found in database" });
  }
};

export const deleteAllBooks = async (req, res) => {
  await Books.deleteMany();

  res
    .status(200)
    .json({ success: true, message: "all books deleted successfully" });
};

export const deleteBookByFields = async (req, res) => {
  const { author, category, isbn, title } = req.body;

  const value = req.query;

  const books = await Books.find(value);

  if (books.length > 0) {
    const status = await Books.deleteMany(value);

    if (status.deletedCount > 0) {
      res
        .status(200)
        .json({ status: true, message: "books deleted successfully" });
    } else {
      res
        .status(404)
        .json({ status: true, message: "could not perform delete operation" });
    }
  } else {
    res
      .status(404)
      .json({ status: true, message: "no books found in database" });
  }
}









