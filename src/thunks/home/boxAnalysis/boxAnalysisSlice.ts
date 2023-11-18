import { createSlice } from '@reduxjs/toolkit';
import { getBoxAnalysis } from './boxAnalysisThunk';

interface IStateBoxAnalysis {
  boxAnalysis: any | undefined | null;
}

const initialState: IStateBoxAnalysis = {
  boxAnalysis: {},
};

const boxAnalysisSlice = createSlice({
  name: 'boxAnalysis',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getBoxAnalysis.fulfilled, (state, action) => {
      state.boxAnalysis = action.payload.data;
    });
    builder.addCase(getBoxAnalysis.rejected, (state, action) => {
      state.boxAnalysis = {};
    });
  },
});

export const boxAnalysisActions = boxAnalysisSlice.actions;

export const selectBoxAnalysis = (state: any) => state.boxAnalysis.boxAnalysis;

const boxAnalysisReducer = boxAnalysisSlice.reducer;
export default boxAnalysisReducer;
