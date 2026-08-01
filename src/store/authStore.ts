import { create } from 'zustand'
import api from '@/lib/api'

interface User {
  id: number
  phone: string
  username: string
  role: string
  avatar: string | null
  language: string
  theme: string
  first_name: string
  last_name: string
  location_lat: number | null
  location_lng: number | null
}

interface AuthState {
  user: User | null
  isLoading: boolean
  setUser: (user: User | null) => void
  login: (phone: string, password: string) => Promise<User>
  register: (data: any) => Promise<User>
  logout: () => void
  loadProfile: () => Promise<void>
}

async function doLogin(phone: string, password: string): Promise<User> {
  const res = await api.post('/auth/login/', { phone, password })
  localStorage.setItem('access_token', res.data.access)
  localStorage.setItem('refresh_token', res.data.refresh)
  const profileRes = await api.get('/auth/profile/')
  return profileRes.data
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,

  setUser: (user) => set({ user }),

  login: async (phone, password) => {
    const user = await doLogin(phone, password)
    set({ user })
    return user
  },

  register: async (data) => {
    await api.post('/auth/register/', data)
    const user = await doLogin(data.phone, data.password)
    set({ user })
    return user
  },

  logout: () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    set({ user: null })
  },

  loadProfile: async () => {
    try {
      const token = localStorage.getItem('access_token')
      if (!token) {
        set({ isLoading: false })
        return
      }
      const res = await api.get('/auth/profile/')
      set({ user: res.data, isLoading: false })
    } catch {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      set({ user: null, isLoading: false })
    }
  },
}))
