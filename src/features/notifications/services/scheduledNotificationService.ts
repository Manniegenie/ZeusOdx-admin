import axiosInstance from '@/core/services/axios';
import type { ScheduledNotificationStatus, NotificationResponse } from '../types/notification.types';

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const scheduledNotificationService = {
  // Get auth token
  getAuthToken() {
    return localStorage.getItem('token');
  },

  async getStatus(): Promise<ScheduledNotificationStatus> {
    try {
      const token = this.getAuthToken();
      const response = await axiosInstance.get(`${BASE_URL}/admin/scheduled-notifications/status`, {
        headers: { Authorization: token ? `Bearer ${token}` : undefined }
      });
      return response.data.status;
    } catch (error: any) {
      console.error('Error fetching scheduled notification status:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch scheduled notification status');
    }
  },

  async startService(): Promise<NotificationResponse> {
    try {
      const token = this.getAuthToken();
      const response = await axiosInstance.post(`${BASE_URL}/admin/scheduled-notifications/start`, {}, {
        headers: { Authorization: token ? `Bearer ${token}` : undefined }
      });
      return response.data;
    } catch (error: any) {
      console.error('Error starting scheduled notification service:', error);
      throw new Error(error.response?.data?.error || 'Failed to start scheduled notification service');
    }
  },

  async stopService(): Promise<NotificationResponse> {
    try {
      const token = this.getAuthToken();
      const response = await axiosInstance.post(`${BASE_URL}/admin/scheduled-notifications/stop`, {}, {
        headers: { Authorization: token ? `Bearer ${token}` : undefined }
      });
      return response.data;
    } catch (error: any) {
      console.error('Error stopping scheduled notification service:', error);
      throw new Error(error.response?.data?.error || 'Failed to stop scheduled notification service');
    }
  },

  async sendTestNotification(): Promise<NotificationResponse> {
    try {
      const token = this.getAuthToken();
      const response = await axiosInstance.post(`${BASE_URL}/admin/scheduled-notifications/test`, {}, {
        headers: { Authorization: token ? `Bearer ${token}` : undefined }
      });
      return response.data;
    } catch (error: any) {
      console.error('Error sending test scheduled notification:', error);
      throw new Error(error.response?.data?.error || 'Failed to send test scheduled notification');
    }
  }
};
