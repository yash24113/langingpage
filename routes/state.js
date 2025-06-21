const express = require("express");
const { body, validationResult } = require("express-validator");
const State = require("../models/State");
const Country = require("../models/Country");

const router = express.Router();

// Get all states
router.get("/", async (req, res) => {
  try {
    const states = await State.find({ isActive: true })
      .populate("country", "name code")
      .sort({ name: 1 });
    res.json(states);
  } catch (error) {
    console.error("Get states error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get states by country
router.get("/country/:countryId", async (req, res) => {
  try {
    const states = await State.find({
      country: req.params.countryId,
      isActive: true,
    }).sort({ name: 1 });
    res.json(states);
  } catch (error) {
    console.error("Get states by country error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get state by ID
router.get("/:id", async (req, res) => {
  try {
    const state = await State.findById(req.params.id).populate(
      "country",
      "name code"
    );
    if (!state) {
      return res.status(404).json({ message: "State not found" });
    }
    res.json(state);
  } catch (error) {
    console.error("Get state error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create new state
router.post(
  "/",
  [
    body("name").notEmpty().withMessage("State name is required"),
    body("code").notEmpty().withMessage("State code is required"),
    body("country").notEmpty().withMessage("Country is required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, code, country } = req.body;

      // Check if country exists
      const countryExists = await Country.findById(country);
      if (!countryExists) {
        return res.status(400).json({ message: "Country not found" });
      }

      // Check if state already exists in this country
      const existingState = await State.findOne({
        name,
        country,
        isActive: true,
      });

      if (existingState) {
        return res
          .status(400)
          .json({ message: "State already exists in this country" });
      }

      const state = new State({
        name,
        code: code.toUpperCase(),
        country,
      });

      await state.save();

      const populatedState = await State.findById(state._id).populate(
        "country",
        "name code"
      );
      res.status(201).json(populatedState);
    } catch (error) {
      console.error("Create state error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Update state
router.put(
  "/:id",
  [
    body("name").notEmpty().withMessage("State name is required"),
    body("code").notEmpty().withMessage("State code is required"),
    body("country").notEmpty().withMessage("Country is required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, code, country } = req.body;

      // Check if state exists
      const state = await State.findById(req.params.id);
      if (!state) {
        return res.status(404).json({ message: "State not found" });
      }

      // Check if country exists
      const countryExists = await Country.findById(country);
      if (!countryExists) {
        return res.status(400).json({ message: "Country not found" });
      }

      // Check if updated name conflicts with existing state in this country
      const existingState = await State.findOne({
        _id: { $ne: req.params.id },
        name,
        country,
        isActive: true,
      });

      if (existingState) {
        return res
          .status(400)
          .json({ message: "State name already exists in this country" });
      }

      state.name = name;
      state.code = code.toUpperCase();
      state.country = country;
      await state.save();

      const populatedState = await State.findById(state._id).populate(
        "country",
        "name code"
      );
      res.json(populatedState);
    } catch (error) {
      console.error("Update state error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Delete state (soft delete)
router.delete("/:id", async (req, res) => {
  try {
    const state = await State.findById(req.params.id);
    if (!state) {
      return res.status(404).json({ message: "State not found" });
    }

    state.isActive = false;
    await state.save();

    res.json({ message: "State deleted successfully" });
  } catch (error) {
    console.error("Delete state error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
