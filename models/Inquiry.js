const mongoose = require("mongoose");

const inquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String },
    message: { type: String },
    step: { type: Number, default: 0 }, // 0: name, 1: email, 2: phone, 3: message
  },
  { timestamps: true }
);

module.exports = mongoose.model("Inquiry", inquirySchema); 