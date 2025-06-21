const express = require("express");
const { body, validationResult } = require("express-validator");
const Location = require("../models/Location");
const Country = require("../models/Country");
const State = require("../models/State");
const City = require("../models/City");

const router = express.Router();

// Get all locations
router.get("/", async (req, res) => {
  try {
    const locations = await Location.find({ isActive: true })
      .populate("country", "name code")
      .populate("state", "name code")
      .populate("city", "name")
      .sort({ name: 1 });
    res.json(locations);
  } catch (error) {
    console.error("Get locations error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get location by ID
router.get("/:id", async (req, res) => {
  try {
    const location = await Location.findById(req.params.id)
      .populate("country", "name code")
      .populate("state", "name code")
      .populate("city", "name");
    if (!location) {
      return res.status(404).json({ message: "Location not found" });
    }
    res.json(location);
  } catch (error) {
    console.error("Get location error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create new location
router.post(
  "/",
  [
    body("name").notEmpty().withMessage("Location name is required"),
    body("slug").notEmpty().withMessage("Slug is required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, slug, country, state, city } = req.body;

      // Custom validation: At least one of country, state, or city must be provided
      if (!country && !state && !city) {
        return res.status(400).json({
          message: "At least one of country, state, or city must be specified",
        });
      }

      // Check if slug already exists
      const existingLocation = await Location.findOne({ slug });
      if (existingLocation) {
        return res.status(400).json({ message: "Slug already exists" });
      }

      // Check if country exists (only if provided)
      if (country) {
        const countryExists = await Country.findById(country);
        if (!countryExists) {
          return res.status(400).json({ message: "Country not found" });
        }
      }

      // Check if state exists (only if provided)
      if (state) {
        const stateExists = await State.findById(state);
        if (!stateExists) {
          return res.status(400).json({ message: "State not found" });
        }
      }

      // Check if city exists (only if provided)
      if (city) {
        const cityExists = await City.findById(city);
        if (!cityExists) {
          return res.status(400).json({ message: "City not found" });
        }
      }

      const location = new Location({
        name,
        slug,
        country: country || null,
        state: state || null,
        city: city || null,
      });

      await location.save();

      const populatedLocation = await Location.findById(location._id)
        .populate("country", "name code")
        .populate("state", "name code")
        .populate("city", "name");
      res.status(201).json(populatedLocation);
    } catch (error) {
      console.error("Create location error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Update location
router.put(
  "/:id",
  [
    body("name").notEmpty().withMessage("Location name is required"),
    body("slug").notEmpty().withMessage("Slug is required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, slug, country, state, city } = req.body;

      // Custom validation: At least one of country, state, or city must be provided
      if (!country && !state && !city) {
        return res.status(400).json({
          message: "At least one of country, state, or city must be specified",
        });
      }

      // Check if location exists
      const location = await Location.findById(req.params.id);
      if (!location) {
        return res.status(404).json({ message: "Location not found" });
      }

      // Check if slug already exists (excluding current location)
      const existingLocation = await Location.findOne({
        slug,
        _id: { $ne: req.params.id },
      });
      if (existingLocation) {
        return res.status(400).json({ message: "Slug already exists" });
      }

      // Check if country exists (only if provided)
      if (country) {
        const countryExists = await Country.findById(country);
        if (!countryExists) {
          return res.status(400).json({ message: "Country not found" });
        }
      }

      // Check if state exists (only if provided)
      if (state) {
        const stateExists = await State.findById(state);
        if (!stateExists) {
          return res.status(400).json({ message: "State not found" });
        }
      }

      // Check if city exists (only if provided)
      if (city) {
        const cityExists = await City.findById(city);
        if (!cityExists) {
          return res.status(400).json({ message: "City not found" });
        }
      }

      location.name = name;
      location.slug = slug;
      location.country = country || null;
      location.state = state || null;
      location.city = city || null;
      await location.save();

      const populatedLocation = await Location.findById(location._id)
        .populate("country", "name code")
        .populate("state", "name code")
        .populate("city", "name");
      res.json(populatedLocation);
    } catch (error) {
      console.error("Update location error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Delete location (soft delete)
router.delete("/:id", async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);
    if (!location) {
      return res.status(404).json({ message: "Location not found" });
    }

    location.isActive = false;
    await location.save();

    res.json({ message: "Location deleted successfully" });
  } catch (error) {
    console.error("Delete location error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
