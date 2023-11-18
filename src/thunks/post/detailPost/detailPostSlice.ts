import { createSlice } from '@reduxjs/toolkit';
import { getPostDetail } from './detailPostThunk';

interface IPostState {
  post: any | null | undefined;
}

const initialState: IPostState = {
  post: {},
};

const postDetailSlice = createSlice({
  name: 'postDetail',
  initialState,
  reducers: {
    resetPost: (state) => {
      state.post = {};
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getPostDetail.fulfilled, (state, action) => {
      state.post = action.payload.data;
    });
    builder.addCase(getPostDetail.rejected, (state, action) => {
      state.post = {};
    });
  },
});

export const postDetailActions = postDetailSlice.actions;

export const selectPostDetail = (state: any) => state.postDetail.post;

const postDetailReducer = postDetailSlice.reducer;
export default postDetailReducer;
