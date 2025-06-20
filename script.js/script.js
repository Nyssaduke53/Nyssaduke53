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
