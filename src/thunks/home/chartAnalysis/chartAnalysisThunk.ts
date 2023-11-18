import { createAsyncThunk } from '@reduxjs/toolkit';
import { IParamDataChart, homeApi } from '~/apis/home';
import { CHART_ANALYSIS_GET } from '~/utils/actionType.constants';

export const getDataChart = createAsyncThunk(CHART_ANALYSIS_GET, async (payload: IParamDataChart, { rejectWithValue }) => {
  try {
    const res = await homeApi.getDataChart(payload);
    return res.data;
  } catch (error) {
    return rejectWithValue(error);
  }
});
