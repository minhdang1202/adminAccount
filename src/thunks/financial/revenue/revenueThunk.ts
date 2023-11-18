import { createAsyncThunk } from '@reduxjs/toolkit';
import { revenueApi } from '~/apis/financial';
import { REVENUE_INFLUENCER_GET_ALL } from '~/utils/actionType.constants';

export const getListRevenueInfluencer = createAsyncThunk(REVENUE_INFLUENCER_GET_ALL, async (payload: any, { rejectWithValue }) => {
  try {
    const res = await revenueApi.getListRevenue(payload);
    return res.data;
  } catch (error) {
    return rejectWithValue(error);
  }
});
