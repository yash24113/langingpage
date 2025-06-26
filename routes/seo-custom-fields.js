const express = require("express");
const router = express.Router();
const SEOCustomField = require("../models/SEOCustomField");

// Add a new custom field
router.post("/add-seo-custom-fields", async (req, res) => {
  try {
    const { name, value } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }
    const customField = new SEOCustomField({ name, value });
    await customField.save();
    res.status(201).json(customField);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// List all custom fields
router.get("/", async (req, res) => {
  try {
    const fields = await SEOCustomField.find();
    res.json(fields);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a custom field by id
router.delete("/:id", async (req, res) => {
  try {
    const field = await SEOCustomField.findByIdAndDelete(req.params.id);
    if (!field) return res.status(404).json({ message: "Custom field not found" });
    res.json({ message: "Custom field deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 