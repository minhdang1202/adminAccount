import { createSlice } from '@reduxjs/toolkit';
import { getListRevenueInfluencer } from './revenueThunk';

interface IRevenueState {
  revenuesInfluencer: any | null | undefined;
  loading: boolean;
}

const initialState: IRevenueState = {
  revenuesInfluencer: {},
  loading: false,
};

const revenueInfluencerSlice = createSlice({
  name: 'revenueInfluencer',
  initialState,
  reducers: {
    resetRevenuesInfluencer: (state) => {
      state.revenuesInfluencer = {};
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getListRevenueInfluencer.pending, (state, action) => {
      state.loading = true;
      state.revenuesInfluencer = {};
    });
    builder.addCase(getListRevenueInfluencer.fulfilled, (state, action) => {
      state.loading = false;
      state.revenuesInfluencer = action.payload.data;
    });
    builder.addCase(getListRevenueInfluencer.rejected, (state, action) => {
      state.loading = false;
      state.revenuesInfluencer = {};
    });
  },
});

export const revenueInfluencerActions = revenueInfluencerSlice.actions;

export const selectRevenueInfluencer = (state: any) => state.revenueInfluencer.revenuesInfluencer;
export const selectLoadingRevenueInfluencer = (state: any) => state.revenueInfluencer.loading;

const revenueInfluencerReducer = revenueInfluencerSlice.reducer;
export default revenueInfluencerReducer;
