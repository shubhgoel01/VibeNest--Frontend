import { apiFetch } from '../utils/apiFetch.js';

const API_BASE_URL = 'http://localhost:5000/v1';

// --- Fetch Lists ---
export async function getFollowers(userId) {
  const res = await apiFetch(`${API_BASE_URL}/user/${userId}/followers`, {
    method: "GET",
    credentials: "include",
  });
  return res.data;
}

export async function getSentRequests(userId) {
  const res = await apiFetch(`${API_BASE_URL}/user/${userId}/follow-requests/sent`, {
    method: "GET",
    credentials: "include",
  });
  return res.data;
}

export async function getReceivedRequests(userId) {
  const res = await apiFetch(`${API_BASE_URL}/user/${userId}/follow-requests/received`, {
    method: "GET",
    credentials: "include",
  });
  return res.data;
}

// --- Actions ---
export async function acceptRequest(id, userId) {
  const res = await apiFetch(`${API_BASE_URL}/user/${userId}/follow-request/${id}/accept`, {
    method: "POST",
    credentials: "include",
  });
  return res.data;
}

export async function rejectRequest(id, userId) {
  const res = await apiFetch(`${API_BASE_URL}/user/${userId}/follow-request/${id}/reject`, {
    method: "DELETE",
    credentials: "include",
  });
  return res.data;
}

export async function createRequest(id) {
  const res = await apiFetch(`${API_BASE_URL}/user/${id}/followRequest`, {
    method: "POST",
    credentials: "include",
  });
  return res.data;
}

export async function removeFollower(id, userId) {
  const res = await apiFetch(`${API_BASE_URL}/user/${userId}/follow/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  return res.data;
}

export async function removeRequest(id, userId) {
  const res = await apiFetch(`${API_BASE_URL}/user/${userId}/follow-requests/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  return res.data;
}
