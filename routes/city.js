const express = require("express");
const { body, validationResult } = require("express-validator");
const City = require("../models/City");
const State = require("../models/State");
const Country = require("../models/Country");

const router = express.Router();

// Get all cities
router.get("/", async (req, res) => {
  try {
    const cities = await City.find({ isActive: true })
      .populate("state", "name code")
      .populate("country", "name code")
      .sort({ name: 1 });
    res.json(cities);
  } catch (error) {
    console.error("Get cities error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get cities by state
router.get("/state/:stateId", async (req, res) => {
  try {
    const cities = await City.find({
      state: req.params.stateId,
      isActive: true,
    }).sort({ name: 1 });
    res.json(cities);
  } catch (error) {
    console.error("Get cities by state error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get cities by country
router.get("/country/:countryId", async (req, res) => {
  try {
    const cities = await City.find({
      country: req.params.countryId,
      isActive: true,
    })
      .populate("state", "name code")
      .sort({ name: 1 });
    res.json(cities);
  } catch (error) {
    console.error("Get cities by country error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get city by ID
router.get("/:id", async (req, res) => {
  try {
    const city = await City.findById(req.params.id)
      .populate("state", "name code")
      .populate("country", "name code");
    if (!city) {
      return res.status(404).json({ message: "City not found" });
    }
    res.json(city);
  } catch (error) {
    console.error("Get city error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create new city
router.post(
  "/",
  [
    body("name").notEmpty().withMessage("City name is required"),
    body("state").notEmpty().withMessage("State is required"),
    body("country").notEmpty().withMessage("Country is required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, state, country } = req.body;

      // Check if state exists
      const stateExists = await State.findById(state);
      if (!stateExists) {
        return res.status(400).json({ message: "State not found" });
      }

      // Check if country exists
      const countryExists = await Country.findById(country);
      if (!countryExists) {
        return res.status(400).json({ message: "Country not found" });
      }

      // Check if city already exists in this state
      const existingCity = await City.findOne({
        name,
        state,
        isActive: true,
      });

      if (existingCity) {
        return res
          .status(400)
          .json({ message: "City already exists in this state" });
      }

      const city = new City({
        name,
        state,
        country,
      });

      await city.save();

      const populatedCity = await City.findById(city._id)
        .populate("state", "name code")
        .populate("country", "name code");
      res.status(201).json(populatedCity);
    } catch (error) {
      console.error("Create city error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Update city
router.put(
  "/:id",
  [
    body("name").notEmpty().withMessage("City name is required"),
    body("state").notEmpty().withMessage("State is required"),
    body("country").notEmpty().withMessage("Country is required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, state, country } = req.body;

      // Check if city exists
      const city = await City.findById(req.params.id);
      if (!city) {
        return res.status(404).json({ message: "City not found" });
      }

      // Check if state exists
      const stateExists = await State.findById(state);
      if (!stateExists) {
        return res.status(400).json({ message: "State not found" });
      }

      // Check if country exists
      const countryExists = await Country.findById(country);
      if (!countryExists) {
        return res.status(400).json({ message: "Country not found" });
      }

      // Check if updated name conflicts with existing city in this state
      const existingCity = await City.findOne({
        _id: { $ne: req.params.id },
        name,
        state,
        isActive: true,
      });

      if (existingCity) {
        return res
          .status(400)
          .json({ message: "City name already exists in this state" });
      }

      city.name = name;
      city.state = state;
      city.country = country;
      await city.save();

      const populatedCity = await City.findById(city._id)
        .populate("state", "name code")
        .populate("country", "name code");
      res.json(populatedCity);
    } catch (error) {
      console.error("Update city error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Delete city (soft delete)
router.delete("/:id", async (req, res) => {
  try {
    const city = await City.findById(req.params.id);
    if (!city) {
      return res.status(404).json({ message: "City not found" });
    }

    city.isActive = false;
    await city.save();

    res.json({ message: "City deleted successfully" });
  } catch (error) {
    console.error("Delete city error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
