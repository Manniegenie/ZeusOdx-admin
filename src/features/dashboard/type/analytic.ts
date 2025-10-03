export interface DashboardUsers {
  total: number
  emailVerified: number
  bvnVerified: number
  chatbotVerified: number
}

export interface ChatbotOverview {
  total: number
  sell: number
  buy: number
  completed: number
  pending: number
  expired: number
  cancelled: number
}

export interface ChatbotVolume {
  totalSellVolume: number
  totalBuyVolumeNGN: number
  totalReceiveAmount: number
}

export interface ChatbotSuccess {
  successfulPayouts: number
  successfulCollections: number
}

export interface ChatbotRecent24h {
  trades: number
  sellTrades: number
  buyTrades: number
  volume: number
}

export interface ChatbotTrades {
  overview: ChatbotOverview
  volume: ChatbotVolume
  success: ChatbotSuccess
  recent24h: ChatbotRecent24h
}

export interface TokenStat {
  _id: string
  tradeCount: number
  sellCount: number
  buyCount: number
  totalVolume: number
}

export interface DashboardAnalyticsData {
  users: DashboardUsers
  chatbotTrades: ChatbotTrades
  tokenStats: TokenStat[]
}

export interface DashboardAnalyticsResponse {
  success: boolean
  timestamp: string
  data: DashboardAnalyticsData
}