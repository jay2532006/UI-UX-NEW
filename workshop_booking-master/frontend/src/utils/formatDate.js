/**
 * Date formatting utilities for the workshop booking portal.
 */

/**
 * Format a date string for display: "14 Apr 2025"
 * @param {string|Date} dateInput - ISO date string or Date object
 * @returns {string} Formatted date
 */
export function formatDate(dateInput) {
  if (!dateInput) return '—';
  const date = new Date(dateInput);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Format a date string in long format: "Monday, 14 April 2025"
 * @param {string|Date} dateInput - ISO date string or Date object
 * @returns {string} Formatted long date
 */
export function formatDateLong(dateInput) {
  if (!dateInput) return '—';
  const date = new Date(dateInput);
  return date.toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Calculate days remaining until a given date.
 * @param {string|Date} dateInput - ISO date string or Date object
 * @returns {number} Days until the date (negative if in the past)
 */
export function daysUntil(dateInput) {
  if (!dateInput) return 0;
  const target = new Date(dateInput);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target - today) / (1000 * 60 * 60 * 24));
}

/**
 * Get the ISO date string for a date N days from today.
 * Useful for setting min dates on date pickers.
 * @param {number} days - Number of days from today
 * @returns {string} ISO date string (YYYY-MM-DD)
 */
export function dateFromNow(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
}
