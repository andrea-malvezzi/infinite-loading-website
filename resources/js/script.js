const loadingGifElement = document.getElementById("loading-gif");
const loadingTipElement = document.getElementById("loading-tip");
const loadingTitleElement = document.getElementById("loading-title");

const baseTitle = document.title;
const baseLoadingTitle = document.getElementById("loading-title").innerHTML;
let dotCount = 0;

async function fetchTips(filePath) {
    try {
      const response = await fetch(filePath);
      if (!response.ok) {
        throw new Error(`Failed to fetch tips: ${response.status} ${response.statusText}`);
      }
      
      const text = await response.text();
      // Split the file content into different lines
      return text.split('\n').filter(line => line.trim() !== '');
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

function updateTitles() {
    if (dotCount < 3) {
        dotCount++;
    } else {
        dotCount = 1;   // Reset counter to 0 after 3 dots
    }
    document.title = baseTitle + '.'.repeat(dotCount);
    loadingTitleElement.innerHTML = baseLoadingTitle + '.'.repeat(dotCount);
}

document.addEventListener("DOMContentLoaded", async () => {
    // Update the page and the tips section titles every second (this adds the trailing dots)
    setInterval(updateTitles, 1000);

    // Fetch the loading tips from the text file
    const tips = await fetchTips("/resources/phrases.txt");
    // Display the first tip without waiting
    displayRandomTip(tips);

    // Update the displayed tip every 11 seconds (there is an extra second for the fade-in/fade-out animation)
    setInterval(() => {displayRandomTip(tips)}, 11000);
});