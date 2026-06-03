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
const sizePresetEl = document.getElementById('sizePreset');
const exportWidthEl = document.getElementById('exportWidth');
const exportHeightEl = document.getElementById('exportHeight');

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
  
  // Size preset handler
  sizePresetEl.addEventListener('change', handlePresetChange);
  
  // Manual width/height change should set preset to "custom"
  exportWidthEl.addEventListener('input', () => {
    sizePresetEl.value = 'custom';
    updateCanvasSize();
  });
  
  exportHeightEl.addEventListener('input', () => {
    sizePresetEl.value = 'custom';
    updateCanvasSize();
  });
}

/**
 * Handle size preset changes
 */
function handlePresetChange() {
  const preset = sizePresetEl.value;
  
  if (preset === 'custom') {
    return;
  }
  
  // Parse preset value (e.g., "1080x1920" -> width: 1080, height: 1920)
  const [width, height] = preset.split('x').map(Number);
  
  if (width && height) {
    exportWidthEl.value = width;
    exportHeightEl.value = height;
    updateCanvasSize();
  }
}

/**
 * Update canvas size based on export dimensions
 */
function updateCanvasSize() {
  const canvas = document.getElementById('heroCanvas');
  const stage = document.querySelector('.art-stage');
  
  if (!canvas || !stage) return;
  
  let width = parseInt(exportWidthEl.value) || 1200;
  let height = parseInt(exportHeightEl.value) || 1200;
  
  // Enforce 4K limits
  const MAX_WIDTH = 3840;
  const MAX_HEIGHT = 2160;
  
  if (width > MAX_WIDTH) {
    width = MAX_WIDTH;
    exportWidthEl.value = MAX_WIDTH;
    showToast(`Max width is ${MAX_WIDTH}px (4K limit)`);
  }
  
  if (height > MAX_HEIGHT) {
    height = MAX_HEIGHT;
    exportHeightEl.value = MAX_HEIGHT;
    showToast(`Max height is ${MAX_HEIGHT}px (4K limit)`);
  }
  
  // Calculate aspect ratio
  const aspectRatio = width / height;
  
  // Update stage aspect ratio
  stage.style.aspectRatio = `${width} / ${height}`;
  
  // Re-render canvas with new dimensions
  render();
}

/**
 * Show toast notification
 */
function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  
  toast.textContent = message;
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
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
  const MAX_WIDTH = 3840;
  const MAX_HEIGHT = 3840;
  
  let width = parseInt(document.getElementById('exportWidth').value) || 1200;
  let height = parseInt(document.getElementById('exportHeight').value) || 1200;
  
  // Enforce 4K limits
  width = Math.min(Math.max(100, width), MAX_WIDTH);
  height = Math.min(Math.max(100, height), MAX_HEIGHT);
  
  return { width, height };
}
