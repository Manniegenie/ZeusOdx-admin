import { useContext, useEffect, useState, useRef, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import CardBg from '../../../assets/img/card-bg.png';
import { DashboardTitleContext } from '@/layouts/DashboardTitleContext';
import { useUserStore } from '@/features/users/store/userStore';
import { getDashboardAnalytics, getRecentTransactions } from '../services/analyticsService'
import { toast } from 'sonner'
import type { DashboardAnalyticsResponse, Transaction } from '../type/analytic';
import { DataTable } from '../components/data-table';
import { columns } from '../components/columns';

export function Dashboard() {
  
  const titleCtx = useContext(DashboardTitleContext);
  const { total } = useUserStore();

  const [loading, setLoading] = useState(false)
  const [analytics, setAnalytics] = useState<DashboardAnalyticsResponse | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [transactionsLoading, setTransactionsLoading] = useState(false)
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [hasNextPage, setHasNextPage] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  
  const tableContainerRef = useRef<HTMLDivElement>(null)

  // Helper function to format currency
  const formatCurrency = (value: number | undefined | null) => {
    if (value === undefined || value === null) return '—';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  useEffect(() => {
    titleCtx?.setTitle('Dashboard');
  }, [titleCtx]);

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const resp = await getDashboardAnalytics()
        setAnalytics(resp)
      } catch (err) {
        console.error('Failed to load analytics', err)
        toast.error('Failed to load dashboard analytics')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // Fetch initial transactions
  useEffect(() => {
    const loadTransactions = async () => {
      setTransactionsLoading(true)
      try {
        const result = await getRecentTransactions(1, 50)
        
        if (result.success && result.data) {
          setTransactions(result.data)
          setHasNextPage(result.pagination.hasNextPage)
          setCurrentPage(1)
        }
      } catch (err) {
        console.error('Failed to load transactions', err)
        toast.error('Failed to load recent transactions')
      } finally {
        setTransactionsLoading(false)
      }
    }
    loadTransactions()
  }, [])

  // Load more transactions
  const loadMoreTransactions = useCallback(async () => {
    if (loadingMore || !hasNextPage) return
    
    setLoadingMore(true)
    try {
      const nextPage = currentPage + 1
      const result = await getRecentTransactions(nextPage, 50)
      
      if (result.success && result.data) {
        setTransactions(prev => [...prev, ...result.data])
        setHasNextPage(result.pagination.hasNextPage)
        setCurrentPage(nextPage)
      }
    } catch (err) {
      console.error('Failed to load more transactions', err)
      toast.error('Failed to load more transactions')
    } finally {
      setLoadingMore(false)
    }
  }, [currentPage, hasNextPage, loadingMore])

  // Infinite scroll handler
  useEffect(() => {
    const container = tableContainerRef.current
    if (!container) return

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container
      
      // Load more when scrolled to bottom (with 100px threshold)
      if (scrollHeight - scrollTop <= clientHeight + 100) {
        loadMoreTransactions()
      }
    }

    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [loadMoreTransactions])

  return (
    <div className="w-full bg-white space-y-6 p-4 rounded">

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
        <Card className="p-6 bg-primary rounded-lg text-white relative overflow-hidden">
          <img src={CardBg} className='object-fit absolute left-0 top-0' alt='Logo' />
          <div className="flex flex-col items-start gap-3 space-x-4">
            <p className="text-sm text-white font-semibold">Total Users</p>
            <h3 className="text-[30px] font-bold">{loading ? '...' : analytics?.data?.users?.total ?? total}</h3>
          </div>
        </Card>
        
        <Card className="p-6 rounded-lg border-gray-200 shadow-none">
          <div className="flex flex-col items-start gap-3 space-x-4">
            <p className="text-sm text-gray-500 font-semibold">Trades</p>
            <h3 className="text-2xl font-bold">{loading ? '...' : analytics?.data?.chatbotTrades?.overview?.total ?? '—'}</h3>
          </div>
        </Card>
        
        <Card className="p-6 rounded-lg border-gray-200 shadow-none">
          <div className="flex flex-col items-start gap-3 space-x-4">
            <p className="text-sm text-gray-500 font-semibold">Completed Trades</p>
            <h3 className="text-2xl font-bold">{loading ? '...' : analytics?.data?.chatbotTrades?.overview?.completed ?? '—'}</h3>
          </div>
        </Card>
        
        <Card className="p-6 rounded-lg border-gray-200 shadow-none">
          <div className="flex flex-col items-start gap-3 space-x-4">
            <p className="text-sm text-gray-500 font-semibold">Pending Trades</p>
            <h3 className="text-2xl font-bold">{loading ? '...' : analytics?.data?.chatbotTrades?.overview?.pending ?? '—'}</h3>
          </div>
        </Card>
        
        <Card className="p-6 rounded-lg border-gray-200 shadow-none">
          <div className="flex flex-col items-start gap-3 space-x-4">
            <p className="text-sm text-gray-500 font-semibold">Transaction Volume</p>
            <h3 className="text-2xl font-bold">
              {loading ? '...' : formatCurrency(analytics?.data?.transactionVolume)}
            </h3>
          </div>
        </Card>
      </div>

      <div className="w-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recent Transactions</h2>
          <span className="text-sm text-gray-500">
            {transactions.length} transactions loaded
            {hasNextPage && ' • Scroll for more'}
          </span>
        </div>
        
        {transactionsLoading ? (
          <div className="flex items-center justify-center w-full h-32">
            <svg className="animate-spin h-8 w-8 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
          </div>
        ) : (
          <div ref={tableContainerRef} className="max-h-[600px] overflow-y-auto">
            <DataTable columns={columns} data={transactions} />
            
            {loadingMore && (
              <div className="flex items-center justify-center w-full py-4">
                <svg className="animate-spin h-6 w-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                <span className="ml-2 text-sm text-gray-500">Loading more...</span>
              </div>
            )}
            
            {!hasNextPage && transactions.length > 0 && (
              <div className="text-center py-4 text-sm text-gray-500">
                No more transactions to load
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}