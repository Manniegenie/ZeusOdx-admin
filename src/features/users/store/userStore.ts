import { create } from 'zustand';
import { userService } from '../services/userService';
import type { User } from '../hooks/useUserManagement';

interface UserStore {
  users: User[];
  total: number;
  loading: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
}

export const useUserStore = create<UserStore>((set) => ({
  users: [],
  total: 0,
  loading: false,
  error: null,
  fetchUsers: async () => {
    set({ loading: true, error: null });
    try {
      const response = await userService.searchUsers({
        limit: 50,
        page: 1,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      });
      set({
        users: response.users,
        total: response.meta.pagination.totalResults,
        loading: false
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      set({ error: errorMessage, loading: false });
    }
  }
}));