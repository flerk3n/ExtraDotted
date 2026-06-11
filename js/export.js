/**
 * Export module
 * Handles exporting to various formats (PNG, SVG, ASCII, CSS)
 */

import { getActiveImage, renderToCanvas } from './canvas.js';
import { getControls, getExportDimensions } from './controls.js';
import { showToast } from './utils.js';

/**
 * Initialize export button event listeners
 */
export function initExport() {
  document.getElementById('exportPng').addEventListener('click', exportPng);
  document.getElementById('topExportBtn').addEventListener('click', exportPng);
  document.getElementById('exportSvg').addEventListener('click', exportSvg);
  document.getElementById('exportAscii').addEventListener('click', exportAscii);
  document.getElementById('exportCss').addEventListener('click', exportCss);
}

/**
 * Export current canvas view as PNG (with zoom and pan)
 */
function exportPng() {
  const canvas = document.getElementById('heroCanvas');
  const stage = document.querySelector('.art-stage');
  
  if (!canvas || !stage) {
    showToast('Canvas not found');
    return;
  }
  
  const activeImage = getActiveImage();
  if (!activeImage || !activeImage.complete || !activeImage.naturalWidth) {
    showToast('Upload an image first');
    return;
  }
  
  try {
    // Create a temporary canvas to capture the transformed view
    const tempCanvas = document.createElement('canvas');
    const rect = stage.getBoundingClientRect();
    
    // Set temp canvas size to match the visible stage at 2x resolution
    tempCanvas.width = rect.width * 2;
    tempCanvas.height = rect.height * 2;
    
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.scale(2, 2);
    
    // Fill with background
    const bgColor = getComputedStyle(stage).backgroundColor || '#0a1214';
    tempCtx.fillStyle = bgColor;
    tempCtx.fillRect(0, 0, rect.width, rect.height);
    
    // Get the transform values from canvas
    const transform = canvas.style.transform || '';
    const scaleMatch = transform.match(/scale\(([\d.]+)\)/);
    const translateMatch = transform.match(/translate\(([-\d.]+)px,\s*([-\d.]+)px\)/);
    
    const scale = scaleMatch ? parseFloat(scaleMatch[1]) : 1;
    const translateX = translateMatch ? parseFloat(translateMatch[1]) : 0;
    const translateY = translateMatch ? parseFloat(translateMatch[2]) : 0;
    
    // Apply transforms and draw canvas content
    tempCtx.save();
    tempCtx.translate(rect.width / 2, rect.height / 2);
    tempCtx.translate(translateX, translateY);
    tempCtx.scale(scale, scale);
    tempCtx.translate(-canvas.width / 2, -canvas.height / 2);
    tempCtx.drawImage(canvas, 0, 0);
    tempCtx.restore();
    
    // Export as PNG
    const dataURL = tempCanvas.toDataURL('image/png');
    const a = document.createElement('a');
    const width = Math.round(rect.width * 2); // Actual export resolution
    const height = Math.round(rect.height * 2);
    a.href = dataURL;
    a.download = `extra-dotted-portrait-${width}x${height}.png`;
    a.click();
    
    // Track download
    trackDownload('PNG', `${width}x${height}`);
    
    showToast(`PNG exported at ${width}×${height}px`);
  } catch (error) {
    showToast('Export failed: ' + error.message);
  }
}

/**
 * Calculate luminance from RGB values
 */
function lum(r, g, b) {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Fit image within target dimensions (contain mode)
 */
function fitImage(img, tw, th) {
  const ir = img.width / img.height;
  const tr = tw / th;
  let dw, dh, ox, oy;
  
  if (ir > tr) {
    // Image is wider - fit to width
    dw = tw;
    dh = dw / ir;
    ox = 0;
    oy = (th - dh) / 2;
  } else {
    // Image is taller - fit to height
    dh = th;
    dw = dh * ir;
    ox = (tw - dw) / 2;
    oy = 0;
  }
  
  return { dw, dh, ox, oy };
}

/**
 * Track download event with Umami
 */
function trackDownload(format, dimensions = null) {
  if (window.umami) {
    const eventData = { format };
    if (dimensions) {
      eventData.dimensions = dimensions;
    }
    window.umami.track('download', eventData);
  }
}

/**
 * Export as SVG
 */
function exportSvg() {
  const activeImage = getActiveImage();
  if (!activeImage || !activeImage.complete || !activeImage.naturalWidth) {
    showToast('Upload an image first');
    return;
  }
  
  const { width, height } = getExportDimensions();
  const eo = document.createElement('canvas');
  eo.width = width;
  eo.height = height;
  const eoc = eo.getContext('2d', { willReadFrequently: true });
  
  const fit = fitImage(activeImage, width, height);
  eoc.drawImage(activeImage, fit.ox, fit.oy, fit.dw, fit.dh);
  const data = eoc.getImageData(0, 0, width, height).data;
  
  const controls = getControls();
  const { gap, scale, contrast, toneColor, colorMode } = controls;
  const useSrc = colorMode === 'source';
  
  let circles = '';
  
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
      
      const col = useSrc 
        ? `rgba(${r},${g},${b},${Math.max(0.26, m).toFixed(3)})` 
        : toneColor;
      circles += `<circle cx="${(x + gap / 2).toFixed(1)}" cy="${(y + gap / 2).toFixed(1)}" r="${rad.toFixed(2)}" fill="${col}"/>`;
    }
  }
  
  const svgStr = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
