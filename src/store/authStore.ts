import { create } from 'zustand'
import api, { setAccessToken } from '@/lib/api'

interface User {
  id: string
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

function saveCache(user: User) {
  try { localStorage.setItem('user_cache', JSON.stringify(user)) } catch {}
}

function readCache(): User | null {
  try {
    const raw = localStorage.getItem('user_cache')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function clearCache() {
  try { localStorage.removeItem('user_cache') } catch {}
}

async function doLogin(phone: string, password: string): Promise<User> {
  const res = await api.post('/auth/login/', { phone, password })
  setAccessToken(res.data?.access || null)
  const profileRes = await api.get('/auth/profile/')
  saveCache(profileRes.data)
  return profileRes.data
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,

  setUser: (user) => {
    if (user) saveCache(user)
    set({ user })
  },

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
    api.post('/auth/logout/').catch(() => {})
    setAccessToken(null)
    clearCache()
    set({ user: null })
  },

  loadProfile: async () => {
    try {
      const res = await api.get('/auth/profile/')
      saveCache(res.data)
      set({ user: res.data, isLoading: false })
    } catch (err: any) {
      if (err.response?.status === 401) {
        setAccessToken(null)
        set({ user: null, isLoading: false })
      } else {
        set({ user: readCache(), isLoading: false })
      }
    }
  },
}))
