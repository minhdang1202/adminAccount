import { createAsyncThunk } from '@reduxjs/toolkit';
import dataAnalysisApi from '~/apis/dataAnalysis';
import { DATA_ANALYSIS_GET_POSTS } from '~/utils/actionType.constants';

export const getPosts = createAsyncThunk(DATA_ANALYSIS_GET_POSTS, async (payload: any, { rejectWithValue }) => {
  try {
    const res = await dataAnalysisApi.getPosts(payload);
    return res.data;
  } catch (error) {
    return rejectWithValue(error);
  }
});
