import { createAsyncThunk } from '@reduxjs/toolkit';
import { accountApi } from '~/apis/account';
import { IDeleteAccountPayload, IUpdateDetailPayload, IUpdatePasswordPayload } from '~/data/account';
import { CHANGE_STATUS_ACCOUNT } from '~/utils/actionType.constants';
import { ACCOUNT_FANS_GET_DETAIL } from '~/utils/actionType.constants';

export const getAccountDetail = createAsyncThunk(ACCOUNT_FANS_GET_DETAIL, async (payload: any, { rejectWithValue }) => {
  try {
    const response = await accountApi.getAccountDetail(payload);
    return response.data;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const changeStatusAccount = createAsyncThunk(CHANGE_STATUS_ACCOUNT, async (payload: any, { rejectWithValue }) => {
  try {
    const response = await accountApi.changeStatusAccount(payload);
    return response.data;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const updateDetailAccount = createAsyncThunk(CHANGE_STATUS_ACCOUNT, async (payload: IUpdateDetailPayload, { rejectWithValue }) => {
  try {
    const response = await accountApi.updateDetailAccount(payload);
    return response.data;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const updateDetailAccountPassword = createAsyncThunk(CHANGE_STATUS_ACCOUNT, async (payload: IUpdatePasswordPayload, { rejectWithValue }) => {
  try {
    const response = await accountApi.updateDetailAccountPassword(payload);
    return response.data;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const deleteAccount = createAsyncThunk(CHANGE_STATUS_ACCOUNT, async (payload: IDeleteAccountPayload, { rejectWithValue }) => {
  try {
    const response = await accountApi.deleteAccount(payload);
    return response.data;
  } catch (error) {
    return rejectWithValue(error);
  }
});
