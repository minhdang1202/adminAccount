import { DashBoard, DataAnalysis, FanDetail, Fans, InfluencerDetail, Influencers, Issues, RevenueInfluencer } from '~/pages';

export const routers = [
  {
    name: 'DashBoard',
    path: '/home',
    component: DashBoard,
  },
  {
    name: 'Account Management Fans',
    path: '/accountManagement/fans',
    component: Fans,
  },
  {
    name: 'Account Management Fans Detail',
    path: '/accountManagement/fans/:fanId',
    component: FanDetail,
  },
  {
    name: 'Account Management Influencers',
    path: '/accountManagement/influencers',
    component: Influencers,
  },
  {
    name: 'Account Management Influencers Detail',
    path: '/accountManagement/influencers/:influencerId',
    component: InfluencerDetail,
  },
  {
    name: 'Financial Management Issues',
    path: '/financialManagement/issues',
    component: Issues,
  },
  {
    name: 'Financial Management Revenue Influencer',
    path: '/financialManagement/revenueInfluencer',
    component: RevenueInfluencer,
  },
  {
    name: 'Data Analysis',
    path: '/dataAnalysis',
    component: DataAnalysis,
  },
];
