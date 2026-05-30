/**
 * Canvas rendering module
 * Handles image processing and dot portrait rendering
 */

import { getControls } from './controls.js';
import { createDemoImage } from './utils.js';

// Canvas elements
const canvas = document.getElementById('heroCanvas');
const stage = canvas.parentElement;
const ctx = canvas.getContext('2d');
const offscreen = document.createElement('canvas');
const offCtx = offscreen.getContext('2d', { willReadFrequently: true });

// State
let activeImage = null;
let lastDots = 0;

// UI elements
const dotCountEl = document.getElementById('dotCount');
const renderStatus = document.getElementById('renderStatus');

/**
 * Initialize canvas with demo image
 */
export function initCanvas() {
  activeImage = createDemoImage();
  activeImage.onload = render;
  
  // Handle window resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(render, 80);
  });
}

/**
 * Get the active image
 */
export function getActiveImage() {
  return activeImage;
}

/**
 * Set a new active image
 */
export function setActiveImage(image) {
  activeImage = image;
}

/**
 * Get the last dot count
 */
export function getLastDots() {
  return lastDots;
}

/**
 * Calculate luminance from RGB values
 */
function lum(r, g, b) {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Fit image within target dimensions (cover mode)
 */
function fitImage(img, tw, th) {
  const ir = img.width / img.height;
  const tr = tw / th;
  let dw, dh, ox, oy;
  
  if (ir > tr) {
    dh = th;
    dw = dh * ir;
    ox = (tw - dw) / 2;
    oy = 0;
  } else {
    dw = tw;
    dh = dw / ir;
    ox = 0;
    oy = (th - dh) / 2;
  }
  
  return { dw, dh, ox, oy };
}

/**
 * Resize canvas to match stage dimensions
 */
function sizeCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const rect = stage.getBoundingClientRect();
  
  canvas.width = Math.floor(rect.width * dpr);
  canvas.height = Math.floor(rect.height * dpr);
  canvas.style.width = `${rect.width}px`;
  canvas.style.height = `${rect.height}px`;
  
  offscreen.width = canvas.width;
  offscreen.height = canvas.height;
  
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(dpr, dpr);
  
  return { cw: rect.width, ch: rect.height, dpr };
}

/**
 * Main render function
 * Draws the dot portrait on canvas
 */
export function render() {
  if (!activeImage || !activeImage.complete || !activeImage.naturalWidth) {
    return;
  }
  
  const { cw, ch, dpr } = sizeCanvas();
  ctx.clearRect(0, 0, cw, ch);
  offCtx.clearRect(0, 0, offscreen.width, offscreen.height);
  
  // Draw image to offscreen canvas for pixel sampling
  const fit = fitImage(activeImage, offscreen.width, offscreen.height);
  offCtx.drawImage(activeImage, fit.ox, fit.oy, fit.dw, fit.dh);
  const data = offCtx.getImageData(0, 0, offscreen.width, offscreen.height).data;
  
  // Get control values
  const controls = getControls();
  const { gap, scale, contrast, toneColor, colorMode } = controls;
  const useSrc = colorMode === 'source';
  
  renderStatus.textContent = 'Rendering…';
  
  let count = 0;
  
  // Render dots
  for (let y = 0; y < ch; y += gap) {
    for (let x = 0; x < cw; x += gap) {
      const px = Math.floor(x * dpr);
      const py = Math.floor(y * dpr);
      const i = (py * offscreen.width + px) * 4;
      
      const r = data[i] || 0;
      const g = data[i + 1] || 0;
      const b = data[i + 2] || 0;
      const a = data[i + 3] || 0;
      
      if (a < 16) continue;
      
      const l = lum(r, g, b) / 255;
      const m = Math.min(1, Math.max(0, (1 - l - 0.5) * contrast + 0.5));
      const rad = Math.max(0, m * (gap * 0.46) * scale);
      
      if (rad < 0.28) continue;
      
      ctx.beginPath();
      ctx.arc(x + gap / 2, y + gap / 2, rad, 0, Math.PI * 2);
      ctx.fillStyle = useSrc 
        ? `rgba(${r},${g},${b},${Math.max(0.26, m).toFixed(3)})` 
        : toneColor;
      ctx.fill();
      
      count++;
    }
  }
  
  lastDots = count;
  dotCountEl.textContent = `${count.toLocaleString()} dots`;
  renderStatus.textContent = 'Ready';
}

/**
 * Export canvas rendering utilities
 */
export function renderToCanvas(targetCanvas, width, height) {
  const ec = targetCanvas.getContext('2d');
  const eo = document.createElement('canvas');
  eo.width = width;
  eo.height = height;
  const eoc = eo.getContext('2d', { willReadFrequently: true });
  
  if (!activeImage || !activeImage.complete || !activeImage.naturalWidth) {
    return null;
  }
  
  const fit = fitImage(activeImage, width, height);
  eoc.drawImage(activeImage, fit.ox, fit.oy, fit.dw, fit.dh);
  const data = eoc.getImageData(0, 0, width, height).data;
  
  const controls = getControls();
  const { gap, scale, contrast, toneColor, colorMode } = controls;
  const useSrc = colorMode === 'source';
  
  ec.clearRect(0, 0, width, height);
  
  for (let y = 0; y < height; y += gap) {
    for (let x = 0; x < width; x += gap) {
      const i = (y * width + x) * 4;
      const r = data[i] || 0;
      const g = data[i + 1] || 0;
      const b = data[i + 2] || 0;
      const a = data[i + 3] || 0;
      
      if (a < 16) continue;
      
      const l = lum(r, g, b) / 255;
      const m = Math.min(1, Math.max(0, (1 - l - 0.5) * contrast + 0.5));
      const rad = Math.max(0, m * (gap * 0.46) * scale);
      
      if (rad < 0.28) continue;
      
      ec.beginPath();
      ec.arc(x + gap / 2, y + gap / 2, rad, 0, Math.PI * 2);
      ec.fillStyle = useSrc 
        ? `rgba(${r},${g},${b},${Math.max(0.26, m).toFixed(3)})` 
        : toneColor;
      ec.fill();
    }
  }
  
  return data;
}
