const fs = require("fs").promises;
const path = require("path");
const he = require("he");

async function organizeData() {
  try {
    const steamData = await fs.readFile(
      path.join(__dirname, "../data/steamData.json"),
      "utf-8"
    );
    const skinportData = await fs.readFile(
      path.join(__dirname, "../data/skinportData.json"),
      "utf-8"
    );

    const steamItems = JSON.parse(steamData).items_list;
    const skinportItems = JSON.parse(skinportData);

    const itemList = skinportItems.reduce((acc, item) => {
      const encoded =
        steamItems[
          he
            .encode(item["market_hash_name"], {
              decimal: true,
            })
            .replace(/;/g, "")
        ];

      const notEncoded = steamItems[item["market_hash_name"]];

      const steamItem = encoded || notEncoded;

      if (steamItem) {
        const steamPrice =
          steamItem.price?.["7_days"]?.average ||
          steamItem.price?.["30_days"]?.average ||
          steamItem.price?.["all_time"].average ||
          0;

        const steamSold =
          steamItem.price?.["7_days"]?.sold ||
          steamItem.price?.["30_days"]?.sold ||
          steamItem.price?.["all_time"].sold ||
          0;
        acc.push({
          name: item.market_hash_name,
          id: steamItem.classid,
          steamPrice,
          steamSold,
          skinportPrice: item.min_price,
          skinportVolume: item.quantity,
          profitWOFee:
            item.quantity === 0
              ? 0
              : Number((steamPrice - item.min_price).toFixed(2)),
          profitWFee:
            item.quantity === 0
              ? 0
              : Number((steamPrice / 1.15 - 0.01 - item.min_price).toFixed(2)),
        });
      }
      return acc;
    }, []);

    await fs.writeFile(
      path.join(__dirname, "../data/itemList.json"),
      JSON.stringify(itemList),
      "utf-8"
    );
  } catch (error) {
    console.error(`Error while organizing data: ${error}`);
    throw error;
  }
}

module.exports = organizeData;