<!-- Generated by Extra Dotted -->
${circles}
</svg>`;
  
  const blob = new Blob([svgStr], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `extra-dotted-portrait-${width}x${height}.svg`;
  a.click();
  
  setTimeout(() => URL.revokeObjectURL(url), 3000);
  
  // Track download
  trackDownload('SVG', `${width}x${height}`);
  
  showToast(`SVG exported at ${width}×${height}px`);
}

/**
 * Export as ASCII/Unicode art
 */
function exportAscii() {
  const activeImage = getActiveImage();
  if (!activeImage || !activeImage.complete || !activeImage.naturalWidth) {
    showToast('Upload an image first');
    return;
  }
  
  const cols = 100;
  const aspect = activeImage.height / activeImage.width;
  const rows = Math.round(cols * aspect * 0.46); // chars are taller than wide
  
  const tmp = document.createElement('canvas');
  tmp.width = cols;
  tmp.height = rows;
  const tc = tmp.getContext('2d');
  tc.drawImage(activeImage, 0, 0, cols, rows);
  const data = tc.getImageData(0, 0, cols, rows).data;
  
  const chars = [' ', '·', '⠂', '░', '▒', '▓', '█'];
  let out = '';
  
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const i = (y * cols + x) * 4;
      const l = lum(data[i], data[i + 1], data[i + 2]) / 255;
      const idx = Math.floor(l * (chars.length - 1));
      out += chars[idx];
    }
    out += '\n';
  }
  
  document.getElementById('asciiOutput').textContent = out;
  document.getElementById('asciiModal').style.display = 'block';
  
  // Track download
  trackDownload('ASCII', `${cols}x${rows}`);
}

/**
 * Export as CSS snippet
 */
function exportCss() {
  const activeImage = getActiveImage();
  if (!activeImage || !activeImage.complete || !activeImage.naturalWidth) {
    showToast('Upload an image first');
    return;
  }
  
  const canvas = document.getElementById('heroCanvas');
  const stage = document.querySelector('.art-stage');
  
  if (!canvas || !stage) {
    showToast('Canvas not found');
    return;
  }
  
  const rect = stage.getBoundingClientRect();
  const canvasWidth = rect.width;
  const canvasHeight = rect.height;
  
  // Create temporary canvas to sample from
  const tmp = document.createElement('canvas');
  tmp.width = Math.floor(canvasWidth);
  tmp.height = Math.floor(canvasHeight);
  const tc = tmp.getContext('2d', { willReadFrequently: true });
  
  // Draw image to temp canvas using same fit logic
  const fit = fitImage(activeImage, tmp.width, tmp.height);
  tc.drawImage(activeImage, fit.ox, fit.oy, fit.dw, fit.dh);
  const data = tc.getImageData(0, 0, tmp.width, tmp.height).data;
  
  const controls = getControls();
  const { gap, scale, contrast, toneColor, colorMode } = controls;
  const useSrc = colorMode === 'source';
  
  const gradients = [];
  let dotCount = 0;
  
  // Generate dots using same logic as canvas rendering
  for (let y = 0; y < canvasHeight; y += gap) {
    for (let x = 0; x < canvasWidth; x += gap) {
      const px = Math.floor(x);
      const py = Math.floor(y);
      const i = (py * tmp.width + px) * 4;
      
      const r = data[i] || 0;
      const g = data[i + 1] || 0;
      const b = data[i + 2] || 0;
      const a = data[i + 3] || 0;
      
      if (a < 16) continue;
      
      const l = lum(r, g, b) / 255;
      const m = Math.min(1, Math.max(0, (1 - l - 0.5) * contrast + 0.5));
      const rad = Math.max(0, m * (gap * 0.46) * scale);
      
      if (rad < 0.28) continue;
      
      dotCount++;
      
      const col = useSrc 
        ? `rgba(${r},${g},${b},${Math.max(0.26, m).toFixed(3)})` 
        : toneColor;
      
      const posX = ((x + gap / 2) / canvasWidth * 100).toFixed(2) + '%';
      const posY = ((y + gap / 2) / canvasHeight * 100).toFixed(2) + '%';
      const radPx = rad.toFixed(2) + 'px';
      
      gradients.push(`  radial-gradient(circle ${radPx} at ${posX} ${posY}, ${col} 0%, transparent 100%)`);
    }
  }
  
  const css = `.dot-portrait {
  width: ${Math.round(canvasWidth)}px;
  height: ${Math.round(canvasHeight)}px;
  background-image:
${gradients.join(',\n')};
  background-size: ${Math.round(canvasWidth)}px ${Math.round(canvasHeight)}px;
  /* Generated by Extra Dotted */
  /* ${dotCount} dots | gap: ${gap}px | scale: ${scale} | contrast: ${contrast} */
}`;
  
  document.getElementById('cssOutput').textContent = css;
  document.getElementById('cssModal').style.display = 'block';
  
  // Track download
  trackDownload('CSS', `${Math.round(canvasWidth)}x${Math.round(canvasHeight)}`);
}
