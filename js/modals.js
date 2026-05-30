/**
 * Modals module
 * Handles modal dialogs for ASCII and CSS output
 */

import { showToast } from './utils.js';

/**
 * Initialize modal event listeners
 */
export function initModals() {
  // ASCII modal
  document.getElementById('closeAsciiBtn').addEventListener('click', () => {
    document.getElementById('asciiModal').style.display = 'none';
  });
  
  document.getElementById('copyAsciiBtn').addEventListener('click', () => {
    const text = document.getElementById('asciiOutput').textContent;
    navigator.clipboard.writeText(text).then(() => {
      showToast('Copied to clipboard');
    });
  });
  
  // CSS modal
  document.getElementById('closeCssBtn').addEventListener('click', () => {
    document.getElementById('cssModal').style.display = 'none';
  });
  
  document.getElementById('copyCssBtn').addEventListener('click', () => {
    const text = document.getElementById('cssOutput').textContent;
    navigator.clipboard.writeText(text).then(() => {
      showToast('CSS copied');
    });
  });
}
