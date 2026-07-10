/**
 * chatbotApi.js
 *
 * Isolated API service for the TrakJobs chatbot.
 * ONLY calls existing public endpoints. No new backend logic.
 */

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

/**
 * Generic GET helper (no auth needed for public endpoints)
 */
async function get(path, params = {}) {
  const url = new URL(`${API_BASE}${path}`);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null) url.searchParams.set(k, v);
  });
  const res = await fetch(url.toString(), {
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  return res.json();
}

/**
 * Generic POST helper
 */
async function post(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || `HTTP ${res.status}`);
  return data;
}

/**
 * GET /api/v1/public/service-categories
 * Returns active high-level service categories.
 */
export async function fetchServiceCategories() {
  const data = await get('/api/v1/public/service-categories');
  return data?.data ?? [];
}

/**
 * GET /api/v1/service-sub-categories
 * Returns sub-categories, optionally filtered by service_category_id.
 */
export async function fetchSubCategories(serviceCategoryId) {
  const data = await get('/api/v1/service-sub-categories', {
    service_category_id: serviceCategoryId ?? undefined,
  });
  return data?.data ?? [];
}

/**
 * GET /api/v1/public/vendors
 * Returns vendors matching a service_category and service_sub_category slug.
 */
export async function fetchMatchingVendors(serviceCategory, serviceSubCategory) {
  const data = await get('/api/v1/public/vendors', {
    service_category: serviceCategory,
    service_sub_category: serviceSubCategory,
  });
  return data?.data ?? [];
}

/**
 * POST /api/v1/public/bookings
 * Submits a lead/quote request into TrakJobs.
 * Backend handles: customer creation, quote creation, vendor assignment, notifications.
 */
export async function submitPublicBooking(payload) {
  return post('/api/v1/public/bookings', payload);
}
