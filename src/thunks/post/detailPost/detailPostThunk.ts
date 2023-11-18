import { createAsyncThunk } from '@reduxjs/toolkit';
import { IParamRemovePost, postApi } from '~/apis/post';
import { POST_GET_DETAIL, REMOVE_POST } from '~/utils/actionType.constants';

export const getPostDetail = createAsyncThunk(POST_GET_DETAIL, async (payload: any, { rejectWithValue }) => {
  try {
    const res = await postApi.getPostDetail(payload);
    return res.data;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const removePostDetail = createAsyncThunk(REMOVE_POST, async (payload: IParamRemovePost, { rejectWithValue }) => {
  try {
    const res = await postApi.removePostDetail(payload);
    return res.data;
  } catch (error) {
    return rejectWithValue(error);
  }
});
