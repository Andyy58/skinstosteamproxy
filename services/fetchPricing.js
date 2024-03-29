const axios = require("axios");
const fs = require("fs").promises;
const path = require("path");

async function fetchSteamPricing() {
  try {
    const response = await axios.get(
      "https://csgobackpack.net/api/GetItemsList/v2/"
    );

    const filePath = path.join(__dirname, "../data/steamData.json");
    await fs.mkdir(
      path.join(__dirname, "../data"),
      { recursive: true },
      (err) => {
        if (err) {
          console.error(`Failed to create directory: ${err}`);
          throw err;
        }
      }
    );
    await fs.writeFile(filePath, JSON.stringify(response.data), "utf-8");
  } catch (error) {
    console.error(`Failed to get steam data: ${error}`);
    throw error;
  }
}

async function fetchSkinportPricing() {
  try {
    const response = await axios.get(
      "https://api.skinport.com/v1/items/?tradable=true&currency=USD"
    );

    const filePath = path.join(__dirname, "../data/skinportData.json");

    await fs.writeFile(filePath, JSON.stringify(response.data), "utf-8");
  } catch (error) {
    console.error(`Failed to get skinport data: ${error}`);
    throw error;
  }
}

async function fetchPricing() {
  try {
    await fetchSteamPricing();
    await fetchSkinportPricing();
  } catch (error) {
    console.error(`Failed to fetch pricing: ${error}`);
    throw error;
  }
}

module.exports = fetchPricing;
