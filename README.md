# VibeNest - Social Media Application

A modern, responsive social media application built with React, featuring infinite scroll, real-time interactions, and a clean, modular architecture.

## 🚀 Features

- **Authentication System**: Secure login/logout with token persistence
- **Infinite Scroll**: Efficient post loading with intersection observer
- **Media Upload**: Support for images and videos with preview
- **Real-time Interactions**: Like, comment, and follow functionality
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Modular Architecture**: Clean separation of concerns

## 📁 Project Structure

```
src/
├── api/                    # API layer
│   ├── auth.js            # Authentication API calls
│   ├── posts.js           # Posts API calls
│   └── users.js           # Users API calls
├── cards/                  # Reusable post card components
│   ├── HomePostCard.jsx   # Post card for home feed
│   └── ProfilePostCard.jsx # Post card for profile pages
├── components/             # UI components
│   ├── CreatePost.jsx     # Create post component
│   └── ...                # Other UI components
├── dialogs/               # Modal dialogs
│   ├── LoginDialog.jsx    # Login modal
│   ├── RegisterDialog.jsx # Registration modal
│   └── SearchUserDialog.jsx # User search modal
├── hooks/                 # Custom React hooks
│   ├── useAuth.js         # Authentication hook
│   └── useInfiniteScroll.js # Infinite scroll hook
├── utils/                 # Utility functions
│   ├── storage.js         # LocalStorage utilities
│   ├── validation.js      # Form validation
│   └── debounce.js        # Debounce/throttle utilities
├── features/              # Redux slices
│   └── auth/              # Authentication state
└── pages/                 # Page components
    ├── home.jsx           # Home feed page
    ├── login.jsx          # Login page
    └── profile.jsx        # Profile page
```

## 🛠️ Key Improvements

### 1. **Fixed Login Persistence**
- Implemented proper token storage in localStorage
- Added automatic token refresh on app initialization
- Fixed logout on page refresh issue

### 2. **Search Dialog Fix**
- Search dialog now only opens when explicitly triggered
- Removed automatic opening on app load
- Added proper state management

### 3. **Complete CreatePost UI**
- Full media upload support (images/videos)
- Real-time preview with drag-and-drop
- Form validation and error handling
- Optimistic updates

### 4. **Infinite Scrolling**
- Implemented with IntersectionObserver
- Efficient pagination with proper loading states
- Prevents duplicate requests
- Smooth user experience

### 5. **Clean Architecture**
- Separated API calls into dedicated modules
- Created reusable card components
- Implemented custom hooks for state management
- Added utility functions for common operations

## 🎨 UI/UX Features

- **Modern Design**: Clean, dark theme with smooth animations
- **Responsive Layout**: Works seamlessly on all devices
- **Loading States**: Proper loading indicators throughout
- **Error Handling**: User-friendly error messages
- **Accessibility**: Keyboard navigation and screen reader support

## 🔧 Technical Stack

- **Frontend**: React 18 with Hooks
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **HTTP Client**: Fetch API with interceptors
- **Build Tool**: Vite

## 🚀 Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```

## 📝 API Endpoints

The application expects a backend API with the following endpoints:

- `POST /v1/auth/login` - User login
- `POST /v1/auth/register` - User registration
- `POST /v1/auth/refresh` - Token refresh
- `GET /v1/posts` - Get posts with pagination
- `POST /v1/posts` - Create new post
- `POST /v1/post/:id/like` - Toggle post like
- `GET /v1/users/:id` - Get user profile

## 🤝 Contributing

This project follows clean code principles and interview-worthy standards:

- Functional components with hooks
- Proper error handling
- Type safety considerations
- Performance optimizations
- Modular and reusable code

## 📄 License

This project is for educational and portfolio purposes.