// API endpoint to trigger fetching of data and updating local cache
// For testing, this functionality will be automcatically trigger every hour using a cron job later on
const express = require("express");
const router = express.Router();

const updateData = require("../services/updateData");

router.get("/update", async (req, res) => {
  try {
    await updateData();
    res.send("Data updated successfully");
  } catch (error) {
    console.error(`Failed to update data: ${error}`);
    res.status(500).send("Failed to update data");
  }
});

module.exports = router;
