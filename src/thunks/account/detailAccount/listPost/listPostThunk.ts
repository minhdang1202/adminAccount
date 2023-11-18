import { createAsyncThunk } from '@reduxjs/toolkit';
import { accountApi } from '~/apis/account';
import { ACCOUNT_LIST_POST_GET_ALL } from '~/utils/actionType.constants';

export const getListPostByAccount = createAsyncThunk(ACCOUNT_LIST_POST_GET_ALL, async (payload: any, { rejectWithValue }) => {
  try {
    const response = await accountApi.getListPostByAccount(payload);
    return response.data;
  } catch (error) {
    return rejectWithValue(error);
  }
});
