import { useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DashboardTitleContext } from '@/layouts/DashboardTitleContext';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DataTable } from '../components/UserTable';
import { UserStatsCards } from '../components/UserStatsCards';
import { Search } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { searchUsers, fetchUserStats } from '../store/userStore';
import type { RootState } from '@/core/store/store';
import type { AppDispatch } from '@/core/store/store';

export function UserManagement() {
  const titleCtx = useContext(DashboardTitleContext);
  const dispatch = useDispatch<AppDispatch>();
  
  const { users, loading, stats, pagination } = useSelector((state: RootState) => state.users);

  useEffect(() => {
    titleCtx?.setTitle('User Management');
    dispatch(fetchUserStats());
  }, [titleCtx, dispatch]);

  const handleSearch = (value: string) => {
    dispatch(searchUsers({ q: value, page: 1 }));
  };

  const handleSort = (value: string) => {
    const [field, order] = value.split('-');
    dispatch(searchUsers({ sortBy: field, sortOrder: order as 'asc' | 'desc' }));
  };

  const handlePageChange = (page: number) => {
    dispatch(searchUsers({ page }));
  };

  return (
    <div className="space-y-6">
      {/* Stats Section */}
      <UserStatsCards stats={stats} />

      {/* Main Content */}
      <Card className="p-6">
        <Tabs defaultValue="all" className="w-full">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <TabsList>
              <TabsTrigger value="all">All Users</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="kyc0">KYC 0</TabsTrigger>
              <TabsTrigger value="kyc1">KYC 1</TabsTrigger>
              <TabsTrigger value="kyc2">KYC 2</TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search users..."
                  className="pl-10"
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>

              <Select onValueChange={handleSort}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt-desc">Newest First</SelectItem>
                  <SelectItem value="createdAt-asc">Oldest First</SelectItem>
                  <SelectItem value="email-asc">Email A-Z</SelectItem>
                  <SelectItem value="email-desc">Email Z-A</SelectItem>
                  <SelectItem value="kycLevel-desc">KYC Level (High-Low)</SelectItem>
                  <SelectItem value="kycLevel-asc">KYC Level (Low-High)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <TabsContent value="all" className="mt-0">
            <DataTable
              data={users}
              loading={loading}
              pagination={pagination}
              onPageChange={handlePageChange}
            />
          </TabsContent>

          <TabsContent value="active" className="mt-0">
            <DataTable
              data={users.filter(user => user.isActive)}
              loading={loading}
              pagination={pagination}
              onPageChange={handlePageChange}
            />
          </TabsContent>

          {[0, 1, 2].map(level => (
            <TabsContent key={level} value={`kyc${level}`} className="mt-0">
              <DataTable
                data={users.filter(user => user.kycLevel === level)}
                loading={loading}
                pagination={pagination}
                onPageChange={handlePageChange}
              />
            </TabsContent>
          ))}
        </Tabs>
      </Card>
    </div>
  );
}