/**
 * Form validation utilities and password strength assessment.
 */

/**
 * Validate an email address.
 * @param {string} email
 * @returns {{ valid: boolean, message: string }}
 */
export function validateEmail(email) {
  if (!email) return { valid: false, message: 'Email is required' };
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(email)) return { valid: false, message: 'Please enter a valid email address' };
  return { valid: true, message: '' };
}

/**
 * Validate a 10-digit Indian phone number.
 * @param {string} phone
 * @returns {{ valid: boolean, message: string }}
 */
export function validatePhone(phone) {
  if (!phone) return { valid: false, message: 'Phone number is required' };
  const re = /^\d{10}$/;
  if (!re.test(phone)) return { valid: false, message: 'Phone number must be exactly 10 digits' };
  return { valid: true, message: '' };
}

/**
 * Validate a password (minimum 8 characters).
 * @param {string} password
 * @returns {{ valid: boolean, message: string }}
 */
export function validatePassword(password) {
  if (!password) return { valid: false, message: 'Password is required' };
  if (password.length < 8) return { valid: false, message: 'Password must be at least 8 characters' };
  return { valid: true, message: '' };
}

/**
 * Assess password strength.
 * @param {string} password
 * @returns {'weak' | 'fair' | 'strong'}
 */
export function getPasswordStrength(password) {
  if (!password || password.length < 6) return 'weak';

  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  if (score <= 1) return 'weak';
  if (score <= 3) return 'fair';
  return 'strong';
}

/**
 * Password strength config (label + color for UI rendering).
 */
export const PASSWORD_STRENGTH_CONFIG = {
  weak:   { label: 'Weak',   color: 'bg-red-500',    textColor: 'text-red-600' },
  fair:   { label: 'Fair',   color: 'bg-amber-500',  textColor: 'text-amber-600' },
  strong: { label: 'Strong', color: 'bg-green-500',  textColor: 'text-green-600' },
};
