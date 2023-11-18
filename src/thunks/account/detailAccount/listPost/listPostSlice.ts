import { createSlice } from '@reduxjs/toolkit';
import { getListPostByAccount } from './listPostThunk';

interface IListPostState {
  posts: any | null | undefined;
}

const initialState: IListPostState = {
  posts: {},
};

const listPostSlice = createSlice({
  name: 'listPost',
  initialState,
  reducers: {
    resetPosts: (state) => {
      state.posts = {};
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getListPostByAccount.fulfilled, (state, action) => {
      state.posts = action.payload.data;
    });
    builder.addCase(getListPostByAccount.rejected, (state, action) => {
      state.posts = {};
    });
  },
});

export const listPostActions = listPostSlice.actions;

export const selectListPost = (state: any) => state.listPost.posts;

const listPostReducer = listPostSlice.reducer;
export default listPostReducer;
