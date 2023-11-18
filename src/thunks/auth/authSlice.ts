import { createSlice } from '@reduxjs/toolkit';

import { handleLogin } from '~/thunks/auth/authThunk';
import { StorageConstants } from '~/utils/enum';

export interface AuthState {
  accessToken: string | null | undefined;
  loading: boolean;
}

const initialState: AuthState = {
  accessToken: localStorage.getItem(StorageConstants.ACCESS_TOKEN)! || null,
  loading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    handleLogout(state) {
      localStorage.removeItem(StorageConstants.ACCESS_TOKEN);
      state.accessToken = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(handleLogin.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(handleLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.accessToken = action.payload?.data?.token?.access;
      })
      .addCase(handleLogin.rejected, (state, action) => {
        state.loading = false;
      });
  },
});

export const authActions = authSlice.actions;
export const selectLoading = (state: any) => state.auth.loading;
export const selectAccessToken = (state: any) => state.auth.accessToken;

const authReducer = authSlice.reducer;
export default authReducer;
