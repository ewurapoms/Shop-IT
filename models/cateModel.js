const mongoose = require("mongoose");

const cateSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
    }
  },
  { timestamps: true } 
);

module.exports = mongoose.model("Category", cateSchema);