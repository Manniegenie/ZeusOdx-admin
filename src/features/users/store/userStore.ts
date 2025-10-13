import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userService } from '../services/userService';
import type { User } from '../types/user';

interface UserState {
  users: User[];
  stats: {
    totalUsers: number;
    activeUsers: number;
    recentUsers: number;
    kycBreakdown: Record<string, number>;
    percentageActive: number;
  } | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalResults: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  } | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  stats: null,
  pagination: null,
  loading: false,
  error: null,
};

export const searchUsers = createAsyncThunk(
  'users/searchUsers',
  async (params: {
    email?: string;
    firstName?: string;
    lastName?: string;
    q?: string;
    limit?: number;
    page?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) => {
    const response = await userService.searchUsers(params);
    return response;
  }
);

export const fetchUserStats = createAsyncThunk(
  'users/fetchStats',
  async () => {
    const response = await userService.getUserStats();
    return response;
  }
);

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Search Users
      .addCase(searchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users;
        state.pagination = action.payload.meta.pagination;
      })
      .addCase(searchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to search users';
      })
      // Fetch Stats
      .addCase(fetchUserStats.fulfilled, (state, action) => {
        state.stats = action.payload.stats;
      });
  },
});

export default userSlice.reducer;