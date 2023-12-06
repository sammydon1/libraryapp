import mongoose from "mongoose";

const Schema = mongoose.Schema;

const BookSchema = new Schema({
  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  author: {
    type: String,
    required: true,
  },

  category: {
    type: String,
    required: true,
  },

  isbn: {
    type: String,
    required: true,
  },

  image: {
    type: String,
    required: false,
  },

  ebook: {
    type: String,
    required: false,
  },
});

export default mongoose.model("Book", BookSchema);
