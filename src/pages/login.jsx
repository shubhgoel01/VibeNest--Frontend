import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";


function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      await loginUser({ email, password });
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
      setError(error.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center content-center h-full w-full bg-[var(--backGround)]">
      <div className="hidden md:flex h-full bg-[var(--backGround)] items-center justify-center">
        <img src="/cover_image.png" alt="" className="h-[70vh]" />
      </div>

      <div className="bg-[var(--backGround)] h-full text-white flex flex-col justify-center p-6">
        <h3 className="text-2xl font-medium">Post Your Vibe.</h3>
        <h4 className="text-xs font-bold opacity-40">
          Login to connect, create
        </h4>

        <form
          className="bg-[var(--backGround)] text-white flex flex-col mt-5 p-2 md:border-none border-2 border-white"
          onSubmit={handleSubmit}
        >
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded text-red-400 text-sm">
              {error}
            </div>
          )}

          <label htmlFor="email" className="text-xs font-medium">
            Email <span className="text-red-600 text-sm">*</span>
          </label>
          <input
            type="email"
            id="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError("");
            }}
            required
            disabled={isLoading}
            className="border-gray-600 border p-2 disabled:opacity-50"
          />

          <label htmlFor="password" className="text-xs font-medium mt-4">
            Password <span className="text-red-600 text-sm">*</span>
          </label>
          <input
            type="password"
            id="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (error) setError("");
            }}
            required
            disabled={isLoading}
            className="border-gray-600 border p-2 disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={isLoading}
            className="p-2 border border-white rounded-full max-w-[100px] mt-4 hover:bg-white hover:text-black transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <button onClick={() => navigate("/register")} className="text-xs cursor-pointer text-blue-500 w-fit mt-2">
          New to VibeNest? <span className="text-red-400">Register</span>
        </button>

        <div className="mt-4">
          <h2 className="text-2xl font-medium">
            <span className="text-pink-100">V</span>
            <span className="text-pink-200">i</span>
            <span className="text-pink-300">b</span>
            <span className="text-pink-400">e</span>
            <span className="text-pink-500">N</span>
            <span className="text-pink-600">e</span>
            <span className="text-pink-700">s</span>
            <span className="text-pink-800">t</span>
          </h2>
          <p className="text-xs font-bold opacity-40">
            a cozy place for sharing vibes
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
