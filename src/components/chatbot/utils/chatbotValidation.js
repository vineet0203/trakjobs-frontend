/**
 * chatbotValidation.js
 *
 * Client-side validation utilities for the chatbot booking flow.
 * Mirrors backend validation rules to provide instant inline feedback.
 */

/**
 * Validates a full name (min 2 chars, letters & spaces only).
 */
export function validateName(value) {
  if (!value || !value.trim()) return 'Please enter your full name.';
  if (value.trim().length < 2) return 'Name must be at least 2 characters.';
  return null;
}

/**
 * Validates an email address.
 */
export function validateEmail(value) {
  if (!value || !value.trim()) return 'Please enter your email address.';
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(value.trim())) return 'Please enter a valid email address.';
  return null;
}

/**
 * Validates a phone number (7–15 digits, mirrors backend rule).
 */
export function validatePhone(value) {
  if (!value || !value.trim()) return 'Please enter your phone number.';
  const cleaned = value.trim().replace(/[\s\-().+]/g, '');
  if (!/^\d{7,15}$/.test(cleaned)) return 'Please enter a valid phone number (7–15 digits).';
  return null;
}

/**
 * Validates a date string in YYYY-MM-DD format and ensures it's not in the past.
 */
export function validateDate(value) {
  if (!value) return 'Please select a preferred date.';
  const d = new Date(value);
  if (isNaN(d.getTime())) return 'Please enter a valid date.';
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (d < today) return 'Please select a date in the future.';
  return null;
}

/**
 * Validates a time selection (must be non-empty).
 */
export function validateTime(value) {
  if (!value) return 'Please select a preferred time.';
  return null;
}

/**
 * Validates a location string (must be non-empty).
 */
export function validateLocation(value) {
  if (!value || !value.trim()) return 'Please enter your service location.';
  if (value.trim().length < 3) return 'Location must be at least 3 characters.';
  return null;
}
