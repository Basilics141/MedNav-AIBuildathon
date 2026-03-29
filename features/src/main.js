import './styles/custom.css';
import { initApp } from './js/app.js';

document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('app');
  if (root) initApp(root);
});
