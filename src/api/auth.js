import { apiFetch } from '../utils/apiFetch';
import { storage } from '../utils/storage';

const API_BASE_URL = 'https://vibenest-backend-ogbk.onrender.com/v1';

// Login user
export async function login(credentials) {
  const res = await apiFetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(credentials),
  });

  // Save token to storage
  if (res?.data?.accessToken) {
    storage.setToken(res.data.accessToken);
  }

  return res;
}

// Register new user
export async function register(userData) {
  const res = await apiFetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    credentials: "include",
    body: userData, // browser automatically set content type as multipart/form-data
  });

  if (res?.data?.accessToken) {
    storage.setToken(res.data.accessToken);
  }

  return res;
}

// Get new access token
export async function refreshToken() {
  const res = await apiFetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });

  if (res?.data?.accessToken) {
    storage.setToken(res.data.accessToken);
  }

  return res;
}

// Logout user
export async function logout() {
  try {
    await apiFetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
  } finally {
    storage.removeToken(); // Remove token from storage
  }
}

// Get logged in user info
export async function getCurrentUser() {
  return apiFetch(`${API_BASE_URL}/auth/me`, {
    method: 'GET',
    credentials: 'include',
  });
}
