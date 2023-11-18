import { createAsyncThunk } from '@reduxjs/toolkit';
import { homeApi } from '~/apis/home';
import { BOX_ANALYSIS_GET } from '~/utils/actionType.constants';

export const getBoxAnalysis = createAsyncThunk(BOX_ANALYSIS_GET, async (_, { rejectWithValue }) => {
  try {
    const res = await homeApi.getBoxAnalysis();
    return res.data;
  } catch (error) {
    return rejectWithValue(error);
  }
});
