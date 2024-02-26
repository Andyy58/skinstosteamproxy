// API endpoint to trigger fetching of data and updating local cache
// For testing, this functionality will be automcatically trigger every hour using a cron job later on

const express = require("express");
const router = express.Router();

const fetchPricing = require("../services/fetchPricing");
const organizeData = require("../services/organizeData");
const sortData = require("../services/sortData");

router.get("/get-items", async (req, res) => {
  try {
    await fetchPricing();
    res.status(200).json({ message: "Data fetched and updated" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
});

router.get("/organize", async (req, res) => {
  try {
    await organizeData();
    await sortData();
    res.status(200).json({ message: "Data organized" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
});

module.exports = router;
