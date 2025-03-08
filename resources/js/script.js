const loadingGifElement = document.getElementById("loading-gif");
const loadingTipElement = document.getElementById("loading-tip");
const loadingTitleElement = document.getElementById("loading-title");

let baseTitle;
let baseLoadingTitle;
let dotCount = 0;

function getUserLanguage() {
  // Get browser language (e.g., "en-US", "fr", "es-ES", "it")
  const fullLang = navigator.language || navigator.userLanguage || 'en';
  // Extract the base language code (e.g., "en", "fr", "es", "it")
  return fullLang.split('-')[0];
}

async function fetchTips(filePath) {
    try {
      const response = await fetch(filePath);
      if (!response.ok) {
        throw new Error(`Failed to fetch tips: ${response.status} ${response.statusText}`);
      }
      
      const allTips = await response.json();
      
      // Get user's language
      const userLang = getUserLanguage();
      
      // Check if user's language is supported, otherwise fall back to English
      const langToUse = allTips[userLang] ? userLang : 'en';
      
      // Get just the tips for the selected language
      const tipsForLanguage = allTips[langToUse];
      
      // Return an array containing two arrays:
      // the first containing the first 3 elements (page title, loading title and error message);
      // the second contaning the actual phrases
      return [tipsForLanguage.slice(0, 3), tipsForLanguage.slice(3)];
    } catch (error) {
      console.error('[DEV MESSAGE] ❌ Error loading tips:', error);
      // Fallback text in case there is an error while loading the file
      return ['Looks like something went wrong while <b>loading</b> the file containing the <i>neat</i> loading tips we had hand-picked just for you. Sowwy :('];
    }
}

function displayRandomTip(tips) {
  // Fade-out the previous tip
  loadingTipElement.classList.add("opacity-0");
  
  // Generate a random value used to select a random tip from the list passed to the function
  const randomIndex = Math.floor(Math.random() * tips.length);

  // Wait for fade out to complete before changing text
  setTimeout(() => {
    // Change the content of the loading tip
    loadingTipElement.innerHTML = tips[randomIndex];
    
    // Fade in
    loadingTipElement.classList.remove('opacity-0');
  }, 500); // Duration of Fade-out
}

function updateTitlesDots() {
    if (dotCount < 3) {
        dotCount++;
    } else {
        dotCount = 1;   // Reset counter to 0 after 3 dots
    }
    document.title = baseTitle + '.'.repeat(dotCount);
    loadingTitleElement.innerHTML = baseLoadingTitle + '.'.repeat(dotCount);
}

document.addEventListener("DOMContentLoaded", async () => {
    // Fetch the loading tips and the titles from the json file
    const jsonContent = await fetchTips("/resources/phrases.json");

    titles  = jsonContent[0];
    tips    = jsonContent[1];

    document.title                = titles[0];
    loadingTitleElement.innerHTML = titles[1];
    loadingTipElement.innerHTML   = titles[2];

    baseTitle         = document.title;
    baseLoadingTitle  = loadingTitleElement.innerHTML;
    // Update the page and the tips section titles every second (this adds the trailing dots)
    setInterval(updateTitlesDots, 1000);

    // Display the first tip without waiting
    displayRandomTip(tips);

    // Update the displayed tip every 11 seconds (there is an extra second for the fade-in/fade-out animation)
    setInterval(() => {displayRandomTip(tips)}, 11000);
});