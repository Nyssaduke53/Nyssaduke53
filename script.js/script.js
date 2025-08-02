// Main survey logic
const categoryContainer = document.getElementById('categoryContainer');
const kinkList = document.getElementById('kinkList');
const sidebar = document.getElementById('sidebar');
const closeSidebarBtn = document.getElementById('closeSidebar');

let surveyA = null;
let surveyB = null;
let surveyTemplate = null;
let currentAction = 'Giving';
let currentCategory = null;

function loadTemplate() {
  return fetch('template-survey.json?v=62')
    .then(response => {
      if (!response.ok) throw new Error('Failed to load template file.');
      return response.json();
    })
    .then(data => {
      surveyTemplate = data;
    });
}

loadTemplate().catch(err => alert('Error loading template: ' + err.message));

function updateSurvey(survey) {
  if (!surveyTemplate) return survey;
  const updated = JSON.parse(JSON.stringify(surveyTemplate));
  Object.keys(updated).forEach(category => {
    ['Giving', 'Receiving', 'Neutral'].forEach(action => {
      const templateList = updated[category][action] || [];
      const loadedList = (survey[category] && survey[category][action]) || [];
      templateList.forEach(item => {
        const match = loadedList.find(i => i.id === item.id);
        item.rating = match && match.rating !== undefined ? match.rating : null;
      });
    });
  });
  return updated;
}

// File inputs and new survey
document.getElementById('fileA').addEventListener('change', (e) => {
  const reader = new FileReader();
  reader.onload = (ev) => {
    try {
      const parsed = JSON.parse(ev.target.result);
      const apply = () => {
        surveyA = updateSurvey(parsed);
        showCategories();
      };
      if (surveyTemplate) apply();
      else loadTemplate().then(apply).catch(() => alert('Failed to load template.'));
    } catch {
      alert('Invalid JSON file for Survey A.');
    }
  };
  reader.readAsText(e.target.files[0]);
});

document.getElementById('newSurveyBtn').addEventListener('click', () => {
  const apply = () => {
    surveyA = JSON.parse(JSON.stringify(surveyTemplate));
    showCategories();
    if (sidebar) sidebar.classList.add('open');
  };
  if (surveyTemplate) apply();
  else loadTemplate().then(apply).catch(err => alert('Error loading template: ' + err.message));
});

document.getElementById('fileB').addEventListener('change', (e) => {
  const reader = new FileReader();
  reader.onload = (ev) => {
    try {
      const parsed = JSON.parse(ev.target.result);
      const apply = () => {
        surveyB = updateSurvey(parsed);
      };
      if (surveyTemplate) apply();
      else loadTemplate().then(apply).catch(() => alert('Failed to load template.'));
    } catch {
      alert('Invalid JSON file for Survey B.');
    }
  };
  reader.readAsText(e.target.files[0]);
});

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
    container.style.marginBottom = '10px';
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

// Download and comparison logic

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
  let redFlags = [];
  let yellowFlags = [];

  categories.forEach(category => {
    if (!surveyB[category]) return;
    ['Giving', 'Receiving', 'Neutral'].forEach(action => {
      const listA = surveyA[category][action] || [];
      const listB = surveyB[category][
        action === 'Giving' ? 'Receiving' :
        action === 'Receiving' ? 'Giving' : 'Neutral'
      ] || [];

      listA.forEach(itemA => {
        const match = listB.find(itemB => itemA.id === itemB.id);
        if (match) {
          const ratingA = parseInt(itemA.rating);
          const ratingB = parseInt(match.rating);
          if (Number.isInteger(ratingA) && Number.isInteger(ratingB)) {
            const diff = Math.abs(ratingA - ratingB);
            const score = Math.max(0, 100 - diff * 20);
            totalScore += score;
            count++;
            if ((ratingA === 6 && ratingB === 1) || (ratingA === 1 && ratingB === 6)) {
              redFlags.push(itemA.name);
            } else if (
              (ratingA === 6 && ratingB === 2) || (ratingA === 2 && ratingB === 6) ||
              (ratingA === 5 && ratingB === 1) || (ratingA === 1 && ratingB === 5)
            ) {
              yellowFlags.push(itemA.name);
            }
          }
        }
      });
    });
  });

  if (count === 0 || isNaN(totalScore)) {
    resultDiv.innerHTML = `<h3>Compatibility Score: 0%</h3><p>No shared rated items to compare.</p>`;
    return;
  }

  const avgScore = Math.round(totalScore / count);
  let output = `<h3>Compatibility Score: ${avgScore}%</h3>`;

  let similarityScore = 0;
  let similarityCount = 0;

  categories.forEach(category => {
    if (!surveyB[category]) return;
    ['Giving', 'Receiving', 'Neutral'].forEach(action => {
      const listA = surveyA[category][action] || [];
      const listB = surveyB[category][action] || [];
      listA.forEach(itemA => {
        const match = listB.find(itemB => itemA.id === itemB.id);
        if (match) {
          const ratingA = parseInt(itemA.rating);
          const ratingB = parseInt(match.rating);
          if (Number.isInteger(ratingA) && Number.isInteger(ratingB)) {
            const diff = Math.abs(ratingA - ratingB);
            const score = Math.max(0, 100 - diff * 20);
            similarityScore += score;
            similarityCount++;
          }
        }
      });
    });
  });

  if (similarityCount > 0 && !isNaN(similarityScore)) {
    const avgSimScore = Math.round(similarityScore / similarityCount);
    output += `<h4>Similarity Score: ${avgSimScore}%</h4>`;
  } else {
    output += `<h4>Similarity Score: 0%</h4><p>No overlapping ratings in matching roles.</p>`;
  }

  if (redFlags.length) {
    output += `<p>🚩 Red flags: ${[...new Set(redFlags)].join(', ')}</p>`;
  }
  if (yellowFlags.length) {
    output += `<p>⚠️ Yellow flags: ${[...new Set(yellowFlags)].join(', ')}</p>`;
  }

  resultDiv.innerHTML = output;
};

// Theme switching without persistent storage
function updateBannerVisibility(theme) {
  const indigoBanner = document.getElementById('indigoBanner');
  const pinkBanner = document.getElementById('pinkBanner');
  if (indigoBanner) {
    indigoBanner.style.display = theme === 'theme-indigo' ? 'block' : 'none';
  }
  if (pinkBanner) {
    pinkBanner.style.display = theme === 'theme-pink' ? 'block' : 'none';
  }
}

// Apply the selected theme on load based on the current selector value
document.addEventListener('DOMContentLoaded', () => {
  const initialTheme = document.getElementById('themeSelector').value;
  document.body.className = initialTheme;
  updateBannerVisibility(initialTheme);
});

document.getElementById('themeSelector').addEventListener('change', () => {
  const selectedTheme = document.getElementById('themeSelector').value;
  document.body.className = selectedTheme;
  updateBannerVisibility(selectedTheme);
});

if (closeSidebarBtn) {
  closeSidebarBtn.addEventListener('click', () => {
    sidebar.classList.remove('open');
  });
}

// Initialize default view
switchTab('Giving');
