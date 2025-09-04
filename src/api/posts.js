// Posts API functions
import { apiFetch } from '../utils/apiFetch';

const API_BASE_URL = 'http://localhost:5000/v1';

// Get posts with pagination
export const getPosts = async (cursor) => {
  const params = new URLSearchParams();
  if (cursor?.lastCreatedAt) params.append("lastCreatedAt", cursor.lastCreatedAt);
  if (cursor?.lastPostId) params.append("lastPostId", cursor.lastPostId);
  params.append("pageLimit", 5); // Set page size

  const res = await apiFetch(`${API_BASE_URL}/posts?${params.toString()}`, {
    method: "GET",
    credentials: "include",
  });
  
  // Return posts and metadata
  return res.data;
};

// Create new post
export async function createPost(postData) {
  const formData = new FormData();
  formData.append('title', postData.title);

  if (postData.media && postData.media.length > 0) {
    postData.media.forEach((file) => formData.append('media', file));
  }

  if (postData.description) {
    formData.append('description', postData.description);
  }

  const res = await apiFetch(`${API_BASE_URL}/posts`, {
    method: 'POST',
    credentials: 'include',
    body: formData, // FormData handles multipart headers
  });
  return res.data;
}

// Like/unlike post
export async function toggleLike(postId) {
  const res = await apiFetch(`${API_BASE_URL}/post/${postId}/like`, {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify({ postId }),
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
}

// Get post comments
export async function getComments(postId, page = 1, limit = 10) {
  const res = await apiFetch(`${API_BASE_URL}/post/${postId}/comments?page=${page}&limit=${limit}`, {
    method: 'GET',
    credentials: 'include',
  });
  return res.data;
}

// Add comment to post
export async function addComment(postId, comment) {
  const res = await apiFetch(`${API_BASE_URL}/post/${postId}/comment`, {
    method: 'POST',
    credentials: 'include',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ comment }),
  });
  return res.data;
}

// Delete post
export async function deletePost(postId) {
  await apiFetch(`${API_BASE_URL}/posts/${postId}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  return true; // No response data
}

// Get posts for user profiles
export async function getPostsMerged({ userId, postId, pageLimit = 100 }) {
  const params = new URLSearchParams();
  if (userId) params.append("userId", userId);
  if (postId) params.append("postId", postId);
  params.append("pageLimit", pageLimit);

  const res = await apiFetch(`${API_BASE_URL}/posts?${params.toString()}`, {
    method: 'GET',
    credentials: 'include',
  });
  return res.data;
}
