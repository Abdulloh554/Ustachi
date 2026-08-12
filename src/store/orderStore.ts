import { create } from 'zustand'
import { orderAPI } from '@/lib/api'

interface Order {
  id: string
  client: string
  client_details?: any
  master: string | null
  master_details?: any
  title: string
  description: string
  profession: string | null
  status: string
  location_lat: number
  location_lng: number
  address: string
  price: string | null
  created_at: string
  updated_at: string
}

interface OrderState {
  orders: Order[]
  isLoading: boolean
  fetchOrders: (params?: any) => Promise<void>
  createOrder: (data: any) => Promise<void>
}

export const useOrderStore = create<OrderState>((set) => ({
  orders: [],
  isLoading: false,

  fetchOrders: async (params) => {
    set({ isLoading: true })
    try {
      const res = await orderAPI.list(params)
      set({ orders: res.data.results || res.data, isLoading: false })
    } catch {
      set({ isLoading: false })
    }
  },

  createOrder: async (data) => {
    await orderAPI.create(data)
  },
}))
