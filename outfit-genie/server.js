require('dotenv').config();
const axios = require('axios');
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static('public'));

// Mock database of outfit items
const outfitDatabase = {
  tops: ["Graphic Tee", "Blazer", "Crop Top", "Hoodie", "Turtleneck", "Denim Jacket"],
  bottoms: ["Jeans", "Cargo Pants", "Skirt", "Shorts", "Leather Pants", "Plaid Pants"],
  shoes: ["Sneakers", "Boots", "Sandals", "Heels", "Crocs", "Loafers"],
  accessories: ["Sunglasses", "Fedora", "Scarf", "Fanny Pack", "Chain Necklace", "Bucket Hat"]
};

// Weather API integration
async function getWeather(city) {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.WEATHER_API_KEY}&units=metric`
    );
    return response.data;
  } catch (error) {
    console.error("Weather API error:", error.message);
    return null;
  }
}

// Outfit generation endpoint
app.get('/generate-outfit', async (req, res) => {
  const { mood, city } = req.query;
  let weatherType = "normal";
  
  if (city) {
    const weatherData = await getWeather(city);
    if (weatherData) {
      if (weatherData.weather[0].main === "Rain") weatherType = "rainy";
      else if (weatherData.main.temp < 10) weatherType = "cold";
      else if (weatherData.main.temp > 25) weatherType = "hot";
    }
  }

  const outfit = generateOutfit(mood, weatherType);
  res.json(outfit);
});

function generateOutfit(mood, weather) {
  // Weather adjustments
  const weatherAdjustments = {
    rainy: { shoes: ["Rain Boots", "Waterproof Sneakers"], accessories: ["Umbrella"] },
    cold: { tops: ["Puffer Jacket", "Wool Sweater"], bottoms: ["Thermal Leggings"] },
    hot: { tops: ["Tank Top", "Linen Shirt"], bottoms: ["Shorts"] }
  };

  // Mood-based outfits
  const moodOutfits = {
    adventurous: {
      top: "Leather Jacket",
      bottom: "Ripped Jeans",
      shoes: "Combat Boots",
      accessory: "Spiked Bracelet"
    },
    lazy: {
      top: "Oversized Hoodie",
      bottom: "Sweatpants",
      shoes: "Slides",
      accessory: "None (too lazy)"
    },
    fancy: {
      top: "Silk Blouse",
      bottom: "Tailored Pants",
      shoes: "Oxford Shoes",
      accessory: "Pearl Necklace"
    }
  };

  if (moodOutfits[mood]) {
    return moodOutfits[mood];
  }

  // Random generation with weather considerations
  const adjustedItems = { ...outfitDatabase, ...(weatherAdjustments[weather] || {}) };

  return {
    top: getRandomItem(adjustedItems.tops || outfitDatabase.tops),
    bottom: getRandomItem(adjustedItems.bottoms || outfitDatabase.bottoms),
    shoes: getRandomItem(adjustedItems.shoes || outfitDatabase.shoes),
    accessory: getRandomItem(adjustedItems.accessories || outfitDatabase.accessories),
    isRandom: true
  };
}

function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
