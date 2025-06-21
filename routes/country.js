const express = require("express");
const { body, validationResult } = require("express-validator");
const Country = require("../models/Country");

const router = express.Router();

// Get all countries
router.get("/", async (req, res) => {
  try {
    const countries = await Country.find({ isActive: true }).sort({ name: 1 });
    res.json(countries);
  } catch (error) {
    console.error("Get countries error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get country by ID
router.get("/:id", async (req, res) => {
  try {
    const country = await Country.findById(req.params.id);
    if (!country) {
      return res.status(404).json({ message: "Country not found" });
    }
    res.json(country);
  } catch (error) {
    console.error("Get country error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create new country
router.post(
  "/",
  [
    body("name").notEmpty().withMessage("Country name is required"),
    body("code").notEmpty().withMessage("Country code is required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, code } = req.body;

      // Check if country already exists
      const existingCountry = await Country.findOne({
        $or: [{ name }, { code: code.toUpperCase() }],
      });

      if (existingCountry) {
        return res.status(400).json({ message: "Country already exists" });
      }

      const country = new Country({
        name,
        code: code.toUpperCase(),
      });

      await country.save();
      res.status(201).json(country);
    } catch (error) {
      console.error("Create country error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Update country
router.put(
  "/:id",
  [
    body("name").notEmpty().withMessage("Country name is required"),
    body("code").notEmpty().withMessage("Country code is required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, code } = req.body;

      // Check if country exists
      const country = await Country.findById(req.params.id);
      if (!country) {
        return res.status(404).json({ message: "Country not found" });
      }

      // Check if updated name/code conflicts with existing country
      const existingCountry = await Country.findOne({
        _id: { $ne: req.params.id },
        $or: [{ name }, { code: code.toUpperCase() }],
      });

      if (existingCountry) {
        return res
          .status(400)
          .json({ message: "Country name or code already exists" });
      }

      country.name = name;
      country.code = code.toUpperCase();
      await country.save();

      res.json(country);
    } catch (error) {
      console.error("Update country error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Delete country (soft delete)
router.delete("/:id", async (req, res) => {
  try {
    const country = await Country.findById(req.params.id);
    if (!country) {
      return res.status(404).json({ message: "Country not found" });
    }

    country.isActive = false;
    await country.save();

    res.json({ message: "Country deleted successfully" });
  } catch (error) {
    console.error("Delete country error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
