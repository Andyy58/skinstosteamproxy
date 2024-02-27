const express = require("express");
const router = express.Router();

// For grabbing data
const fs = require("fs").promises;
const path = require("path");
const updateData = require("../services/updateData");
// --------------------------------------------

const itemsList = () => {
  try {
    JSON.parse(
      fs.readFile(path.join(__dirname, "../data/sortedItemList.json"), "utf-8")
    );
  } catch (error) {
    if (error === "ENOENT") {
      updateData();
    } else {
      console.error(`Failed to read file: ${error}`);
      throw error; // Propagate error
    }
  }
};

router.get("/items", (req, res) => {
  const start = Number(req.query.start) || 0;
  const limit = Number(req.query.limit) || 20;
  const end = start + limit;

  res.send(itemsList.slice(start, end));
});

module.exports = router;
