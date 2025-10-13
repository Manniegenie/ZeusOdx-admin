import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userService } from '../services/userService';
import type { User, GetUsersResponse } from '../types/user';

interface UsersState {
  users: User[];
  pagination: {
    total: number;
    limit: number;
    skip: number;
    hasMore: boolean;
  } | null;
  loading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  users: [],
  pagination: null,
  loading: false,
  error: null,
};

export const searchUsers = createAsyncThunk(
  'users/searchUsers',
  async (params: {
    email?: string;
    firstname?: string;
    lastname?: string;
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

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(searchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.data.users;
        state.pagination = action.payload.data.pagination;
      })
      .addCase(searchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to search users';
      });
  },
});

export default usersSlice.reducer;