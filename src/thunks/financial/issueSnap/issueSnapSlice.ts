import { createSlice } from '@reduxjs/toolkit';
import { getListIssueSnap } from './issueSnapThunk';

interface IIssueSnapState {
  issueSnap: any | null | undefined;
  loading: boolean;
}

const initialState: IIssueSnapState = {
  issueSnap: {},
  loading: false,
};

const issueSnapSlice = createSlice({
  name: 'issueSnap',
  initialState,
  reducers: {
    resetIssueSnap: (state) => {
      state.issueSnap = {};
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getListIssueSnap.pending, (state, action) => {
      state.loading = true;
      state.issueSnap = {};
    });
    builder.addCase(getListIssueSnap.fulfilled, (state, action) => {
      state.loading = false;
      state.issueSnap = action.payload.data;
    });
    builder.addCase(getListIssueSnap.rejected, (state, action) => {
      state.loading = false;
      state.issueSnap = {};
    });
  },
});

export const issueSnapActions = issueSnapSlice.actions;

export const selectIssueSnap = (state: { issueSnap: IIssueSnapState }) => state.issueSnap.issueSnap;
export const selectLoadingIssueSnap = (state: any) => state.issueSnap.loading;

const issueSnapReducer = issueSnapSlice.reducer;
export default issueSnapReducer;
