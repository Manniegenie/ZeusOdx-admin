import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userService } from '../services/userService';
import type { User } from '../types/user';

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

interface SearchUsersParams {
  email?: string;
  firstname?: string;
  lastname?: string;
  q?: string;
  limit?: number;
  page?: number;
  sortBy?: 'email' | 'createdAt' | 'kycLevel' | 'firstname' | 'lastname';
  sortOrder?: 'asc' | 'desc';
}

export const searchUsers = createAsyncThunk(
  'users/searchUsers',
  async (params: SearchUsersParams) => {
    const response = await userService.searchUsers({
      ...params,
      // Map frontend field names to API field names if needed
      firstName: params.firstname,
      lastName: params.lastname,
      // Convert sortBy field names if needed
      sortBy: params.sortBy === 'firstname' ? 'firstName' :
              params.sortBy === 'lastname' ? 'lastName' :
              params.sortBy
    });
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