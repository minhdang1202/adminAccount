import { createSlice } from '@reduxjs/toolkit';
import { getAccountActivity } from './accountActivityThunk';

interface IAccountState {
  accountActivityPagination: any | null | undefined;
  accountActivityResponses: any | null | undefined;
}

const initialState: IAccountState = {
  accountActivityPagination: {},
  accountActivityResponses: [],
};

const accountActivitySlice = createSlice({
  name: 'accountActivity',
  initialState,
  reducers: {
    resetActivityState: (state) => {
      state.accountActivityPagination = {};
      state.accountActivityResponses = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAccountActivity.fulfilled, (state, action) => {
      state.accountActivityPagination = action.payload?.data?.pagination;
      state.accountActivityResponses = action.payload?.data?.responses;
    });

    builder.addCase(getAccountActivity.rejected, (state, action) => {
      state.accountActivityPagination = {};
      state.accountActivityResponses = [];
    });
  },
});

export const accountActivityActions = accountActivitySlice.actions;

export const selectAccountActivityPagination = (state: any) => state.accountActivity.accountActivityPagination;
export const selectAccountActivityResponses = (state: any) => state.accountActivity.accountActivityResponses;

const accountDetailReducer = accountActivitySlice.reducer;
export default accountDetailReducer;
