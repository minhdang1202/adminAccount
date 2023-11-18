import { createSlice } from '@reduxjs/toolkit';
import { getAllAccountInfluencer } from './influencerThunk';

export interface InfluencerState {
  accountInfluencer: {};
  loading: boolean;
}

const initialState: InfluencerState = {
  accountInfluencer: {},
  loading: false,
};

const influencerSlice = createSlice({
  name: 'influencer',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllAccountInfluencer.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getAllAccountInfluencer.fulfilled, (state, action) => {
        state.loading = false;
        state.accountInfluencer = action.payload.data;
      })
      .addCase(getAllAccountInfluencer.rejected, (state, action) => {
        state.loading = false;
      });
  },
});

export const influencerActions = influencerSlice.actions;
export const selectLoading = (state: any) => state.influencer.loading;
export const selectListInfluencer = (state: any) => state.influencer.accountInfluencer;

const influencerReducer = influencerSlice.reducer;
export default influencerReducer;
