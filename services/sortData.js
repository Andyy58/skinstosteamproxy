const fs = require("fs").promises;
const path = require("path");

async function sortData() {
  try {
    const data = await fs.readFile(
      path.join(__dirname, "../data/itemList.json"),
      "utf-8"
    );

    const itemList = JSON.parse(data);

    const sortedList = itemList.sort((a, b) => {
      return b.profitWFee - a.profitWFee;
    });

    await fs.writeFile(
      path.join(__dirname, "../data/sortedItemList.json"),
      JSON.stringify(sortedList),
      "utf-8"
    );
  } catch (error) {
    console.error(`Failed to sort data: ${error}`);
    throw error;
  }
}

module.exports = sortData;
