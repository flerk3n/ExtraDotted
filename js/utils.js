/**
 * Utility functions
 * Shared helper functions used across modules
 */

/**
 * Show toast notification
 */
export function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2400);
}

/**
 * Create demo image with fallback SVG
 */
export function createDemoImage() {
  const demoImage = new Image();
  demoImage.crossOrigin = 'anonymous';
  
  const svg64 = encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 840 840"><rect width="100%" height="100%" fill="#040d11"/><circle cx="420" cy="265" r="125" fill="#72d4dd"/><path d="M215 700c0-135 90-240 205-240s205 105 205 240" fill="#72d4dd"/><rect x="325" y="238" width="32" height="24" rx="12" fill="#040d11"/><rect x="483" y="238" width="32" height="24" rx="12" fill="#040d11"/><path d="M358 326c22 18 102 18 124 0" stroke="#040d11" stroke-width="15" stroke-linecap="round" fill="none"/></svg>`);
  demoImage.src = `data:image/svg+xml;charset=UTF-8,${svg64}`;
  
  return demoImage;
}
