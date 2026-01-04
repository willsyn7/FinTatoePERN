import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../index'

interface UserProfile {
  id: string
  email: string
  name?: string
  avatar?: string
  createdAt?: string
  updatedAt?: string
}

interface UserState {
  profile: UserProfile | null
  isLoading: boolean
  error: string | null
}

const initialState: UserState = {
  profile: null,
  isLoading: false,
  error: null,
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserProfile: (state, action: PayloadAction<UserProfile>) => {
      state.profile = action.payload
      state.error = null
    },
    updateUserProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload }
      }
    },
    clearUserProfile: (state) => {
      state.profile = null
    },
    setUserLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setUserError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
  },
})

export const {
  setUserProfile,
  updateUserProfile,
  clearUserProfile,
  setUserLoading,
  setUserError,
} = userSlice.actions

export const selectUserProfile = (state: RootState) => state.user.profile
export const selectUserLoading = (state: RootState) => state.user.isLoading
export const selectUserError = (state: RootState) => state.user.error

export default userSlice.reducer
