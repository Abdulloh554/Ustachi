import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

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
        } catch {
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
          window.location.href = '/auth/login'
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
  updateStatus: (id: number, status: string) => api.post(`/orders/${id}/update_status/`, { status }),
  logs: (id: number) => api.get(`/orders/${id}/logs/`),
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
