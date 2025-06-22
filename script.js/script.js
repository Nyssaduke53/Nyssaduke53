// 🛠 script.js

const categoryContainer = document.getElementById('categoryContainer');
const kinkList = document.getElementById('kinkList');
const outerWildsBanner = document.getElementById('outerWildsBanner');
const monsterPromBanner = document.getElementById('monsterPromBanner');
const themeSelector = document.getElementById('themeSelector');

let surveyA = null;
let surveyB = null;
let currentAction = 'Giving';
let currentCategory = null;

// Load Survey A
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

// Load Survey B
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

// New Survey Template
document.getElementById('newSurveyBtn').addEventListener('click', () => {
  fetch('template-survey.json?v=58')
    .then(res => res.json())
    .then(data => {
      surveyA = data;
      showCategories();
    })
    .catch(() => alert('Error loading template.'));
});

// Show Categories
function showCategories() {
  categoryContainer.innerHTML = '';
  if (!surveyA) return;
  const categories = Object.keys(surveyA);
  categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.textContent = cat;
    if (currentCategory === cat) btn.classList.add('active');
    btn.onclick = () => {
      currentCategory = cat;
      showCategories();
      showKinks(cat);
    };
    categoryContainer.appendChild(btn);
  });
}

// Show Kinks in Current Tab
function showKinks(category) {
  kinkList.innerHTML = '';
  if (!surveyA) return;
  const kinks = surveyA[category][currentAction] || [];
  if (!kinks.length) {
    kinkList.textContent = 'No items here.';
    return;
  }

  kinks.forEach(kink => {
    const container = document.createElement('div');
    container.classList.add('kink-item');

    const label = document.createElement('span');
    label.textContent = `${kink.name}: `;

    const select = document.createElement('select');
    select.innerHTML = '<option value="">—</option>';
    for (let i = 1; i <= 6; i++) {
      const opt = document.createElement('option');
      opt.value = i;
      opt.textContent = i;
      if (kink.rating == i) opt.selected = true;
      select.appendChild(opt);
    }

    select.onchange = () => {
      kink.rating = select.value ? Number(select.value) : null;
    };

    container.append(label, select);
    kinkList.appendChild(container);
  });
}

// Tab Switching
function switchTab(action) {
  currentAction = action;
  showCategories();
  if (currentCategory) showKinks(currentCategory);
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.getElementById(`${action.toLowerCase()}Tab`).classList.add('active');
}

document.getElementById('givingTab').onclick = () => switchTab('Giving');
document.getElementById('receivingTab').onclick = () => switchTab('Receiving');
document.getElementById('neutralTab').onclick = () => switchTab('Neutral');

// Download Survey A
document.getElementById('downloadBtn').onclick = () => {
  if (!surveyA) return alert('No survey loaded.');
  const blob = new Blob([JSON.stringify(surveyA, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'kink-survey.json';
  a.click();
  URL.revokeObjectURL(url);
};

// Compare Surveys
document.getElementById('compareBtn').onclick = () => {
  const resultDiv = document.getElementById('comparisonResult');
  resultDiv.innerHTML = '';

  if (!surveyA || !surveyB) {
    resultDiv.textContent = 'Please upload both surveys to compare.';
    return;
  }

  const categories = Object.keys(surveyA);
  let totalScore = 0;
  let count = 0;
  const redFlags = [];
  const yellowFlags = [];

  categories.forEach(category => {
    if (!surveyB[category]) return;
    ['Giving', 'Receiving', 'Neutral'].forEach(action => {
      const listA = surveyA[category][action] || [];
      const listB = surveyB[category][
        action === 'Giving' ? 'Receiving' :
        action === 'Receiving' ? 'Giving' : 'Neutral'
      ] || [];

      listA.forEach(itemA => {
        const match = listB.find(itemB =>
          itemB.name.trim().toLowerCase() === itemA.name.trim().toLowerCase()
        );
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

  const avg = count ? Math.round(totalScore / count) : 0;
  resultDiv.innerHTML = `<h3>Compatibility Score: ${avg}%</h3>`;
  if (redFlags.length) resultDiv.innerHTML += `<p>🚩 Red flags: ${[...new Set(redFlags)].join(', ')}</p>`;
  if (yellowFlags.length) resultDiv.innerHTML += `<p>⚠️ Yellow flags: ${[...new Set(yellowFlags)].join(', ')}</p>`;
};

// Theme Selection
const savedTheme = localStorage.getItem('selectedTheme');
if (savedTheme) {
  document.body.className = savedTheme;
  themeSelector.value = savedTheme;
  updateBanners(savedTheme);
}

themeSelector.onchange = () => {
  const theme = themeSelector.value;
  document.body.className = theme;
  localStorage.setItem('selectedTheme', theme);
  updateBanners(theme);
};

function updateBanners(theme) {
  outerWildsBanner.style.display = theme === 'theme-outer-wilds' ? 'block' : 'none';
  monsterPromBanner.style.display = theme === 'theme-monster-prom' ? 'block' : 'none';
}

// Initialize
switchTab('Giving');
