const mongoose = require("mongoose");

const SEOSchema = new mongoose.Schema(
  {
    sku: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    locationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    charset: { type: String },
    xUaCompatible: { type: String },
    viewport: { type: String },
    title: { type: String },
    description: { type: String },
    keywords: { type: String },
    robots: { type: String },
    contentLanguage: { type: String },
    googleSiteVerification: { type: String },
    msValidate: { type: String },
    themeColor: { type: String },
    mobileWebAppCapable: { type: Boolean },
    appleStatusBarStyle: { type: String },
    formatDetection: { type: String },
    ogLocale: { type: String },
    ogTitle: { type: String },
    ogDescription: { type: String },
    ogType: { type: String },
    ogUrl: { type: String },
    ogSiteName: { type: String },
    twitterCard: { type: String },
    twitterSite: { type: String },
    twitterTitle: { type: String },
    twitterDescription: { type: String },
    hreflang: { type: String },
    x_default: { type: String },
    author_name: { type: String },
    excerpt: { type: String },
    canonical_url: { type: String },
    description_html: { type: String },
    rating_value: { type: Number },
    rating_count: { type: Number },
    publishedAt: { type: Date },
    // --- Add this line for custom fields ---
    seo_custom_fields: { type: Array, default: [] }
  },
  { timestamps: true, strict: false }
);

module.exports = mongoose.model("SEO", SEOSchema);