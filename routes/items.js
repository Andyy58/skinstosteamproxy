const express = require("express");
const router = express.Router();

// for local file testing and possibly for caching later on
const fs = require("fs");
const path = require("path");
// --------------------------------------------

const itemsList = require("../data/sortedItemList.json");

router.get("/items", (req, res) => {
  const start = Number(req.query.start) || 0;
  const end = Number(req.query.limit) + start || 10;
  res.send(itemsList.slice(start, end));
});

module.exports = router;
