/**
 * Run once to pre-populate all 6 service pages in MongoDB.
 * Usage: node scripts/seed.js
 */
require("dotenv").config({ path: "../.env" });
const mongoose     = require("mongoose");
const ServicePage  = require("../models/ServicePage");
const seedDefaults = require("../config/seedDefaults");

const SLUGS = ["rmc", "aggregates", "earthmovers", "msand", "solid-blocks", "builders"];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");

  for (const slug of SLUGS) {
    const exists = await ServicePage.findOne({ slug });
    if (exists) {
      console.log(`⏭  ${slug} already exists — skipping`);
      continue;
    }
    await ServicePage.create({ slug, ...seedDefaults[slug] });
    console.log(`✅ Seeded: ${slug}`);
  }

  await mongoose.disconnect();
  console.log("Done.");
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});