import axios from '@/core/services/axios'
import type { DashboardAnalyticsResponse, RecentTransactionsResponse } from '../type/analytic'

const BASE_URL = import.meta.env.VITE_BASE_URL

export const getDashboardAnalytics = async (): Promise<DashboardAnalyticsResponse> => {
  const token = localStorage.getItem('token')
  const res = await axios.get(`${BASE_URL}/analytics/dashboard`, {
    headers: { Authorization: token ? `Bearer ${token}` : undefined }
  })
  return res.data
}

export const getRecentTransactions = async (
  page: number = 1,
  limit: number = 50
): Promise<RecentTransactionsResponse> => {
  const token = localStorage.getItem('token')
  const res = await axios.get(
    `${BASE_URL}/analytics/recent-transactions?page=${page}&limit=${limit}`,
    {
      headers: { Authorization: token ? `Bearer ${token}` : undefined }
    }
  )
  return res.data
}

export default getDashboardAnalytics