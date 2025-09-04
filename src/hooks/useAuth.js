import { useDispatch, useSelector } from "react-redux";
import { setCredentials, logout } from "../features/auth/authSlice";
import { login, register, logout as apiLogout, refreshToken } from "../api/auth";
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);

  const loginUser = async (credentials) => {
    try {
      const res = await login(credentials);
      if (res.data?.user && res.data?.accessToken) {
        dispatch(setCredentials(res.data));
      }
      return res;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const registerUser = async (userData) => {
    const res = await register(userData);
    if (res.data?.user && res.data?.accessToken) {
      dispatch(setCredentials(res.data));
    }
    return res;
  };

  const logoutUser = async () => {
    await apiLogout().catch(() => {});
    dispatch(logout());
    navigate("/login"); // redirect on logout
  };

  const refreshUser = async () => {
    try {
      const res = await refreshToken();
      if (res?.data) {
        const payload = {
          ...res.data,
          user: Array.isArray(res.data.user) ? res.data.user[0] : res.data.user,
        };
        dispatch(setCredentials(payload));
      }
      return res;
    } catch (err) {
      console.warn("Refresh failed, logging out", err?.message || err);
      dispatch(logout());
      navigate("/login");
    }
  };

  return {
    ...auth, // { user, accessToken, isLoggedIn }
    loginUser,
    registerUser,
    logoutUser,
    refreshUser,
    isLoading: false, // Add loading state if needed
    error: null, // Add error state if needed
    clearError: () => {}, // Add clear error function if needed
  };
};
