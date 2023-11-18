import { createAsyncThunk } from '@reduxjs/toolkit';
import { accountApi } from '~/apis/account';
import { ACCOUNT_FAN_GET_ACTIVITY } from '~/utils/actionType.constants';

export const getAccountActivity = createAsyncThunk(ACCOUNT_FAN_GET_ACTIVITY, async (payload: any, { rejectWithValue }) => {
  try {
    const response = await accountApi.getAccountActivity(payload);
    return response.data;
  } catch (error) {
    return rejectWithValue(error);
  }
});
