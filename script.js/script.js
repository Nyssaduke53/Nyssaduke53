const themeSelector = document.getElementById('themeSelector');

const savedTheme = localStorage.getItem('selectedTheme');
if (savedTheme) {
  document.body.className = savedTheme;
  themeSelector.value = savedTheme;
}

themeSelector.addEventListener('change', () => {
  const selectedTheme = themeSelector.value;
  document.body.className = selectedTheme;
  localStorage.setItem('selectedTheme', selectedTheme);
});
