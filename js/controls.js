/**
 * Controls module
 * Handles user input controls and image upload
 */

import { render, setActiveImage } from './canvas.js';

// Control elements
const imageInput = document.getElementById('imageInput');
const colorMode = document.getElementById('colorMode');
const dotGapEl = document.getElementById('dotGap');
const dotScaleEl = document.getElementById('dotScale');
const contrastEl = document.getElementById('contrast');
const toneColorEl = document.getElementById('toneColor');

// Value display elements
const dotGapVal = document.getElementById('dotGapValue');
const dotScaleVal = document.getElementById('dotScaleValue');
const contrastVal = document.getElementById('contrastValue');

/**
 * Initialize control event listeners
 */
export function initControls() {
  // Image upload
  imageInput.addEventListener('change', handleImageUpload);
  
  // Control inputs
  const controls = [dotGapEl, dotScaleEl, contrastEl, toneColorEl, colorMode];
  controls.forEach(el => el.addEventListener('input', handleControlChange));
}

/**
 * Handle image file upload
 */
function handleImageUpload(e) {
  const file = e.target.files?.[0];
  if (!file) return;
  
  const url = URL.createObjectURL(file);
  const img = new Image();
  
  img.onload = () => {
    setActiveImage(img);
    render();
    URL.revokeObjectURL(url);
    
    // Track image upload
    if (window.umami) {
      window.umami.track('image-upload', {
        fileType: file.type,
        fileSize: Math.round(file.size / 1024) + 'KB'
      });
    }
  };
  
  img.src = url;
}

/**
 * Handle control value changes
 */
function handleControlChange() {
  updateValueDisplays();
  render();
}

/**
 * Update value display labels
 */
function updateValueDisplays() {
  dotGapVal.textContent = dotGapEl.value;
  dotScaleVal.textContent = Number(dotScaleEl.value).toFixed(2);
  contrastVal.textContent = Number(contrastEl.value).toFixed(2);
}

/**
 * Get current control values
 */
export function getControls() {
  return {
    gap: Number(dotGapEl.value),
    scale: Number(dotScaleEl.value),
    contrast: Number(contrastEl.value),
    toneColor: toneColorEl.value,
    colorMode: colorMode.value
  };
}

/**
 * Get export dimensions
 */
export function getExportDimensions() {
  const width = parseInt(document.getElementById('exportWidth').value) || 1200;
  const height = parseInt(document.getElementById('exportHeight').value) || 1200;
  return { width, height };
}
