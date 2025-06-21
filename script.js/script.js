// JavaScript for Kink Compatibility Survey

const categoryContainer = document.getElementById('categoryContainer');
const kinkList = document.getElementById('kinkList');
let surveyA = null;
let surveyB = null;
let currentAction = 'Giving';
let currentCategory = null;

// Load survey A
document.getElementById('fileA').addEventListener('change', (e) => {
  const reader = new FileReader();
  reader.onload = (ev) => {
    try {
      surveyA = JSON.parse(ev.target.result);
      showCategories();
    } catch {
      alert('Invalid JSON file for Survey A.');
    }
  };
  reader.readAsText(e.target.files[0]);
});

// Load survey B
document.getElementById('fileB').addEventListener('change', (e) => {
  const reader = new FileReader();
  reader.onload = (ev) => {
    try {
      surveyB = JSON.parse(ev.target.result);
    } catch {
      alert('Invalid JSON file for Survey B.');
    }
  };
  reader.readAsText(e.target.files[0]);
});

// Start new survey
document.getElementById('newSurveyBtn').addEventListener('click', () => {
  fetch('template-survey.json?v=58')
    .then(response => {
      if (!response.ok) throw new Error('Failed to load template file.');
      return response.json();
    })
    .then(data => {
      surveyA = data;
      showCategories();
    })
    .catch(err => alert('Error loading template: ' + err.message));
});

// Show categories
function showCategories() {
  categoryContainer.innerHTML = '';
  if (!surveyA) return;
  const categories = Object.keys(surveyA);
  categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.textContent = cat;
    if (currentCategory === cat) btn.classList.add('active');
    btn.onclick = () => {
      if (currentCategory === cat) return;
      currentCategory = cat;
      showCategories();
      showKinks(cat);
    };
    categoryContainer.appendChild(btn);
  });
}

// Show kinks
function showKinks(category) {
  currentCategory = category;
  kinkList.innerHTML = '';
  if (!surveyA) return;
  const kinks = surveyA[category][currentAction];
  if (!kinks || kinks.length === 0) {
    kinkList.textContent = 'No items here.';
    return;
  }

  kinks.forEach((kink) => {
    const container = document.createElement('div');
    container.classList.add('kink-item');

    const label = document.createElement('span');
    label.textContent = kink.name + ': ';
    container.appendChild(label);

    const select = document.createElement('select');
    const emptyOption = document.createElement('option');
    emptyOption.value = '';
    emptyOption.textContent = '—';
    select.appendChild(emptyOption);

    for (let i = 1; i <= 6; i++) {
      const option = document.createElement('option');
      option.value = i;
      option.textContent = i;
      if (kink.rating == i) option.selected = true;
      select.appendChild(option);
    }

    select.addEventListener('change', () => {
      kink.rating = select.value === '' ? null : Number(select.value);
    });

    container.appendChild(select);
    kinkList.appendChild(container);
  });
}

// Tab switching
function switchTab(action) {
  currentAction = action;
  showCategories();
  if (currentCategory) showKinks(currentCategory);
  document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
  document.getElementById(`${action.toLowerCase()}Tab`).classList.add('active');
}

document.getElementById('givingTab').onclick = () => switchTab('Giving');
document.getElementById('receivingTab').onclick = () => switchTab('Receiving');
document.getElementById('neutralTab').onclick = () => switchTab('Neutral');

// Download survey
document.getElementById('downloadBtn').onclick = () => {
  if (!surveyA) {
    alert('No survey loaded.');
    return;
  }
  const blob = new Blob([JSON.stringify(surveyA, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'kink-survey.json';
  a.click();
  URL.revokeObjectURL(url);
};

// Compare surveys
document.getElementById('compareBtn').onclick = () => {
  const resultDiv = document.getElementById('comparisonResult');
  resultDiv.innerHTML = '';

  if (!surveyA || !surveyB) {
    resultDiv.textContent = 'Please upload both surveys to compare.';
    return;
  }

  const categories = Object.keys(surveyA);
  let totalScore = 0, count = 0, redFlags = [], yellowFlags = [];

  categories.forEach(cat => {
    if (!surveyB[cat]) return;
    ['Giving', 'Receiving', 'Neutral'].forEach(action => {
      const listA = surveyA[cat][action] || [];
      const listB = surveyB[cat][
        action === 'Giving' ? 'Receiving' :
        action === 'Receiving' ? 'Giving' : 'Neutral'
      ] || [];

      listA.forEach(itemA => {
        const match = listB.find(itemB => itemB.name.trim().toLowerCase() === itemA.name.trim().toLowerCase());
        if (match) {
          const a = parseInt(itemA.rating);
          const b = parseInt(match.rating);
          if (Number.isInteger(a) && Number.isInteger(b)) {
            const diff = Math.abs(a - b);
            totalScore += Math.max(0, 100 - diff * 20);
            count++;
            if ((a === 6 && b === 1) || (a === 1 && b === 6)) redFlags.push(itemA.name);
            else if ((a === 6 && b === 2) || (a === 2 && b === 6) || (a === 5 && b === 1) || (a === 1 && b === 5)) yellowFlags.push(itemA.name);
          }
        }
      });
    });
  });

  const avgScore = count ? Math.round(totalScore / count) : 0;
  resultDiv.innerHTML = `<h3>Compatibility Score: ${avgScore}%</h3>`;
  if (redFlags.length) resultDiv.innerHTML += `<p>🚩 Red flags: ${[...new Set(redFlags)].join(', ')}</p>`;
  if (yellowFlags.length) resultDiv.innerHTML += `<p>⚠️ Yellow flags: ${[...new Set(yellowFlags)].join(', ')}</p>`;
};

// Theme switching
const themeSelector = document.getElementById('themeSelector');
const outerWildsBanner = document.getElementById('outerWildsBanner');
const monsterPromBanner = document.getElementById('monsterPromBanner');
const savedTheme = localStorage.getItem('selectedTheme');

function updateBanners(theme) {
  outerWildsBanner.style.display = theme === 'theme-outer-wilds' ? 'block' : 'none';
  monsterPromBanner.style.display = theme === 'theme-monster-prom' ? 'block' : 'none';
}

if (savedTheme) {
  document.body.className = savedTheme;
  themeSelector.value = savedTheme;
  updateBanners(savedTheme);
}

themeSelector.addEventListener('change', () => {
  const selectedTheme = themeSelector.value;
  document.body.className = selectedTheme;
  localStorage.setItem('selectedTheme', selectedTheme);
  updateBanners(selectedTheme);
});

// Initialize
switchTab('Giving');
