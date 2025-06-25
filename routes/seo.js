const express = require("express");
const router = express.Router();
const SEO = require("../models/SEO");
const SEOCustomField = require("../models/SEOCustomField");

// Create SEO (dynamic fields supported)
router.post("/", async (req, res) => {
  try {
    if (req.body.customMeta && typeof req.body.customMeta !== 'object') {
      return res.status(400).json({ message: "customMeta must be an object" });
    }
    const seo = new SEO(req.body); // All fields in req.body will be saved
    await seo.save();
    res.status(201).json(seo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all SEOs
router.get("/", async (req, res) => {
  try {
    const seos = await SEO.find();
    res.json(seos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get SEO by ID
router.get("/:id", async (req, res) => {
  try {
    const seo = await SEO.findById(req.params.id);
    if (!seo) return res.status(404).json({ message: "SEO not found" });
    res.json(seo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update SEO (dynamic fields supported)
router.put("/:id", async (req, res) => {
  try {
    if (req.body.customMeta && typeof req.body.customMeta !== 'object') {
      return res.status(400).json({ message: "customMeta must be an object" });
    }
    // Remove runValidators to allow any field (not just those in schema)
    const seo = await SEO.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      // runValidators: true, // <-- Remove or comment out for dynamic fields
    });
    if (!seo) return res.status(404).json({ message: "SEO not found" });
    res.json(seo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete SEO
router.delete("/:id", async (req, res) => {
  try {
    const seo = await SEO.findByIdAndDelete(req.params.id);
    if (!seo) return res.status(404).json({ message: "SEO not found" });
    res.json({ message: "SEO deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.post("/seo-custom-fields", async (req, res) => {
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