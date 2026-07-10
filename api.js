// MARCAIN Backend API Service
// Base URL - change for production
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// ==================== HELPER FUNCTIONS ====================

// Get stored auth token
const getToken = () => localStorage.getItem('marcain_token');

// Generic fetch wrapper with auth
const fetchWithAuth = async (url, options = {}) => {
  const token = getToken();
  const headers = {
    ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers
  };

  const response = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || `HTTP ${response.status}`);
  }

  return data;
};

// ==================== PUBLIC API (No Auth) ====================

/**
 * Submit membership application
 * @param {Object} formData - Form state from MembershipFormPage
 * @param {HTMLCanvasElement} signatureCanvas - Signature canvas ref
 */
export const submitMembership = async (formData, signatureCanvas) => {
  const data = new FormData();

  // Append all text fields
  const textFields = [
    'surname', 'firstName', 'otherName', 'dob', 'gender', 'maritalStatus',
    'occupation', 'employmentType', 'state', 'lga', 'phone', 'email',
    'nominatorName', 'nominatorPhone', 'declarationName', 'declarationDate'
  ];

  textFields.forEach(field => {
    if (formData[field] !== undefined && formData[field] !== null) {
      data.append(field, formData[field]);
    }
  });

  // Append booleans as strings
  data.append('agreeConstitution', formData.agreeConstitution ? 'true' : 'false');
  data.append('agreeSavings', formData.agreeSavings ? 'true' : 'false');

  // Append files
  if (formData.passportFile) {
    data.append('passportFile', formData.passportFile);
  }
  if (formData.govtIdFile) {
    data.append('govtIdFile', formData.govtIdFile);
  }

  // Convert canvas signature to base64
  if (signatureCanvas) {
    const signatureDataUrl = signatureCanvas.toDataURL('image/png');
    data.append('signatureDataUrl', signatureDataUrl);
  }

  const response = await fetch(`${API_BASE}/membership/apply`, {
    method: 'POST',
    body: data
    // Note: Do NOT set Content-Type - browser sets it with boundary for multipart
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || 'Submission failed');
  }

  return result;
};

// ==================== AUTH API ====================

/**
 * Admin login
 * @param {string} email
 * @param {string} password
 */
export const login = async (email, password) => {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Login failed');
  }

  // Store token
  localStorage.setItem('marcain_token', data.token);
  localStorage.setItem('marcain_user', JSON.stringify(data.data));

  return data;
};

/**
 * Logout - clear stored auth
 */
export const logout = () => {
  localStorage.removeItem('marcain_token');
  localStorage.removeItem('marcain_user');
};

/**
 * Get current logged-in user
 */
export const getCurrentUser = () => {
  const user = localStorage.getItem('marcain_user');
  return user ? JSON.parse(user) : null;
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  return !!getToken();
};

/**
 * Check if user has required role
 */
export const hasRole = (...roles) => {
  const user = getCurrentUser();
  return user && roles.includes(user.role);
};

// ==================== ADMIN API (Requires Auth) ====================

/**
 * Get all applications with filters
 * @param {Object} params - { status, search, page, limit }
 */
export const getApplications = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return fetchWithAuth(`/membership/applications?${query}`);
};

/**
 * Get dashboard statistics
 */
export const getStats = async () => {
  return fetchWithAuth('/membership/applications/stats');
};

/**
 * Get single application details
 * @param {string} id - Application ID
 */
export const getApplication = async (id) => {
  return fetchWithAuth(`/membership/applications/${id}`);
};

/**
 * Update application status
 * @param {string} id - Application ID
 * @param {string} status - New status
 * @param {string} note - Optional note
 */
export const updateStatus = async (id, status, note = '') => {
  return fetchWithAuth(`/membership/applications/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status, note })
  });
};

/**
 * Get current user profile from server
 */
export const getMe = async () => {
  return fetchWithAuth('/auth/me');
};

/**
 * Register new user (Admin only)
 */
export const registerUser = async (userData) => {
  return fetchWithAuth('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData)
  });
};

/**
 * Get all users (Admin only)
 */
export const getUsers = async () => {
  return fetchWithAuth('/auth/users');
};
