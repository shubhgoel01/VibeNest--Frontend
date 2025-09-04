// Input validation functions
export const validation = {
  // Check if email is valid
  isValidEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Check if username is valid
  isValidUsername: (username) => {
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    return usernameRegex.test(username);
  },

  // Check if password is valid
  isValidPassword: (password) => {
    return password && password.length >= 6;
  },

  // Check if post content is valid
  isValidPostContent: (content) => {
    return content && content.trim().length > 0 && content.trim().length <= 1000;
  },

  // Check if image file is valid
  isValidImageFile: (file) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    return validTypes.includes(file.type) && file.size <= maxSize;
  },

  isValidVideoFile: (file) => {
    const validTypes = ['video/mp4', 'video/webm', 'video/ogg'];
    const maxSize = 50 * 1024 * 1024; // 50MB
    return validTypes.includes(file.type) && file.size <= maxSize;
  },

  // Check if file is valid
  isValidFile: (file, allowedTypes, maxSize) => {
    return allowedTypes.includes(file.type) && file.size <= maxSize;
  }
};