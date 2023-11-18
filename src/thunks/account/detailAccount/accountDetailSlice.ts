import { createSlice } from '@reduxjs/toolkit';
import { getAccountDetail } from './accountDetailThunk';

interface IAccountState {
  account: any | null | undefined;
}

const initialState: IAccountState = {
  account: {},
};

const accountDetailSlice = createSlice({
  name: 'accountDetail',
  initialState,
  reducers: {
    resetAccount: (state) => {
      state.account = {};
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAccountDetail.pending, (state, action) => {
      state.account = {};
    });
    builder.addCase(getAccountDetail.fulfilled, (state, action) => {
      state.account = action.payload.data;
    });
    builder.addCase(getAccountDetail.rejected, (state, action) => {
      state.account = {};
    });
  },
});

export const accountDetailActions = accountDetailSlice.actions;

export const selectAccountDetail = (state: any) => state.accountDetail.account;

const accountDetailReducer = accountDetailSlice.reducer;
export default accountDetailReducer;
