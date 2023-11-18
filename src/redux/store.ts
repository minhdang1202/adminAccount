import { configureStore, ThunkAction, Action, combineReducers } from '@reduxjs/toolkit';
import accountDetailReducer from '~/thunks/account/detailAccount/accountDetailSlice';

import authReducer from '~/thunks/auth/authSlice';
import influencerReducer from '~/thunks/account/influencer/influencerSlice';
import accountFanReducer from '~/thunks/account/fan/fanSlice';
import listPostReducer from '~/thunks/account/detailAccount/listPost/listPostSlice';
import postDetailReducer from '~/thunks/post/detailPost/detailPostSlice';
import accountActivityReducer from '~/thunks/account/detailAccount/activity/accountActivitySlice';
import revenueInfluencerReducer from './../thunks/financial/revenue/revenueSlice';
import issueSnapReducer from './../thunks/financial/issueSnap/issueSnapSlice';
import boxAnalysisReducer from './../thunks/home/boxAnalysis/boxAnalysisSlice';
import chartAnalysisReducer from './../thunks/home/chartAnalysis/chartAnalysisSlice';
import dataAnalysisReducer from '~/thunks/dataAnalysis/dataAnalysisSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  accountFan: accountFanReducer,
  accountDetail: accountDetailReducer,
  accountActivity: accountActivityReducer,
  influencer: influencerReducer,
  listPost: listPostReducer,
  postDetail: postDetailReducer,
  revenueInfluencer: revenueInfluencerReducer,
  issueSnap: issueSnapReducer,
  boxAnalysis: boxAnalysisReducer,
  chartAnalysis: chartAnalysisReducer,
  dataAnalysis: dataAnalysisReducer,
});

export function makeStore() {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
    devTools: process.env.NODE_ENV !== 'production',
  });
}

const store = makeStore();

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;

export default store;
