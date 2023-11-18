import { createSlice } from '@reduxjs/toolkit';
import { getDataChart } from './chartAnalysisThunk';

interface IStateChartAnalysis {
  dataChartAnalysis: object | null | undefined;
  loading: boolean;
}

const initialState: IStateChartAnalysis = {
  dataChartAnalysis: {},
  loading: false,
};

const chartAnalysisSlice = createSlice({
  name: 'chartAnalysis',
  initialState,
  reducers: {
    resetStateChartAnalysis: (state) => {
      state.dataChartAnalysis = {};
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getDataChart.pending, (state, action) => {
      state.loading = true;
    });

    builder.addCase(getDataChart.fulfilled, (state, action) => {
      state.loading = false;
      state.dataChartAnalysis = action.payload.data;
    });

    builder.addCase(getDataChart.rejected, (state, action) => {
      state.loading = false;
      state.dataChartAnalysis = {};
    });
  },
});

export const chartAnalysisActions = chartAnalysisSlice.actions;
export const selectChartAnalysis = (state: any) => state.chartAnalysis.dataChartAnalysis;
export const selectLoadingChartAnalysis = (state: any) => state.chartAnalysis.loading;

const chartAnalysisReducer = chartAnalysisSlice.reducer;
export default chartAnalysisReducer;
