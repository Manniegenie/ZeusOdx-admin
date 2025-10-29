export interface NotificationRequest {
  title: string;
  body: string;
  data?: Record<string, any>;
  userId?: string;
  deviceId?: string;
  sendToAll?: boolean;
}

export interface NotificationResponse {
  success: boolean;
  message: string;
  result?: {
    success: boolean;
    tickets?: Array<{
      status: 'ok' | 'error';
      message?: string;
      details?: any;
    }>;
    hasErrors?: boolean;
    via: 'fcm' | 'expo';
  };
}

export interface NotificationStats {
  totalUsers: number;
  usersWithTokens: number;
  fcmTokens: number;
  expoTokens: number;
  lastSent?: string;
}

export interface SendNotificationFormData {
  title: string;
  body: string;
  data: string; // JSON string
  targetType: 'all' | 'user' | 'device';
  targetValue: string;
}

export interface ScheduledNotificationStatus {
  status: 'running' | 'stopped';
  scheduledTimes: string[];
  nextRuns: string[];
}
