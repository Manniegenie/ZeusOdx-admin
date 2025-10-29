import { useState, useEffect, useContext } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DashboardTitleContext } from '@/layouts/DashboardTitleContext';
import { toast } from 'sonner';
import { 
  Clock, 
  TestTube, 
  CheckCircle, 
  AlertCircle,
  Calendar,
  Bell,
  Info
} from 'lucide-react';
import { scheduledNotificationService } from '../services/scheduledNotificationService';
import type { ScheduledNotificationStatus } from '../types/notification.types';

export function ScheduledNotifications() {
  const titleCtx = useContext(DashboardTitleContext);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<ScheduledNotificationStatus | null>(null);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    titleCtx?.setTitle('Scheduled Notifications');
  }, [titleCtx]);

  useEffect(() => {
    loadStatus();
  }, []);

  const loadStatus = async () => {
    setLoading(true);
    try {
      const currentStatus = await scheduledNotificationService.getStatus();
      setStatus(currentStatus);
    } catch (error: any) {
      console.error('Failed to load status:', error);
      toast.error(error.message || 'Failed to load scheduled notification status');
    } finally {
      setLoading(false);
    }
  };

  const testNotification = async () => {
    setTesting(true);
    try {
      await scheduledNotificationService.sendTestNotification();
      toast.success('Test notification sent successfully');
    } catch (error: any) {
      console.error('Failed to send test notification:', error);
      toast.error(error.message || 'Failed to send test notification');
    } finally {
      setTesting(false);
    }
  };

  const formatNextRun = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getTimeIcon = (time: string) => {
    const hour = parseInt(time.split(':')[0]);
    if (hour < 12) return '🌅'; // Morning
    if (hour < 18) return '☀️'; // Afternoon
    return '🌙'; // Evening
  };

  return (
    <div className="w-full bg-white space-y-6 p-4 rounded">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Clock className="w-8 h-8 text-blue-500" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Scheduled Notifications</h1>
            <p className="text-gray-600">Automated price notifications (runs automatically)</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={testNotification}
            disabled={testing}
            variant="outline"
            className="flex items-center gap-2"
          >
            {testing ? (
              <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <TestTube className="w-4 h-4" />
            )}
            {testing ? 'Testing...' : 'Test Now'}
          </Button>
          <Button
            onClick={loadStatus}
            disabled={loading}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Status Card */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Service Status
          </h2>
          <div className="flex items-center gap-2">
            {status?.status === 'running' ? (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Running</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">Stopped</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <p className="text-lg font-medium">
              {status?.status === 'running' ? 'Active' : 'Inactive'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Scheduled Times</p>
            <p className="text-lg font-medium">{status?.scheduledTimes?.length || 0} daily</p>
          </div>
        </div>

        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-2">
            <Info className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium">Automatic Service</p>
              <p>This service starts automatically when the server boots and runs continuously. No manual intervention required.</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Schedule Details */}
      {status?.scheduledTimes && status.scheduledTimes.length > 0 && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Notification Schedule</h2>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {status.scheduledTimes.map((time, index) => (
              <div
                key={index}
                className="p-4 rounded-lg border-2 border-green-200 bg-green-50"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getTimeIcon(time)}</span>
                  <div>
                    <p className="font-semibold text-lg">{time}</p>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-green-600">Active</span>
                    </div>
                    {status.nextRuns && status.nextRuns[index] && (
                      <p className="text-xs text-gray-500 mt-1">
                        Next: {formatNextRun(status.nextRuns[index])}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Notification Template Preview */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Notification Template</h2>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="space-y-2">
            <div className="font-semibold text-lg">Latest Prices</div>
            <div className="text-gray-700">
              Latest prices are BTC - $113,000 (-0.73%), ETH - $3,450 (+1.2%), BNB - $580 (-0.5%), SOL - $95 (+2.1%). Trade now.
            </div>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-3">
          This template will be automatically populated with real-time prices from your CryptoPrice collection.
        </p>
      </Card>

      {/* Instructions */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">How it Works</h2>
        <div className="space-y-3 text-gray-600">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">1</div>
            <p>Fetches latest prices from your CryptoPrice collection for BTC, ETH, BNB, and SOL</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">2</div>
            <p>Formats prices with percentage changes and creates a notification message</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">3</div>
            <p>Sends push notifications to all users with registered FCM or Expo tokens</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">4</div>
            <p>Runs automatically at 6:00 AM, 12:00 PM, 6:00 PM, and 9:00 PM daily</p>
          </div>
        </div>
      </Card>
    </div>
  );
}