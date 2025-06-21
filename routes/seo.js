const express = require("express");
const router = express.Router();
const SEO = require("../models/SEO");

// Create SEO
router.post("/", async (req, res) => {
  try {
    const seo = new SEO(req.body);
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

// Update SEO
router.put("/:id", async (req, res) => {
  try {
    const seo = await SEO.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
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

module.exports = router;
