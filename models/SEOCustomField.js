const mongoose = require("mongoose");

const SEOCustomFieldSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    type: {
      type: String,
      enum: ["text", "number", "dropdown"],
      default: "text",
      required: true,
    },
    dropdownSource: {
      type: String, // e.g., "Country", "State"
      required: function () {
        return this.type === "dropdown";
      },
    },
    defaultValue: {
      type: mongoose.Schema.Types.Mixed, // Optional default value
    },
    isRequired: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SEOCustomField", SEOCustomFieldSchema);
