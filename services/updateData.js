const fetchPricing = require("./fetchPricing");
const organizeData = require("./organizeData");
const sortData = require("./sortData");

async function updateData() {
  try {
    await fetchPricing();
    await organizeData();
    await sortData();
  } catch (error) {
    console.error(`Failed to update data: ${error}`);
    throw error;
  }
}

module.exports = updateData;
