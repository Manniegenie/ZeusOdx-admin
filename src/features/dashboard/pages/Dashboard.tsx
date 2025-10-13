import { useContext, useEffect, useState, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Card } from '@/components/ui/card';
import CardBg from '../../../assets/img/card-bg.png';
import { DashboardTitleContext } from '@/layouts/DashboardTitleContext';
import type { RootState } from '@/core/store/store';
import { getDashboardAnalytics, getRecentTransactions, getFilteredData } from '../services/analyticsService'
import { toast } from 'sonner'
import type { DashboardAnalyticsResponse, Transaction } from '../type/analytic';
import { DataTable } from '../components/data-table';
import { columns } from '../components/columns';
import { Search, X, Filter } from 'lucide-react';

export function Dashboard() {
  const titleCtx = useContext(DashboardTitleContext);
  const { users } = useSelector((state: RootState) => state.users);
  const total = users.length;

  const [loading, setLoading] = useState(false)
  const [analytics, setAnalytics] = useState<DashboardAnalyticsResponse | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [transactionsLoading, setTransactionsLoading] = useState(false)
  
  // Rest of your Dashboard component code...
  // [Previous implementation remains the same]

  return (
    // Your existing JSX
    // [Previous implementation remains the same]
  );
}