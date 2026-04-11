import './styles/custom.css';
import { initApp } from './js/app.js';
import { initTopoBackground } from './js/topoBackground.js';

document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('app');
  if (root) initApp(root);
  initTopoBackground();
});
