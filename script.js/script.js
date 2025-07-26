// Theme switching logic
const themeSelector = document.getElementById('themeSelector');
const savedTheme = localStorage.getItem('selectedTheme');
const indigoBanner = document.getElementById('indigoBanner');
const pinkBanner = document.getElementById('pinkBanner');

if (savedTheme) {
  document.body.className = savedTheme;
  themeSelector.value = savedTheme;
  updateBannerVisibility(savedTheme);
}

themeSelector.addEventListener('change', () => {
  const selectedTheme = themeSelector.value;
  document.body.className = selectedTheme;
  localStorage.setItem('selectedTheme', selectedTheme);
  updateBannerVisibility(selectedTheme);
});

function updateBannerVisibility(theme) {
  if (indigoBanner) {
    indigoBanner.style.display = theme === 'theme-indigo' ? 'block' : 'none';
  }
  if (pinkBanner) {
    pinkBanner.style.display = theme === 'theme-pink' ? 'block' : 'none';
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

  // Refresh category and kink list
  if (typeof showCategories === 'function') {
    showCategories();
    if (typeof currentCategory !== 'undefined' && currentCategory) {
      showKinks(currentCategory);
    }
  }
}

document.getElementById('givingTab')?.addEventListener('click', () => switchTab('Giving'));
document.getElementById('receivingTab')?.addEventListener('click', () => switchTab('Receiving'));
document.getElementById('neutralTab')?.addEventListener('click', () => switchTab('Neutral'));

// Initialize default tab
switchTab('Giving');
