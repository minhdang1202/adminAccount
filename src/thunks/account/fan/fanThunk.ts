import { createAsyncThunk } from '@reduxjs/toolkit';

import { accountFanApi } from '~/apis/account';
import { ACCOUNT_FANS_GET_ALL } from '~/utils/actionType.constants';
import { AccountFanPayload } from '~/data/account';

export const getAllAccountFan = createAsyncThunk(ACCOUNT_FANS_GET_ALL, async (payload: AccountFanPayload, { rejectWithValue }) => {
  try {
    const res = await accountFanApi.getListAccount(payload);
    return res.data;
  } catch (error) {
    return rejectWithValue(error);
  }
});
