import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://ustachibackend.onrender.com/api'

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
  changePassword: (data: any) => api.post('/auth/change-password/', data),
}

export const orderAPI = {
  list: (params?: any) => api.get('/orders/', { params }),
  create: (data: any) => api.post('/orders/', data),
  detail: (id: string) => api.get(`/orders/${id}/`),
  accept: (id: string) => api.post(`/orders/${id}/accept/`),
  cancel: (id: string) => api.post(`/orders/${id}/cancel/`),
  updateStatus: (id: string, status: string) => api.post(`/orders/${id}/update_status/`, { status }),
  logs: (id: string) => api.get(`/orders/${id}/logs/`),
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
  // WebSocket authenticates with the HttpOnly access-token cookie. Putting a
  // bearer token in the URL would expose it to access logs and referrers.
  return `${protocol}://${host}/ws/chat/${conversationId}/`
}

export const masterAPI = {
  list: (params?: any) => api.get('/masters/', { params }),
  detail: (id: string) => api.get(`/masters/${id}/`),
  works: (id: string) => api.get(`/masters/${id}/orders/`),
  myProfile: () => api.get('/masters/me/profile/'),
  updateProfile: (data: any) => api.patch('/masters/me/profile/', data),
  availableOrders: () => api.get('/masters/available-orders/'),
}

export const clientAPI = {
  myOrders: () => api.get('/clients/my-orders/'),
}

export const reviewAPI = {
  submit: (data: any) => api.post('/masters/reviews/', data),
  myReviews: () => api.get('/masters/reviews/'),
}

export const adminAPI = {
  dashboard: () => api.get('/admin/dashboard/'),
  users: () => api.get('/admin/users/'),
  masters: () => api.get('/admin/masters/'),
  orders: (params?: any) => api.get('/admin/orders/', { params }),
  map: () => api.get('/admin/map/'),
}

export const professionAPI = {
  list: () => api.get('/auth/professions/'),
}

export const settingsAPI = {
  get: () => api.get('/settings/'),
  update: (data: any) => api.put('/settings/', data),
}

export const storeAPI = {
  products: (params?: any) => api.get('/stores/products/', { params }),
  product: (id: string) => api.get(`/stores/products/${id}/`),
  favorites: () => api.get('/stores/favorites/'),
  toggleFavorite: (productId: string) => api.post('/stores/favorites/toggle/', { product_id: productId }),
  cart: () => api.get('/stores/cart/'),
  addToCart: (productId: string, quantity = 1) => api.post('/stores/cart/', { product_id: productId, quantity }),
  removeFromCart: (id: string) => api.delete(`/stores/cart/${id}/`),
  checkout: () => api.post('/stores/cart/checkout/'),
  myStore: () => api.get('/stores/me/store/'),
  updateStore: (data: any) => api.put('/stores/me/store/', data),
  myProducts: () => api.get('/stores/me/products/'),
  createProduct: (data: any) => api.post('/stores/me/products/', data),
  updateProduct: (id: string, data: any) => api.patch(`/stores/me/products/${id}/`, data),
  deleteProduct: (id: string) => api.delete(`/stores/me/products/${id}/`),
  statistics: () => api.get('/stores/me/statistics/'),
}
