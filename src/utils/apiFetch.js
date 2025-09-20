import { store } from "../app/store";

export async function apiFetch(url, options = {}) {
  const state = store.getState();
  const token = state.auth.accessToken;

  // Don't set Content-Type for FormData - let the browser set it with boundary
  const isFormData = options.body instanceof FormData;
  const defaultHeaders = isFormData 
    ? {} 
    : { "Content-Type": "application/json" };

  const res = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      ...defaultHeaders,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = await res.json();
  if (!res.ok) {
    console.log(data)
    throw new Error(data.message || "Something went wrong");
  }
  return data;
}
