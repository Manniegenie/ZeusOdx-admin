import { axiosInstance } from '@/core/services/axios';
import type { 
  NotificationRequest, 
  NotificationResponse, 
  NotificationStats,
  SendNotificationFormData 
} from '../types/notification.types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://zeusodx-web.onrender.com';

export const notificationService = {
  // Send notification to specific user by ID
  async sendToUser(userId: string, notification: Omit<NotificationRequest, 'userId'>): Promise<NotificationResponse> {
    try {
      const response = await axiosInstance.post(`${API_BASE_URL}/notification/send-fcm`, {
        userId,
        title: notification.title,
        body: notification.body,
        data: notification.data || {}
      });
      return response.data;
    } catch (error: any) {
      console.error('Error sending notification to user:', error);
      throw new Error(error.response?.data?.error || 'Failed to send notification');
    }
  },

  // Send notification to specific device
  async sendToDevice(deviceId: string, notification: Omit<NotificationRequest, 'deviceId'>): Promise<NotificationResponse> {
    try {
      const response = await axiosInstance.post(`${API_BASE_URL}/notification/send-fcm`, {
        deviceId,
        title: notification.title,
        body: notification.body,
        data: notification.data || {}
      });
      return response.data;
    } catch (error: any) {
      console.error('Error sending notification to device:', error);
      throw new Error(error.response?.data?.error || 'Failed to send notification');
    }
  },

  // Send notification to all users
  async sendToAll(notification: Omit<NotificationRequest, 'userId' | 'deviceId'>): Promise<NotificationResponse> {
    try {
      const response = await axiosInstance.post(`${API_BASE_URL}/notification/send-all`, {
        message: notification.body,
        title: notification.title,
        data: notification.data || {}
      });
      return response.data;
    } catch (error: any) {
      console.error('Error sending notification to all users:', error);
      throw new Error(error.response?.data?.error || 'Failed to send notification to all users');
    }
  },

  // Get notification statistics
  async getStats(): Promise<NotificationStats> {
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}/notification/stats`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching notification stats:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch notification statistics');
    }
  },

  // Test Firebase connection
  async testFirebase(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}/notification/test-firebase`);
      return response.data;
    } catch (error: any) {
      console.error('Error testing Firebase:', error);
      throw new Error(error.response?.data?.error || 'Failed to test Firebase connection');
    }
  },

  // Send notification based on form data
  async sendNotification(formData: SendNotificationFormData): Promise<NotificationResponse> {
    const notification = {
      title: formData.title,
      body: formData.body,
      data: formData.data ? JSON.parse(formData.data) : {}
    };

    switch (formData.targetType) {
      case 'all':
        return this.sendToAll(notification);
      case 'user':
        return this.sendToUser(formData.targetValue, notification);
      case 'device':
        return this.sendToDevice(formData.targetValue, notification);
      default:
        throw new Error('Invalid target type');
    }
  }
};
