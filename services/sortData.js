const fs = require("fs").promises;
const path = require("path");

// List 1 is sorted by liquidity -> topupAmount -> percentProfit -> profit
// List 2 is sorted by topupAmount -> liquidity -> percentProfit -> profit
// List 3 is sorted by amount spent -> liquidity -> topupAmount -> percentProfit -> profit
// When a list is reversed, only the main sort order is reversed, other sort orders remain the same
//   e.g. List 1 reversed is sorted by reversed-liquidity -> topupAmount -> percentProfit -> profit
//   This helps ensure that items with profit are always at the top of the list

const sort1 = (a, b) => {
  let order = b.liquidity - a.liquidity;
  if (order === 0 && a.percentProfit > 5 && b.percentProfit > 5) {
    order = b.topupAmount - a.topupAmount;
  }
  if (order === 0) {
    order = b.percentProfit - a.percentProfit;
    if (order === 0) {
      order = b.profit - a.profit;
    }
  }

  return order;
};

const sort1rev = (a, b) => {
  let order = a.liquidity - b.liquidity;
  if (order === 0 && a.percentProfit > 5 && b.percentProfit > 5) {
    order = b.topupAmount - a.topupAmount;
  }
  if (order === 0) {
    order = b.percentProfit - a.percentProfit;
    if (order === 0) {
      order = b.profit - a.profit;
    }
  }

  return order;
};

const sort2 = (a, b) => {
  let order = 0;

  // If a has profit and b doesn't, a comes first
  if (a.percentProfit > 0 && b.percentProfit <= 0) {
    order = -1;
  } else if (a.percentProfit <= 0 && b.percentProfit > 0) {
    // Otherwise, if b has profit and a doesn't, b comes first
    order = 1;
  }

  // Move all low liquidity items to the bottom
  if (order === 0) {
    order = a.liquidity > 0 && b.liquidity > 0 ? 0 : b.liquidity - a.liquidity;
    // If both have profit, sort by topupAmount
    if (order === 0 && a.percentProfit > 0 && b.percentProfit > 0) {
      order = b.topupAmount - a.topupAmount;
    }
    if (order === 0) {
      // If both (have profit or don't have profit) and have same liquidity, sort by percentProfit
      order = b.percentProfit - a.percentProfit;
      if (order === 0) {
        order = b.profit - a.profit;
      }
    }
  }

  return order;
};

const sort2rev = (a, b) => {
  let order = 0;

  // If a has profit and b doesn't, a comes first
  if (a.percentProfit > 0 && b.percentProfit <= 0) {
    order = -1;
  } else if (a.percentProfit <= 0 && b.percentProfit > 0) {
    // Otherwise, if b has profit and a doesn't, b comes first
    order = 1;
  }

  // Move all low liquidity items to the bottom
  if (order === 0) {
    order = a.liquidity > 0 && b.liquidity > 0 ? 0 : b.liquidity - a.liquidity;
    // If both have profit, sort by topupAmount
    if (order === 0 && a.percentProfit > 0 && b.percentProfit > 0) {
      order = a.topupAmount - b.topupAmount;
    }
    if (order === 0) {
      // If both (have profit or don't have profit) and have same liquidity, sort by percentProfit
      order = b.percentProfit - a.percentProfit;
      if (order === 0) {
        order = b.profit - a.profit;
      }
    }
  }

  return order;
};

const sort3 = (a, b) => {
  let order = 0;

  // If a has profit and b doesn't, a comes first
  if (a.percentProfit > 0 && b.percentProfit <= 0) {
    order = -1;
  } else if (a.percentProfit <= 0 && b.percentProfit > 0) {
    // Otherwise, if b has profit and a doesn't, b comes first
    order = 1;
  }

  // Move all low liquidity items to the bottom
  if (order === 0) {
    order = a.liquidity > 0 && b.liquidity > 0 ? 0 : b.liquidity - a.liquidity;
    // If both have profit, sort by topupAmount
    if (order === 0 && a.percentProfit > 0 && b.percentProfit > 0) {
      order = b.skinportPrice - a.skinportPrice;
    }
    if (order === 0) {
      // If both (have profit or don't have profit) and have same liquidity, sort by percentProfit
      order = b.percentProfit - a.percentProfit;
      if (order === 0) {
        order = b.profit - a.profit;
      }
    }
  }

  return order;
};

const sort3rev = (a, b) => {
  let order = 0;

  // If a has profit and b doesn't, a comes first
  if (a.percentProfit > 0 && b.percentProfit <= 0) {
    order = -1;
  } else if (a.percentProfit <= 0 && b.percentProfit > 0) {
    // Otherwise, if b has profit and a doesn't, b comes first
    order = 1;
  }

  // Move all low liquidity items to the bottom
  if (order === 0) {
    order = a.liquidity > 0 && b.liquidity > 0 ? 0 : b.liquidity - a.liquidity;
    // If both have profit, sort by topupAmount
    if (order === 0 && a.percentProfit > 0 && b.percentProfit > 0) {
      order = a.skinportPrice - b.skinportPrice;
    }
    if (order === 0) {
      // If both (have profit or don't have profit) and have same liquidity, sort by percentProfit
      order = b.percentProfit - a.percentProfit;
      if (order === 0) {
        order = b.profit - a.profit;
      }
    }
  }

  return order;
};

async function sortData() {
  try {
    const data = await fs.readFile(
      path.join(__dirname, "../data/itemList.json"),
      "utf-8"
    );
    const itemList = JSON.parse(data);

    await sortAndStoreData(itemList, sort1, "sortedItemList1.json");
    await sortAndStoreData(itemList, sort2, "sortedItemList2.json");
    await sortAndStoreData(itemList, sort3, "sortedItemList3.json");
    await sortAndStoreData(itemList, sort1rev, "sortedItemList1Rev.json");
    await sortAndStoreData(itemList, sort2rev, "sortedItemList2Rev.json");
    await sortAndStoreData(itemList, sort3rev, "sortedItemList3Rev.json");
  } catch (error) {
    console.error(`Failed to sort data: ${error}`);
    throw error;
  }
}

async function sortAndStoreData(itemList, sortFunction, fileName) {
  try {
    const sortedList = itemList.sort((a, b) => sortFunction(a, b));

    for (let i = 0; i < sortedList.length; i++) {
      sortedList[i].id = i;
    }

    await fs.writeFile(
      path.join(__dirname, `../data/${fileName}`),
      JSON.stringify(sortedList),
      "utf-8"
    );
  } catch (error) {
    console.error(`Failed to sort data: ${error}`);
    throw error;
  }
}

module.exports = sortData;
