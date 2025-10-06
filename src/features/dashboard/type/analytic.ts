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
  transactionVolume: number
}

export interface DashboardAnalyticsResponse {
  success: boolean
  timestamp: string
  data: DashboardAnalyticsData
}

// Transaction types
export interface Transaction {
  id: string;
  userId?: string;
  username?: string;
  userEmail?: string;
  type: string;
  status: string;
  currency: string;
  amount: number;
  fee?: number;
  narration?: string;
  reference?: string;
  source?: string;
  createdAt: string;
  updatedAt?: string;
  completedAt?: string;
  // Swap fields
  fromCurrency?: string;
  toCurrency?: string;
  fromAmount?: number;
  toAmount?: number;
  swapType?: string;
  exchangeRate?: number;
  // Withdrawal fields
  bankName?: string;
  accountName?: string;
  accountNumberMasked?: string;
  withdrawalFee?: number;
  // Transfer fields
  recipientUsername?: string;
  senderUsername?: string;
  // Giftcard fields
  cardType?: string;
  country?: string;
  expectedRate?: number;
}

export interface RecentTransactionsResponse {
  success: boolean;
  timestamp: string;
  pagination: {
    currentPage: number;
    totalPages: number;
    limit: number;
    totalCount: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  data: Transaction[];
}