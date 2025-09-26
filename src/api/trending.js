// api/trending.js
import { apiFetch } from '../utils/apiFetch';

// const API_BASE_URL = 'https://vibenest-backend-ogbk.onrender.com/v1';
const API_BASE_URL = 'http://localhost:5000/v1';

export const fetchTrending = async () => {
  const res = await apiFetch(`${API_BASE_URL}/trending`, {
    method: 'GET',
    credentials: 'include',
  });
  return res.data;
};

export const searchTrend = async (tag) => {
  const res = await apiFetch(`${API_BASE_URL}/trending/${tag}`, {
    method: 'GET',
    credentials: 'include',
  });
  return res.data;
};

export const createTrend = async (tag) => {
  const res = await apiFetch(`${API_BASE_URL}/trending`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tag }),
  });
  return res.data;
};

export const addImpression = async (trendId) => {
  const res = await apiFetch(`${API_BASE_URL}/trending/impression/${trendId}`, {
    method: 'POST',
    credentials: 'include',
  });
  return res.data;
};
