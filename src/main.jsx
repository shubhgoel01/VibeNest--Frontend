import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Layout1 from './layout/Layout1'
import Layout2 from './layout/Layout2'
import { createBrowserRouter, Route, RouterProvider, createRoutesFromElements } from 'react-router-dom'
import Home from './pages/home'
import { store } from './app/store'
import { Provider } from 'react-redux'
import Login from './pages/login'
import { Profile } from './pages/profile'
import UserProfile from './pages/UserProfile'
import SocialTabsPage from './pages/connections'
import Register from './pages/register'


const router = createBrowserRouter(
  createRoutesFromElements(
    <>
       <Route element={<Layout1 />}>
        <Route index element={<Home />} />
        <Route path="/socialtabsPage" element={<SocialTabsPage />} />
      </Route>

      <Route element={<Layout2 />}>
        <Route path="/user/:userId" element={<UserProfile />} />
        <Route path="/user/:userId/posts" element={<Profile />} />
      </Route>

      {/* Public Route (no layout) */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </>
  )
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
)