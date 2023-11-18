import { createSlice } from '@reduxjs/toolkit';
import { getPosts } from './dataAnalysisThunk';

export interface DataAnalysisState {
  listPost: any | undefined | null;
  loading: boolean;
}

const initialState: DataAnalysisState = {
  listPost: {},
  loading: false,
};

const dataAnalysisSlice = createSlice({
  name: 'dataAnalysis',
  initialState,
  reducers: {
    resetDataAnalysis: (state) => {
      state.listPost = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPosts.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.listPost = action.payload.data;
      })
      .addCase(getPosts.rejected, (state, action) => {
        state.loading = false;
      });
  },
});

export const dataAnalysisActions = dataAnalysisSlice.actions;
export const selectLoading = (state: any) => state.dataAnalysis.loading;
export const selectPosts = (state: any) => state.dataAnalysis.listPost;

const dataAnalysisReducer = dataAnalysisSlice.reducer;
export default dataAnalysisReducer;
