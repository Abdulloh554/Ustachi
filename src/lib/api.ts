import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://ustachibackend.onrender.com/api'

export function mediaUrl(path: string | null | undefined): string | null {
  if (!path) return null
  if (/^https?:\/\//.test(path)) return path
  const origin = API_URL.replace(/\/api\/?$/, '')
  return `${origin}${path.startsWith('/') ? '' : '/'}${path}`
}

let inMemoryToken: string | null = null
let refreshPromise: Promise<string | null> | null = null

export function setAccessToken(token: string | null) {
  inMemoryToken = token
}

export function getAccessToken(): string | null {
  return inMemoryToken
}

export async function ensureAccessToken(): Promise<string | null> {
  if (inMemoryToken) return inMemoryToken
  if (typeof window === 'undefined') return null
  if (refreshPromise) return refreshPromise

  refreshPromise = axios
    .post(`${API_URL}/auth/refresh/`, {}, { withCredentials: true })
    .then((res) => {
      inMemoryToken = res.data?.access || null
      return inMemoryToken
    })
    .catch(() => {
      inMemoryToken = null
      return null
    })
    .finally(() => {
      refreshPromise = null
    })
  return refreshPromise
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined' && inMemoryToken) {
    config.headers.Authorization = `Bearer ${inMemoryToken}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined' && !error.config?._retried) {
      const config = { ...error.config, _retried: true }
      const token = await ensureAccessToken()
      if (token) {
        config.headers = { ...config.headers, Authorization: `Bearer ${token}` }
        return api(config)
      }
    }
    return Promise.reject(error)
  }
)

export default api

export const authAPI = {
  register: (data: any) => api.post('/auth/register/', data),
  login: (data: any) => api.post('/auth/login/', data),
  refresh: () => api.post('/auth/refresh/'),
  logout: () => api.post('/auth/logout/'),
  profile: () => api.get('/auth/profile/'),
  updateProfile: (data: any) => api.patch('/auth/profile/', data),
  updateProfileForm: (form: FormData) => api.patch('/auth/profile/', form),
  changePassword: (data: any) => api.post('/auth/change-password/', data),
}

export const orderAPI = {
  list: (params?: any) => api.get('/orders/', { params }),
  create: (data: any) => api.post('/orders/', data),
  detail: (id: string) => api.get(`/orders/${id}/`),
  update: (id: string, data: any) => api.patch(`/orders/${id}/`, data),
  assign: (id: string, staffId: string) => api.post(`/orders/${id}/assign/`, { staff_id: staffId }),
  updateStatus: (id: string, status: string, paymentMethod?: string) =>
    api.post(`/orders/${id}/update_status/`, { status, payment_method: paymentMethod }),
  cancel: (id: string, reason?: string) => api.post(`/orders/${id}/cancel/`, { reason }),
  consume: (id: string, productId: string, quantity: number) =>
    api.post(`/orders/${id}/consume/`, { product_id: productId, quantity }),
  logs: (id: string) => api.get(`/orders/${id}/logs/`),
  receipt: (id: string) => api.get(`/orders/${id}/receipt/`),
}

export const workshopAPI = {
  public: () => api.get('/workshops/public/'),
  me: () => api.get('/workshops/me/'),
  updateMe: (data: any) => api.put('/workshops/me/', data),
  dashboard: () => api.get('/workshops/me/dashboard/'),
  reports: (params?: any) => api.get('/workshops/me/reports/', { params }),

  staffList: () => api.get('/workshops/me/staff/'),
  staffCreate: (data: any) => api.post('/workshops/me/staff/', data),
  staffUpdate: (id: string, data: any) => api.patch(`/workshops/me/staff/${id}/`, data),
  staffRemove: (id: string) => api.delete(`/workshops/me/staff/${id}/`),

  serviceList: () => api.get('/workshops/me/services/'),
  serviceCreate: (data: any) => api.post('/workshops/me/services/', data),
  serviceUpdate: (id: string, data: any) => api.patch(`/workshops/me/services/${id}/`, data),
  serviceRemove: (id: string) => api.delete(`/workshops/me/services/${id}/`),

  inventoryList: () => api.get('/workshops/me/inventory/'),
  inventoryCreate: (data: any) => api.post('/workshops/me/inventory/', data),
  inventoryUpdate: (id: string, data: any) => api.patch(`/workshops/me/inventory/${id}/`, data),
  inventoryRemove: (id: string) => api.delete(`/workshops/me/inventory/${id}/`),
}

export const staffAPI = {
  me: () => api.get('/staff/me/'),
  updateMe: (data: any) => api.patch('/staff/me/', data),
  myOrders: (params?: any) => api.get('/staff/me/orders/', { params }),
  myToday: () => api.get('/staff/me/today/'),
}

export const chatAPI = {
  listConversations: () => api.get('/chat/conversations/'),
  messages: (id: string) => api.get(`/chat/conversations/${id}/messages/`),
  send: (id: string, text: string, replyTo?: string) => api.post(`/chat/conversations/${id}/messages/`, { text, reply_to: replyTo }),
  edit: (id: string, messageId: string, text: string) => api.patch(`/chat/conversations/${id}/messages/${messageId}/`, { text }),
  del: (id: string, messageId: string) => api.delete(`/chat/conversations/${id}/messages/${messageId}/`),
}

export async function chatWebSocketUrl(conversationId: string): Promise<string> {
  const base = API_URL
  const protocol = base.startsWith('https') ? 'wss' : 'ws'
  const host = base.replace(/^https?:\/\//, '').replace(/\/api\/?$/, '')
  const token = getAccessToken()
  return `${protocol}://${host}/ws/chat/${conversationId}/?token=${encodeURIComponent(token || '')}`
}

export const settingsAPI = {
  get: () => api.get('/settings/'),
  update: (data: any) => api.put('/settings/', data),
}
