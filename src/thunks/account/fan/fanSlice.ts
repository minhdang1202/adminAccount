import { createSlice } from '@reduxjs/toolkit';
import { getAllAccountFan } from '~/thunks/account/fan/fanThunk';
export interface AccountFanState {
  accountFans: {};
  loading: boolean;
}

const initialState: AccountFanState = {
  accountFans: {},
  loading: false,
};

const accountFanSlice = createSlice({
  name: 'accountFan',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getAllAccountFan.pending, (state, action) => {
        state.loading = true;
        state.accountFans = {};
      })
      .addCase(getAllAccountFan.fulfilled, (state, action) => {
        state.loading = false;
        state.accountFans = action.payload.data;
      })
      .addCase(getAllAccountFan.rejected, (state, action) => {
        state.loading = false;
      });
  },
});

export const accountActions = accountFanSlice.actions;
export const selectLoading = (state: any) => state.accountFan.loading;
export const selectListAccountFan = (state: any) => state.accountFan.accountFans;

const accountReducer = accountFanSlice.reducer;
export default accountReducer;
