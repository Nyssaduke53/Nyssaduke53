// Theme switching logic
const themeSelector = document.getElementById('themeSelector');
const savedTheme = localStorage.getItem('selectedTheme');

// Apply saved theme on load
if (savedTheme) {
  document.body.className = savedTheme;
  themeSelector.value = savedTheme;
  updateBannerVisibility(savedTheme);
}

// Update theme and save preference
themeSelector.addEventListener('change', () => {
  const selectedTheme = themeSelector.value;
  document.body.className = selectedTheme;
  localStorage.setItem('selectedTheme', selectedTheme);
  updateBannerVisibility(selectedTheme);
});

// Show/hide banners based on selected theme
function updateBannerVisibility(theme) {
  const outerWildsBanner = document.getElementById('outerWildsBanner');
  const monsterPromBanner = document.getElementById('monsterPromBanner');

  if (outerWildsBanner) {
    outerWildsBanner.style.display = (theme === 'theme-outer-wilds') ? 'block' : 'none';
  }

  if (monsterPromBanner) {
    monsterPromBanner.style.display = (theme === 'theme-monster-prom') ? 'block' : 'none';
  }
}

// Tab switching logic
let currentAction = 'Giving';

function switchTab(action) {
  currentAction = action;

  // Update active tab styling
  document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
  const activeTab = document.getElementById(`${action.toLowerCase()}Tab`);
  if (activeTab) activeTab.classList.add('active');

  // Refresh category/kink display
  if (typeof showCategories === 'function') {
    showCategories();
    if (typeof currentCategory !== 'undefined' && currentCategory) {
      showKinks(currentCategory);
    }
  }
}

// Add tab event listeners
document.getElementById('givingTab').addEventListener('click', () => switchTab('Giving'));
document.getElementById('receivingTab').addEventListener('click', () => switchTab('Receiving'));
document.getElementById('neutralTab').addEventListener('click', () => switchTab('Neutral'));

// Set default tab on load
switchTab('Giving');
