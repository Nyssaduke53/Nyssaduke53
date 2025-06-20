const themeSelector = document.getElementById('themeSelector');

const savedTheme = localStorage.getItem('selectedTheme');
if (savedTheme) {
  document.body.className = savedTheme;
  themeSelector.value = savedTheme;
}
const banner = document.getElementById('outerWildsBanner');

// Show banner if Outer Wilds is saved
if (savedTheme === 'theme-outer-wilds') {
  banner.style.display = 'block';
} else {
  banner.style.display = 'none';
}

// Update theme and banner when user changes selection
themeSelector.addEventListener('change', () => {
  const selectedTheme = themeSelector.value;
  document.body.className = selectedTheme;
  localStorage.setItem('selectedTheme', selectedTheme);

  if (selectedTheme === 'theme-outer-wilds') {
    banner.style.display = 'block';
  } else {
    banner.style.display = 'none';
  }
});

themeSelector.addEventListener('change', () => {
  const selectedTheme = themeSelector.value;
  document.body.className = selectedTheme;
  localStorage.setItem('selectedTheme', selectedTheme);
});
