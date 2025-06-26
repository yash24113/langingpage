const express = require("express");
const router = express.Router();
const SEOCustomField = require("../models/SEOCustomField");

// Add a new custom field
router.post("/", async (req, res) => {
  try {
    const { name, type, dropdownSource, defaultValue, isRequired } = req.body;

    // Validation
    if (!name || !type) {
      return res.status(400).json({ message: "Name and type are required." });
    }

    if (!["text", "number", "dropdown"].includes(type)) {
      return res.status(400).json({ message: "Invalid type. Allowed: text, number, dropdown." });
    }

    if (type === "dropdown" && !dropdownSource) {
      return res.status(400).json({ message: "Dropdown source is required for dropdown type." });
    }

    const existing = await SEOCustomField.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: "A custom field with this name already exists." });
    }

    const customField = new SEOCustomField({
      name,
      type,
      dropdownSource: type === "dropdown" ? dropdownSource : undefined,
      defaultValue,
      isRequired: isRequired === true,
    });

    await customField.save();
    res.status(201).json(customField);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// List all custom fields
router.get("/", async (req, res) => {
  try {
    const fields = await SEOCustomField.find().sort({ createdAt: -1 });
    res.json(fields);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a custom field by ID
router.delete("/:id", async (req, res) => {
  try {
    const field = await SEOCustomField.findByIdAndDelete(req.params.id);
    if (!field) {
      return res.status(404).json({ message: "Custom field not found." });
    }
    res.json({ message: "Custom field deleted successfully." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
