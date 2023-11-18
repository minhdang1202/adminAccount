import { createAsyncThunk } from '@reduxjs/toolkit';
import { issueSnapApi } from '~/apis/financial';
import { ISSUE_SNAP_POST_FOR_ACCOUNT, REVENUE_INFLUENCER_GET_ALL } from '~/utils/actionType.constants';
import { IGetListIssueSnapPayload, IIssueSnapPayload } from '~/data/financial';

export const getListIssueSnap = createAsyncThunk(REVENUE_INFLUENCER_GET_ALL, async (payload: IGetListIssueSnapPayload, { rejectWithValue }) => {
  try {
    const res = await issueSnapApi.getListIssueSnap(payload);
    return res.data;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const issueSnapForAccount = createAsyncThunk(ISSUE_SNAP_POST_FOR_ACCOUNT, async (payload: IIssueSnapPayload, { rejectWithValue }) => {
  try {
    const res = await issueSnapApi.issueSnapForAccount(payload);
    return res.data;
  } catch (error) {
    return rejectWithValue(error);
  }
});
