import { loadTemplate } from './lib/survey.js';
import { Sidebar } from './components/Sidebar.js';
import { html, render } from 'https://esm.sh/htm/preact';

let state = {
  template: null,
  theme: 'dark',
};

// Boot
(async () => {
  state.template = await loadTemplate();
  initUI();
})();

function initUI() {
  const sidebarNode = document.getElementById('sidebar');
  render(html`<${Sidebar} categories=${state.template.categories} currentTheme=${state.theme} />`, sidebarNode);
  // TODO - render main content & bind rating events
}

export function switchTheme(name) {
  document.documentElement.className = `theme-${name}`;
  state.theme = name;
}
