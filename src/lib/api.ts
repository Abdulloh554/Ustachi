import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://ustachibackend.onrender.com/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      const refresh = localStorage.getItem('refresh_token')
      if (refresh) {
        try {
          const res = await axios.post(`${API_URL}/auth/refresh/`, { refresh })
          localStorage.setItem('access_token', res.data.access)
          error.config.headers.Authorization = `Bearer ${res.data.access}`
          return axios(error.config)
        } catch (refreshErr: any) {
          if (refreshErr.response) {
            localStorage.removeItem('access_token')
            localStorage.removeItem('refresh_token')
            localStorage.removeItem('user_cache')
            window.location.href = '/auth/login'
          }
        }
      }
    }
    return Promise.reject(error)
  }
)

export default api

export const authAPI = {
  register: (data: any) => api.post('/auth/register/', data),
  login: (data: any) => api.post('/auth/login/', data),
  profile: () => api.get('/auth/profile/'),
  updateProfile: (data: any) => api.patch('/auth/profile/', data),
  changePassword: (data: any) => api.post('/auth/change-password/', data),
}

export const orderAPI = {
  list: (params?: any) => api.get('/orders/', { params }),
  create: (data: any) => api.post('/orders/', data),
  detail: (id: number) => api.get(`/orders/${id}/`),
  accept: (id: number) => api.post(`/orders/${id}/accept/`),
  cancel: (id: number) => api.post(`/orders/${id}/cancel/`),
  updateStatus: (id: number, status: string) => api.post(`/orders/${id}/update_status/`, { status }),
  logs: (id: number) => api.get(`/orders/${id}/logs/`),
}

export const chatAPI = {
  listConversations: () => api.get('/chat/conversations/'),
  messages: (id: number) => api.get(`/chat/conversations/${id}/messages/`),
  send: (id: number, text: string) => api.post(`/chat/conversations/${id}/messages/`, { text }),
}

export function chatWebSocketUrl(conversationId: number): string {
  const base = API_URL
  const protocol = base.startsWith('https') ? 'wss' : 'ws'
  const host = base.replace(/^https?:\/\//, '').replace(/\/api\/?$/, '')
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') || '' : ''
  return `${protocol}://${host}/ws/chat/${conversationId}/?token=${encodeURIComponent(token)}`
}

export const masterAPI = {
  list: (params?: any) => api.get('/masters/', { params }),
  detail: (id: number) => api.get(`/masters/${id}/`),
  works: (id: number) => api.get(`/masters/${id}/orders/`),
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
  orders: () => api.get('/admin/orders/'),
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
  product: (id: number) => api.get(`/stores/products/${id}/`),
  favorites: () => api.get('/stores/favorites/'),
  toggleFavorite: (productId: number) => api.post('/stores/favorites/toggle/', { product_id: productId }),
  cart: () => api.get('/stores/cart/'),
  addToCart: (productId: number, quantity = 1) => api.post('/stores/cart/', { product_id: productId, quantity }),
  removeFromCart: (id: number) => api.delete(`/stores/cart/${id}/`),
  checkout: () => api.post('/stores/cart/checkout/'),
  myStore: () => api.get('/stores/me/store/'),
  updateStore: (data: any) => api.put('/stores/me/store/', data),
  myProducts: () => api.get('/stores/me/products/'),
  createProduct: (data: any) => api.post('/stores/me/products/', data),
  updateProduct: (id: number, data: any) => api.patch(`/stores/me/products/${id}/`, data),
  deleteProduct: (id: number) => api.delete(`/stores/me/products/${id}/`),
  statistics: () => api.get('/stores/me/statistics/'),
}
