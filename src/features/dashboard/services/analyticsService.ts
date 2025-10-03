import axios from '@/core/services/axios'
import type { DashboardAnalyticsResponse } from '../type/analytic'

export const getDashboardAnalytics = async (): Promise<DashboardAnalyticsResponse> => {
  const BASE_URL = import.meta.env.VITE_BASE_URL
  const token = localStorage.getItem('token')
  const res = await axios.get(`${BASE_URL}/analytics/dashboard`, {
    headers: { Authorization: token ? `Bearer ${token}` : undefined }
  })
  return res.data
}

export default getDashboardAnalytics
