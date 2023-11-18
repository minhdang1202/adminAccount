import { createAsyncThunk } from '@reduxjs/toolkit';
import accountInfluencerApi from '~/apis/influencer';
import { ACCOUNT_INFLUENCER_GET_ALL } from '~/utils/actionType.constants';

export const getAllAccountInfluencer = createAsyncThunk(ACCOUNT_INFLUENCER_GET_ALL, async (payload: any, { rejectWithValue }) => {
  try {
    const res = await accountInfluencerApi.getAllInfluencer(payload);
    return res.data;
  } catch (error) {
    return rejectWithValue(error);
  }
});
