const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config({ path: "./config.env" });

const authRoutes = require("./routes/auth");
const countryRoutes = require("./routes/country");
const stateRoutes = require("./routes/state");
const cityRoutes = require("./routes/city");
const locationRoutes = require("./routes/location");
const productRoutes = require("./routes/product");
const seoRoutes = require("./routes/seo");
const inquiryRoutes = require("./routes/inquiry");
const seoCustomFieldsRoutes = require("./routes/seo-custom-fields");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/countries", countryRoutes);
app.use("/api/states", stateRoutes);
app.use("/api/cities", cityRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/products", productRoutes);
app.use("/api/seos", seoRoutes);
app.use("/api/inquiries", inquiryRoutes);
app.use("/api/seo-custom-fields", seoCustomFieldsRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Admin Panel API is running" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
