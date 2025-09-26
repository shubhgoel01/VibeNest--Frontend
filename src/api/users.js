import { apiFetch } from '../utils/apiFetch';

// const API_BASE_URL = 'https://vibenest-backend-ogbk.onrender.com/v1';
const API_BASE_URL = 'http://localhost:5000/v1';

// Get user by username or userId
export async function getUser(identifier) {
  try {
    const res = await apiFetch(`${API_BASE_URL}/user/${encodeURIComponent(identifier)}`, {
      method: 'GET',
      credentials: 'include',
    });
    
    // Handle the response structure - backend might return an array or single object
    let userData = res.data;
    
    // If the response is an array (due to spread operator in backend), take the first element
    if (Array.isArray(userData)) {
      if (userData.length === 0) {
        throw new Error("User not found");
      }
      userData = userData[0];
    }
    
    return userData;
  } catch (error) {
    console.error("getUser API error:", error);
    throw error;
  }
}


