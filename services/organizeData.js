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
        const steamPrice = steamItem.price?.["7_days"]?.average || 0;

        const steamSold = steamItem.price?.["7_days"]?.sold || 0;
        acc.push({
          name: item.market_hash_name,
          classId: steamItem.classid,
          steamPrice,
          steamSold,
          skinportPrice: item.min_price,
          skinportVolume: item.quantity,
          liquidity:
            steamSold <= 20 || item.quantity < 5
              ? 0
              : steamSold < 75 || item.quantity < 25
              ? 1
              : 2,
          topupAmount: Number((steamPrice / 1.15 - 0.01).toFixed(2)),
          profit:
            item.quantity === 0
              ? 0
              : Number((steamPrice / 1.15 - 0.01 - item.min_price).toFixed(2)),

          percentProfit:
            item.quantity === 0
              ? 0
              : Number(
                  (
                    ((steamPrice / 1.15 - 0.01 - item.min_price) /
                      item.min_price) *
                    100
                  ).toFixed(2)
                ),
          market_page: item.market_page,
          iconUrl: steamItem.icon_url,
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
