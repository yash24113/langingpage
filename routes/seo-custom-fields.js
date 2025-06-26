const express = require("express");
const router = express.Router();
const SEOCustomField = require("../models/SEOCustomField");

// Add a new custom field
router.post("/", async (req, res) => {
  try {
    const { name, type, dropdownSource } = req.body;
    if (!name || !type) {
      return res.status(400).json({ message: "Name and type are required" });
    }
    const customField = new SEOCustomField({
      name,
      type,
      dropdownSource: type === 'dropdown' ? dropdownSource : undefined,
    });
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