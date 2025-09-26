import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../api/auth";
import { useDispatch } from "react-redux";

function Register() {
  const [formData, setFormData] = useState({
    fullName: "",
    userName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [media, setMedia] = useState(null); // avatar image
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMedia(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }
    if (!formData.userName.trim()) {
      newErrors.userName = "Username is required";
    } else if (formData.userName.length < 3) {
      newErrors.userName = "Username must be at least 3 characters";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  //Object.keys gives an array of keys in the object

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Prepare multipart/form-data
      const submissionData = new FormData();
      Object.keys(formData).forEach((key) => {
        submissionData.append(key, formData[key]);
      });
      if (media) {
        submissionData.append("avatar", media); // add avatar (backend expects field name 'avatar')
      }

      const data = await register(submissionData);
      navigate("/");
    } catch (error) {
      alert(error.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  // FormData is a special object used for sending form data, especially when uploading files.

  return (
    <div className="flex justify-center content-center h-full w-full bg-black">
      <div className="hidden md:flex h-full bg-black items-center justify-center">
        <img src="/cover_image.png" alt="" className="h-[70vh]" />
      </div>

      <div className="bg-black h-full text-white flex flex-col justify-center p-6">
        <h3 className="text-2xl font-medium">Join VibeNest</h3>
        <h4 className="text-xs font-bold opacity-40">
          Create your account to start sharing vibes
        </h4>

        <form
          className="bg-black text-white flex flex-col mt-5 p-2 md:border-none border-2 border-white"
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >
          {/* Full Name */}
          <label htmlFor="fullName" className="text-xs font-medium">
            Full Name <span className="text-red-600 text-sm">*</span>
          </label>
          <input
            type="text"
            name="fullName"
            id="fullName"
            placeholder="Enter your full name"
            value={formData.fullName}
            onChange={handleChange}
            required
            className={`border-gray-600 border p-2 ${
              errors.fullName ? "border-red-500" : ""
            }`}
          />
          {errors.fullName && (
            <span className="text-red-500 text-xs mt-1">{errors.fullName}</span>
          )}

          {/* Username */}
          <label htmlFor="userName" className="text-xs font-medium mt-4">
            Username <span className="text-red-600 text-sm">*</span>
          </label>
          <input
            type="text"
            name="userName"
            id="userName"
            placeholder="Choose a username"
            value={formData.userName}
            onChange={handleChange}
            required
            className={`border-gray-600 border p-2 ${
              errors.userName ? "border-red-500" : ""
            }`}
          />
          {errors.userName && (
            <span className="text-red-500 text-xs mt-1">{errors.userName}</span>
          )}

          {/* Email */}
          <label htmlFor="email" className="text-xs font-medium mt-4">
            Email <span className="text-red-600 text-sm">*</span>
          </label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
            className={`border-gray-600 border p-2 ${
              errors.email ? "border-red-500" : ""
            }`}
          />
          {errors.email && (
            <span className="text-red-500 text-xs mt-1">{errors.email}</span>
          )}

          {/* Password */}
          <label htmlFor="password" className="text-xs font-medium mt-4">
            Password <span className="text-red-600 text-sm">*</span>
          </label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Create a password"
            value={formData.password}
            onChange={handleChange}
            required
            className={`border-gray-600 border p-2 ${
              errors.password ? "border-red-500" : ""
            }`}
          />
          {errors.password && (
            <span className="text-red-500 text-xs mt-1">{errors.password}</span>
          )}

          {/* Confirm Password */}
          <label htmlFor="confirmPassword" className="text-xs font-medium mt-4">
            Confirm Password <span className="text-red-600 text-sm">*</span>
          </label>
          <input
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className={`border-gray-600 border p-2 ${
              errors.confirmPassword ? "border-red-500" : ""
            }`}
          />
          {errors.confirmPassword && (
            <span className="text-red-500 text-xs mt-1">
              {errors.confirmPassword}
            </span>
          )}

          {/* Avatar + Register button row */}
          <div className="flex items-center mt-4 gap-3">
            {/* Add Avatar Button */}
            <label className="cursor-pointer p-2 border border-white rounded-full hover:bg-white hover:text-black transition duration-300 ease-in-out">
              Add Avatar
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </label>

            {/* Register Button */}
            <input
              type="submit"
              value={loading ? "Creating..." : "Register"}
              disabled={loading}
              className="p-2 border border-white rounded-full max-w-[100px] hover:bg-white hover:text-black transition duration-300 ease-in-out disabled:opacity-50"
            />
          </div>

          {/* Show Avatar Preview */}
          {media && (
            <div className="mt-3">
              <img
                src={URL.createObjectURL(media)}
                alt="avatar preview"
                className="h-16 w-16 rounded-full object-cover border border-gray-500"
              />
            </div>
          )}
        </form>

        <button
          className="text-xs cursor-pointer text-blue-500 w-fit mt-4"
          onClick={() => navigate("/login")}
        >
          Already have an account? <span className="text-red-400">Login</span>
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

export default Register;
