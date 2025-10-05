import { useContext, useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import CardBg from '../../../assets/img/card-bg.png';
import { DashboardTitleContext } from '@/layouts/DashboardTitleContext';
import { useUserStore } from '@/features/users/store/userStore';
import { getDashboardAnalytics } from '../services/analyticsService'
import { toast } from 'sonner'
import type { DashboardAnalyticsResponse } from '../type/analytic';
import {DataTable} from '../components/data-table';
import {columns} from '../components/columns';

export function Dashboard() {
  
  const titleCtx = useContext(DashboardTitleContext);
  const { total, users } = useUserStore();

  const [loading, setLoading] = useState(false)
  const [analytics, setAnalytics] = useState<DashboardAnalyticsResponse | null>(null)

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

      {/* Token stats row */}
      {/* <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {analytics?.data?.tokenStats?.map((t) => (
          <Card key={t._id} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{t._id}</p>
                <h4 className="text-lg font-bold">{t.tradeCount.toLocaleString()}</h4>
              </div>
              <div className="text-right">
                <p className="text-sm">Volume</p>
                <p className="font-semibold">{t.totalVolume.toLocaleString()}</p>
              </div>
            </div>
          </Card>
        ))}
      </div> */}

      {/* {analytics?.data?.tokenStats && (
        <div className="mt-6">
          <Card className="border-none shadow-none">
            <TokenStatsChart data={analytics.data.tokenStats} />
          </Card>
        </div>
      )} */}

      <div className="w-full">
        {loading ? (
          <div className="flex items-center justify-center w-full h-32">
            <svg className="animate-spin h-8 w-8 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
          </div>
        ) : (
          <DataTable columns={columns} data={users} />
        )}
      </div>
    </div>
  );
}