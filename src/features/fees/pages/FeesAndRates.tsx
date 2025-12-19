import { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { columns } from '../components/columns';
import { DataTable } from '../components/data-table';
import { DashboardTitleContext } from '@/layouts/DashboardTitleContext';
import { fetchCryptoFees } from '../store/cryptoFeeSlice';
import { fetchOnramp, setOnramp as setOnrampThunk, fetchOfframp, setOfframp as setOfframpThunk } from '../store/ngnMarkupSlice';
import type { AppDispatch, RootState } from '@/core/store/store';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { NumberInput } from '@/components/ui/number-input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

export function FeesAndRates() {
  const dispatch = useDispatch<AppDispatch>();
  const { fees, loading, error } = useSelector((state: RootState) => state.cryptoFee);
  const ngn = useSelector((state: RootState) => state.ngnMarkup);
  const titleCtx = useContext(DashboardTitleContext);

  // Onramp state
  const [onrampRate, setOnrampRate] = useState<number | null>(null);
  const [onrampUpdatedAt, setOnrampUpdatedAt] = useState<string | null>(null);
  const [onrampInput, setOnrampInput] = useState<string>('');
  const [onrampLoading, setOnrampLoading] = useState(false);

  // Offramp state
  const [offrampRate, setOfframpRate] = useState<number | null>(null);
  const [offrampUpdatedAt, setOfframpUpdatedAt] = useState<string | null>(null);
  const [offrampInput, setOfframpInput] = useState<string>('');
  const [offrampLoading, setOfframpLoading] = useState(false);

  useEffect(() => {
    titleCtx?.setTitle('Fees & Rates');
    titleCtx?.setBreadcrumb([
      'Fees & Rates',
      'Crypto Fees',
      'View all fees & rates',
    ]);
    
    dispatch(fetchCryptoFees());
    dispatch(fetchOnramp());
    dispatch(fetchOfframp());
  }, [dispatch]);

  // Sync local state from store
  useEffect(() => {
    setOnrampRate(ngn.onramp?.rate ?? null);
    setOnrampUpdatedAt(ngn.onramp?.updatedAt ?? null);
    setOfframpRate(ngn.offramp?.rate ?? null);
    setOfframpUpdatedAt(ngn.offramp?.updatedAt ?? null);
  }, [ngn.onramp, ngn.offramp]);

  function formatDate(d?: string | null) {
    try {
      return d ? new Date(d).toLocaleString() : '—';
    } catch {
      return '—';
    }
  }

  async function setOnramp() {
    if (!onrampInput) return toast.error('Provide a rate');
    const value = Number(onrampInput);
    if (!Number.isFinite(value) || value <= 0) return toast.error('Invalid rate');
    setOnrampLoading(true);
    try {
      const payload = await dispatch(setOnrampThunk(value)).unwrap();
      if (payload?.success) {
        toast.success(payload.message || 'Onramp rate set');
        setOnrampInput('');
        dispatch(fetchOnramp());
      } else {
        toast.error(payload?.message || 'Failed to set onramp rate');
      }
    } catch (err) {
      console.error('set onramp failed', err);
      toast.error('Failed to set onramp rate');
    } finally {
      setOnrampLoading(false);
    }
  }

  async function setOfframp() {
    if (!offrampInput) return toast.error('Provide a rate');
    const value = Number(offrampInput);
    if (!Number.isFinite(value) || value <= 0) return toast.error('Invalid rate');
    setOfframpLoading(true);
    try {
      const payload = await dispatch(setOfframpThunk(value)).unwrap();
      if (payload?.success) {
        toast.success(payload.message || 'Offramp rate set');
        setOfframpInput('');
        dispatch(fetchOfframp());
      } else {
        toast.error(payload?.message || 'Failed to set offramp rate');
      }
    } catch (err) {
      console.error('set offramp failed', err);
      toast.error('Failed to set offramp rate');
    } finally {
      setOfframpLoading(false);
    }
  }

  return (
    <div className="w-full bg-white space-y-6 p-4 rounded">
      <Tabs defaultValue="crypto-fees" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="crypto-fees">Crypto Fees</TabsTrigger>
          <TabsTrigger value="onramp-rate">Onramp Rate</TabsTrigger>
          <TabsTrigger value="offramp-rate">Offramp Rate</TabsTrigger>
        </TabsList>

        <TabsContent value="crypto-fees" className="mt-6">
          <div className="w-full space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">Crypto Fees</h3>
                <p className="text-sm text-gray-600">Manage cryptocurrency network fees</p>
              </div>
              <div className="flex gap-2">
                <Link to="/fees-rates/crypto-fees-management">
                  <Button  className="flex items-center gap-2">
                    <span>Advanced Management</span>
                  </Button>
                </Link>
                <Link to="/fees-rates/price-markdown">
                  <Button  className="flex items-center gap-2">
                    <span>Adjust Price Markdown</span>
                  </Button>
                </Link>
                <Link to="/fees-rates/add-crypto-fee">
                  <Button className="flex items-center gap-2">
                    <span>Add New Fee</span>
                  </Button>
                </Link>
              </div>
            </div>
            
            {loading ? (
              <div className="flex items-center justify-center w-full h-32">
                <svg className="animate-spin h-8 w-8 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center w-full h-32 text-red-500">
                {error}
              </div>
            ) : (
              <DataTable columns={columns} data={fees || []} />
            )}
          </div>
        </TabsContent>

        <TabsContent value="onramp-rate" className="mt-6">
          <div className="flex justify-end mb-4">
            <Link to="/fees-rates/onramp-management">
              <Button >Open on-ramp management</Button>
            </Link>
          </div>
          <Card className="w-full max-w-2xl mx-auto">
            <CardContent className="p-6">
              <div className="bg-primary relative rounded-lg p-6 w-full text-white flex flex-col justify-center gap-6 mb-6">
                <span className="text-xs text-white/87">Current Onramp Rate</span>
                <span className="text-4xl font-semibold">N{onrampRate ? Number(onrampRate).toLocaleString() : '—'}</span>
                <span className="text-xs text-white/87">Last Update: {formatDate(onrampUpdatedAt)}</span>
                <div className="w-fit h-fit py-1 px-3 rounded-full bg-white/50 text-primary absolute top-5 right-5 text-[11px]">Source: Manual</div>
              </div>
              <div className="flex flex-col gap-2 mb-4">
                <Label className="text-gray-800">New Rate (N per unit)</Label>
                <NumberInput 
                  value={onrampInput} 
                  onChange={(e) => setOnrampInput(e.target.value)} 
                  allowDecimal={true} 
                  placeholder="N0" 
                  className="w-full mt-2 p-3 h-10 border border-gray-300 rounded" 
                />
                <span className="text-gray-800 text-xs">Positive number only</span>
              </div>
              <Button 
                className="w-full bg-primary h-10 text-white" 
                onClick={setOnramp} 
                disabled={onrampLoading}
              >
                {onrampLoading ? 'Updating...' : 'Update Rate'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="offramp-rate" className="mt-6">
          <div className="flex justify-end mb-4">
            <Link to="/fees-rates/offramp-management">
              <Button >Open off-ramp management</Button>
            </Link>
          </div>
          <Card className="w-full max-w-2xl mx-auto">
            <CardContent className="p-6">
              <div className="bg-primary relative rounded-lg p-6 w-full text-white flex flex-col justify-center gap-6 mb-6">
                <span className="text-xs text-white/87">Current Offramp Rate</span>
                <span className="text-4xl font-semibold">N{offrampRate ? Number(offrampRate).toLocaleString() : '—'}</span>
                <span className="text-xs text-white/87">Last Update: {formatDate(offrampUpdatedAt)}</span>
                <div className="w-fit h-fit py-1 px-3 rounded-full bg-white/50 text-primary absolute top-5 right-5 text-[11px]">Source: Manual</div>
              </div>
              <div className="flex flex-col gap-2 mb-4">
                <Label className="text-gray-800">New Rate (N per unit)</Label>
                <NumberInput 
                  value={offrampInput} 
                  onChange={(e) => setOfframpInput(e.target.value)} 
                  allowDecimal={true} 
                  placeholder="N0" 
                  className="w-full mt-2 p-3 h-10 border border-gray-300 rounded" 
                />
                <span className="text-gray-800 text-xs">Positive number only</span>
              </div>
              <Button 
                className="w-full bg-primary h-10 text-white" 
                onClick={setOfframp} 
                disabled={offrampLoading}
              >
                {offrampLoading ? 'Updating...' : 'Update Rate'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}