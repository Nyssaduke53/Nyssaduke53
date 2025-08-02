import { html } from 'https://esm.sh/htm/preact';
import { switchTheme } from '../main.js';

export function Sidebar({ categories, currentTheme }) {
  return html`<nav>
    <h1 class="text-lg">Categories</h1>
    <ul>
      ${categories.map(cat => html`<li><button class="btn" data-cat=${cat.id}>${cat.name}</button></li>`)}
    </ul>
    <hr />
    <label>
      Theme
      <select value=${currentTheme} onInput=${e => switchTheme(e.target.value)}>
        <option value="dark">Dark</option>
        <option value="light">Light</option>
        <!-- more -->
      </select>
    </label>
  </nav>`;
}
