const express = require("express");
const router = express.Router();

// For grabbing data
const fs = require("fs").promises;
const path = require("path");
const updateData = require("../services/updateData");
const { set } = require("mongoose");
// --------------------------------------------

let itemsLists = []; // Declare itemsList

const getLists = async () => {
  try {
    const dataSources = [1, 2, 3];
    let data = [];

    // Read data from files
    for (let i = 0; i < dataSources.length; i++) {
      const source = dataSources[i];
      const sourceData = await fs.readFile(
        path.join(__dirname, `../data/sortedItemList${source}.json`),
        "utf-8"
      );

      data.push(JSON.parse(sourceData));
    }
    // Read data for reversed lists
    for (let i = 0; i < dataSources.length; i++) {
      const source = dataSources[i];
      const sourceData = await fs.readFile(
        path.join(__dirname, `../data/sortedItemList${source}Rev.json`),
        "utf-8"
      );
      data.push(JSON.parse(sourceData));
    }

    return data;
  } catch (error) {
    if (error.code === "ENOENT") {
      updateData();
    } else {
      console.error(`Failed to read file: ${error}`);
      throw error; // Propagate error
    }
  }
};

// Initialize itemsList on server start
(async () => {
  try {
    itemsLists = await getLists();
  } catch (error) {
    console.error(`Failed to intialize items list: ${error}`);
  }
})();

// Update itemsList every hour
const fetchInverval = 1000 * 60 * 60; // 1 hour
setInterval(async () => {
  await updateData();
  itemsLists = await getLists();
}, fetchInverval);

const sortByVals = ["1", "2", "3"];

// Items api endpoint
router.get("/items", async (req, res) => {
  let start = Number(req.query.start) || 0;
  const limit = Number(req.query.limit) || 10;
  const reversed = req.query.reverse === "true";
  const sortBy =
    Number(sortByVals.includes(req.query.sortBy) ? req.query.sortBy : "1") || 1;

  const dataSource = reversed ? sortBy + 2 : sortBy - 1;

  const end = start + limit;

  /* console.log(req.query);
  console.log("dataSource", dataSource);
  console.log(start, end); */

  res.send({
    itemCount: itemsLists[dataSource].length,
    itemsList: itemsLists[dataSource].slice(start, end),
  });
});

module.exports = router;
