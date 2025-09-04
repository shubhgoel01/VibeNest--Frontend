import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { validation } from '../utils/validation';

const RegisterDialog = ({ visible, onClose, onSwitchToLogin }) => {
  const { registerUser, isLoading, error, clearError } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    userName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [formErrors, setFormErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    if (error) {
      clearError();
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.fullName.trim()) {
      errors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      errors.fullName = 'Full name must be at least 2 characters';
    }

    if (!formData.userName.trim()) {
      errors.userName = 'Username is required';
    } else if (!validation.isValidUsername(formData.userName)) {
      errors.userName = 'Username must be 3-20 characters, alphanumeric and underscores only';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!validation.isValidEmail(formData.email)) {
      errors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (!validation.isValidPassword(formData.password)) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const { confirmPassword, ...registerData } = formData;
      await registerUser(registerData);
      onClose();
    } catch (error) {
      // Error is handled by the hook
      console.error('Registration failed:', error);
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[var(--backGround)] rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Create Account</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-1">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                formErrors.fullName ? 'border-red-500' : 'border-gray-600'
              }`}
              placeholder="Enter your full name"
              disabled={isLoading}
            />
            {formErrors.fullName && (
              <p className="mt-1 text-sm text-red-400">{formErrors.fullName}</p>
            )}
          </div>

          <div>
            <label htmlFor="userName" className="block text-sm font-medium text-gray-300 mb-1">
              Username
            </label>
            <input
              type="text"
              id="userName"
              name="userName"
              value={formData.userName}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                formErrors.userName ? 'border-red-500' : 'border-gray-600'
              }`}
              placeholder="Choose a username"
              disabled={isLoading}
            />
            {formErrors.userName && (
              <p className="mt-1 text-sm text-red-400">{formErrors.userName}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                formErrors.email ? 'border-red-500' : 'border-gray-600'
              }`}
              placeholder="Enter your email"
              disabled={isLoading}
            />
            {formErrors.email && (
              <p className="mt-1 text-sm text-red-400">{formErrors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                formErrors.password ? 'border-red-500' : 'border-gray-600'
              }`}
              placeholder="Create a password"
              disabled={isLoading}
            />
            {formErrors.password && (
              <p className="mt-1 text-sm text-red-400">{formErrors.password}</p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                formErrors.confirmPassword ? 'border-red-500' : 'border-gray-600'
              }`}
              placeholder="Confirm your password"
              disabled={isLoading}
            />
            {formErrors.confirmPassword && (
              <p className="mt-1 text-sm text-red-400">{formErrors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400">
            Already have an account?{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-blue-500 hover:text-blue-400 font-medium"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterDialog;