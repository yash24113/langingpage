const express = require("express");
const Inquiry = require("../models/Inquiry");
const router = express.Router();

// Create or update inquiry step
router.post("/", async (req, res) => {
  const { id, name, email, phone, message, step } = req.body;
  try {
    let inquiry;
    if (id) {
      inquiry = await Inquiry.findByIdAndUpdate(
        id,
        { name, email, phone, message, step },
        { new: true }
      );
    } else {
      inquiry = await Inquiry.create({ name, email, phone, message, step });
    }
    res.json(inquiry);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all inquiries
router.get("/", async (req, res) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete inquiry
router.delete("/:id", async (req, res) => {
  try {
    await Inquiry.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Edit inquiry
router.put("/:id", async (req, res) => {
  try {
    const inquiry = await Inquiry.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(inquiry);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 