import { configureStore } from '@reduxjs/toolkit'
import { authReducer } from '../features/auth/authSlice'
import { muteReducer } from '../features/video/muted'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    mute: muteReducer
  },
})