document.addEventListener('DOMContentLoaded', () => {
  const moodSelect = document.getElementById('moodSelect');
  const cityInput = document.getElementById('cityInput');
  const generateBtn = document.getElementById('generateBtn');
  const spinWheelBtn = document.getElementById('spinWheelBtn');
  const outfitDisplay = document.getElementById('outfitDisplay');
  const weatherInfo = document.getElementById('weatherInfo');

  generateBtn.addEventListener('click', generateOutfit);
  spinWheelBtn.addEventListener('click', spinWheel);

  async function generateOutfit() {
    const mood = moodSelect.value;
    const city = cityInput.value.trim();
    
    try {
      const response = await fetch(`/generate-outfit?mood=${mood}&city=${city}`);
      const outfit = await response.json();
      
      displayOutfit(outfit);
      
      if (city) {
        const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric`);
        const weatherData = await weatherResponse.json();
        weatherInfo.textContent = `Weather in ${city}: ${weatherData.weather[0].description}, ${Math.round(weatherData.main.temp)}°C`;
      } else {
        weatherInfo.textContent = '';
      }
    } catch (error) {
      outfitDisplay.innerHTML = `<p style="color: red;">Error generating outfit. Please try again.</p>`;
      console.error(error);
    }
  }

  function spinWheel() {
    moodSelect.value = 'random';
    cityInput.value = '';
    generateOutfit();
    
    // Animation for spinning effect
    outfitDisplay.innerHTML = '<p>Spinning the wheel... ✨</p>';
    setTimeout(() => {
      outfitDisplay.innerHTML = '<p>🌀🌀🌀</p>';
    }, 500);
  }

  function displayOutfit(outfit) {
    let html = `
      <h3>✨ Your Generated Outfit ✨</h3>
      <p><strong>Top:</strong> ${outfit.top}</p>
      <p><strong>Bottom:</strong> ${outfit.bottom}</p>
      <p><strong>Shoes:</strong> ${outfit.shoes}</p>
      <p><strong>Accessory:</strong> ${outfit.accessory}</p>
    `;
    
    if (outfit.isRandom) {
      html += `<p><em>Random surprise!</em> 🎉</p>`;
    }
    
    outfitDisplay.innerHTML = html;
  }
});
