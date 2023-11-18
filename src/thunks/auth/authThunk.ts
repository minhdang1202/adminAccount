import { createAsyncThunk } from '@reduxjs/toolkit';

import authApi from '~/apis/auth';
import { LOGIN } from '~/utils/actionType.constants';
import { StorageConstants } from '~/utils/enum';
import { LoginPayload } from '~/data/auth';

export const handleLogin = createAsyncThunk(LOGIN, async (payload: LoginPayload, { rejectWithValue }) => {
  try {
    const res = await authApi.login(payload);
    localStorage.setItem(StorageConstants.ACCESS_TOKEN, res.data?.data?.token?.access);
    localStorage.setItem(StorageConstants.REFRESH_TOKEN, res.data?.data?.token?.refresh);
    return res.data;
  } catch (error) {
    return rejectWithValue(error);
  }
});
