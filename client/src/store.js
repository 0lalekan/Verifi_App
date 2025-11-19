import { create } from 'zustand'
import api from './api';

const useAuthStore = create((set, get) => ({
  userInfo: localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null,

  setCredentials: (data) => {
    set({ userInfo: data })
    localStorage.setItem('userInfo', JSON.stringify(data))
  },

  refreshUserProfile: async () => {
    try {
      const response = await api.get('/users/profile')
      if (response.data) {
        get().setCredentials(response.data)
      }
    } catch (error) {
      console.error('Failed to refresh user profile:', error)
      // If refresh fails but we have stored data, keep it
    }
  },

  logout: () => {
    localStorage.removeItem('userInfo')
    set({ userInfo: null })
  }
}))

export default useAuthStore
