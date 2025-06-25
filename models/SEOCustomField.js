const mongoose = require("mongoose");

const SEOCustomFieldSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    value: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SEOCustomField", SEOCustomFieldSchema); 