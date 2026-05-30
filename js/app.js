/**
 * Extra Dotted — Dot Portrait Renderer
 * Main application entry point
 */

import { initTheme } from './theme.js';
import { initCanvas, render } from './canvas.js';
import { initControls } from './controls.js';
import { initExport } from './export.js';
import { initModals } from './modals.js';

// Initialize all modules
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initCanvas();
  initControls();
  initExport();
  initModals();
});
