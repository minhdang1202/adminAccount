import { lazy } from 'react';

export const Login = lazy(() => import('./login/Login'));
export const DashBoard = lazy(() => import('./dashboard/DashBoard'));
export const DataAnalysis = lazy(() => import('./dataAnalysis/DataAnalysis'));
export const Fans = lazy(() => import('./accountManagement/fans/Fans'));
export const FanDetail = lazy(() => import('./accountManagement/fans/fanDetail/FanDetail'));
export const Influencers = lazy(() => import('./accountManagement/influencers/Influencers'));
export const InfluencerDetail = lazy(() => import('./accountManagement/influencers/influencerDetail/InfluencerDetail'));
export const Issues = lazy(() => import('./finalcialManagement/issues/Issues'));
export const RevenueInfluencer = lazy(() => import('./finalcialManagement/revenueInfluencer/RevenueInfluencer'));
