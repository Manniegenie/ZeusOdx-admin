import { apiClient } from '@/core/api/apiClient';
import type { 
  KYCResponse, 
  KYCDetailsResponse, 
  KYCUpgradeRequest, 
  KYCUpgradeResponse,
  FilterParams 
} from '../types/kyc';

export class KYCService {
  private static readonly BASE_URL = '/admin-kyc';

  /**
   * Get KYC entries with filtering and pagination
   */
  static async getKycEntries(params: FilterParams): Promise<KYCResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.status) queryParams.append('status', params.status);
      if (params.idType) queryParams.append('idType', params.idType);
      if (params.searchTerm) queryParams.append('searchTerm', params.searchTerm);
      if (params.dateFrom) queryParams.append('dateFrom', params.dateFrom);
      if (params.dateTo) queryParams.append('dateTo', params.dateTo);
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

      const response = await apiClient.get(`${this.BASE_URL}/list?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching KYC entries:', error);
      throw error;
    }
  }

  /**
   * Get KYC entry details by ID
   */
  static async getKycDetails(kycId: string): Promise<KYCDetailsResponse> {
    try {
      const response = await apiClient.get(`${this.BASE_URL}/details/${kycId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching KYC details:', error);
      throw error;
    }
  }

  /**
   * Approve KYC entry
   */
  static async approveKyc(phoneNumber: string, idType: string, idNumber: string, fullName?: string): Promise<any> {
    try {
      const response = await apiClient.post(`${this.BASE_URL}/approve`, {
        phoneNumber,
        idType,
        idNumber,
        fullName
      });
      return response.data;
    } catch (error) {
      console.error('Error approving KYC:', error);
      throw error;
    }
  }

  /**
   * Cancel KYC entry
   */
  static async cancelKyc(phoneNumber: string, reason?: string): Promise<any> {
    try {
      const response = await apiClient.post(`${this.BASE_URL}/cancel`, {
        phoneNumber,
        reason
      });
      return response.data;
    } catch (error) {
      console.error('Error cancelling KYC:', error);
      throw error;
    }
  }

  /**
   * Reset KYC entry
   */
  static async resetKyc(phoneNumber: string): Promise<any> {
    try {
      const response = await apiClient.post(`${this.BASE_URL}/reset`, {
        phoneNumber
      });
      return response.data;
    } catch (error) {
      console.error('Error resetting KYC:', error);
      throw error;
    }
  }

  /**
   * Manually upgrade user KYC level
   */
  static async upgradeKyc(request: KYCUpgradeRequest): Promise<KYCUpgradeResponse> {
    try {
      const response = await apiClient.post(`${this.BASE_URL}/upgrade`, request);
      return response.data;
    } catch (error) {
      console.error('Error upgrading KYC:', error);
      throw error;
    }
  }
}
