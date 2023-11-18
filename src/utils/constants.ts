import { IAnalyticChartProps } from '~/components/specific/analyticChart/AnalyticChart';
import { convertNumberHasNotFractionDigit } from './helper';

export const OPTION_ALL = 'ALL';

export const OPTIONS_STATUS = [
  {
    value: '',
    label: 'All status',
  },
  {
    value: 'ACTIVE',
    label: 'Active',
  },
  {
    value: 'DEACTIVATE',
    label: 'Deactivate',
  },
  {
    value: 'BAN',
    label: 'Ban',
  },
];

export const OPTIONS_ROLE = [
  {
    value: '',
    label: 'All role',
  },
  {
    value: '00003',
    label: 'Fan',
  },
  {
    value: '00002',
    label: 'Influencer',
  },
];

export const OPTION_STATUS_PAYOUT = [
  {
    value: '',
    label: 'All status',
  },
  {
    value: 'PAID',
    label: 'Paid',
  },
  {
    value: 'UNPAID',
    label: 'Unpaid',
  },
];

export const OPTIONS_COUNTRY_CODE = [
  { label: '+ 1', value: '1' },
  { label: '+ 84', value: '84' },
];

export const analyticType = {
  FANS: { label: 'Fans', value: 'FAN' },
  INFLUENCERS: { label: 'Influencers', value: 'INFLUENCER' },
  SNAPS_PURCHASED: { label: 'Snaps Purchased', value: 'SNAP_PURCHASE' },
  SNAP_USED: { label: 'Total Snap Used', value: 'SNAP_USED' },
};

export const analyticTypeOptions = [
  { label: 'Fans', value: 'FAN' },
  { label: 'Influencers', value: 'INFLUENCER' },
  { label: 'Snaps Purchased', value: 'SNAP_PURCHASE' },
  { label: 'Total Snap Used', value: 'SNAP_USED' },
];

export const labelMonthOfChart = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export const TIME_UNIT = {
  AM: 'AM',
  PM: 'PM',
};

export const OPTIONS_MONTH = [
  { label: 'January', value: '1' },
  { label: 'February', value: '2' },
  { label: 'March', value: '3' },
  { label: 'April', value: '4' },
  { label: 'May', value: '5' },
  { label: 'June', value: '6' },
  { label: 'July', value: '7' },
  { label: 'August', value: '8' },
  { label: 'September', value: '9' },
  { label: 'October', value: '10' },
  { label: 'November', value: '11' },
  { label: 'December', value: '12' },
];

export const barChartAnalyticConfig = ({ data, title, label }: IAnalyticChartProps) => {
  const config = {
    data: {
      labels: labelMonthOfChart,
      datasets: [
        {
          label: label,
          data: data?.map((item: any) => {
            return item.value;
          }),
          backgroundColor: ['rgba(75,192,192,1)'],
          borderColor: 'rgba(55, 65, 81,0)',
          borderWidth: 2,
        },
      ],
    },
    options: {
      animation: {
        duration: 0,
      },
      maintainAspectRatio: false,
      responsive: true,
      plugins: {
        legend: {
          display: true,
          onClick: () => { },
        },
        tooltip: {
          intersect: true,
          enabled: true,

          callbacks: {
            label: function (tooltipItem: any) {
              return label + ': ' + convertNumberHasNotFractionDigit(tooltipItem.raw);
            },
          },
        },
        title: {
          display: true,
          text: title,
        },
      },
      scales: {
        y: {
          ticks: {
            callback: function (value: any) {
              return convertNumberHasNotFractionDigit(value);
            },
          },
        },
      },
    },
  };
  return config;
};
export const DEFAULT_ROLE = 'fan';
export const ROLE_INFLUENCER = 'influencer';
export const roleAccountManagement = {
  FAN: 'fan',
  INFLUENCER: 'influencer',
};

export const LIST_TAB_FAN_DETAIL = {
  ACCOUNT_SUMMARY: {
    key: 'account_summary',
    title: 'Account Summary',
  },
  FAVORITE_POST: {
    key: 'favoritePost',
    title: 'Favorite Post',
  },
  POST_VIEWED: {
    key: 'postsViewed',
    title: 'Posts Viewed',
  },
  ACTIVITIES: {
    key: 'activities',
    title: 'Activities',
  },
};

export const LIST_TAB_INFLUENCER_DETAIL = {
  ACCOUNT_SUMMARY: {
    key: 'account_summary',
    title: 'Account Summary',
  },
  POST: {
    key: 'posts',
    title: 'Posts',
  },
  FAVORITE_POST: {
    key: 'favoritePost',
    title: 'Favorite Post',
  },
  POST_VIEWED: {
    key: 'postsViewed',
    title: 'Posts Viewed',
  },
  ACTIVITIES: {
    key: 'activities',
    title: 'Activities',
  },
};

export const baseURL = process.env.REACT_APP_BASE_URL;

export const apiKey = process.env.REACT_APP_API_KEY;

export const urlApiAuth = {
  login: 'admin/auth/login',
  refreshToken: 'auth/refresh-token',
};

export const urlApiHome = {
  getBoxAnalysis: 'admin/home',
  getDataChart: 'admin/home/chart?',
};

export const urlApiAccount = {
  getListAccount: '/admin/accounts/fan',
  getDetail: 'admin/accounts/detail/',
  getListPost: 'admin/posts/',
  changeStatus: 'admin/accounts/change-status',
  getActivity: 'admin/accounts/activity/',
  updateDetail: '/admin/accounts',
  updatePassword: '/admin/accounts/new-password',
  deleteDetail: '/admin/accounts',
};

export const urlApiInfluencer = {
  getAll: 'admin/accounts/influencer',
};

export const urlApiPost = {
  getDetail: 'admin/posts/detail/',
  removeDetail: '/admin/posts/remove',
  getPost: 'admin/analysis/post',
};

export const urlApiRevenue = {
  getAll: 'admin/financial/accounts/revenue?',
};

export const urlApiIssueSnap = {
  getAll: 'admin/financial/accounts/issue-snap?',
  issueSnap: 'admin/financial/accounts/issue-snap',
};

export const codeResponseApi = {
  loginSuccess: 'LOGIN_SUCCESS',
  errNetwork: 'ERR_NETWORK',
};

export const DEFAULT_TYPE_MESSAGE_ACTIVITY = 'BUY_SNAP';
export const typesMessageActivity = {
  BUY_SNAP: 'BUY_SNAP',
  VIEW_POST: 'VIEW_POST',
  CREATE_POST: 'CREATE_POST',
};

export type typeOfMessageActivity = 'BUY_SNAP' | 'VIEW_POST' | 'CREATE_POST';
export type typeFileOfPost = 'VIDEO' | 'PHOTO' | '';
export type typeOfStatusAccount = 'ACTIVE' | 'DEACTIVATE' | 'BAN';
export type typeOfRole = 'fan' | 'influencer';

export const TYPE_ORDER = {
  DESCEND: {
    sortOder: 'descend',
    sortOderQuery: 'DESC',
  },
  ASCEND: {
    sortOder: 'ascend',
    sortOderQuery: 'ASC',
  },
  CANCEL: {
    sortOder: undefined,
    sortOderQuery: 'CANCEL',
  },
};
export const TYPE_ORDER_DESC = 'descend';
export const TYPE_ORDER_ASC = 'ascend';

export const SORT_BY = {
  /**
   * key: key field
   * param: param is to pass to the api
   */
  FOLLOWING: {
    key: 'countFollowing',
    param: 'FOLLOWING',
  },
  FOLLOWER: {
    key: 'countFollower',
    param: 'FOLLOWER',
  },
  POSTED: {
    key: 'countPost',
    param: 'POST',
  },
};

export const PAGE_DEFAULT = 1;
export const PAGE_DEFAULT_STR = '1';

export const MODAL_CONFIRM_TITLE = 'Mark paid';

export const BADGE_STATUS_SUCCESS = 'success';
export const BADGE_STATUS_ERROR = 'error';

export const CURRENT_MONTH_LOCAL_VALUE_DEFAULT = 'en-US';
export const CURRENT_MONTH_LOCAL_LONG_NAME = 'long';

export const LIMIT_DEFAULT = 10;
export const LIMIT_DEFAULT_INFINITY_SCROLL = 30;
export const WIDTH_MODAL_DETAIL_POST = 360;
export const HEIGHT_MODAL_DETAIL_POST = 836;

export const KEY_PARAMS = {
  PAGE: 'page',
  LIMIT: 'limit',
  SEARCH_KEY: 'searchKey',
  SORT: 'sort',
  ORDER: 'order',
  STATUS: 'status',
  YEAR: 'year',
  MONTH: 'month',
  ROLE: 'role',
  REPORT_STATUS: 'reportStatus',
  ACCOUNT_ID: 'accountId',
};

export const EMPTY_STRING = '';
export const ZERO = 0;

export const REGEX = {
  PHONE_NUMBER: /^[0-9]{10}$/
}

export const DATE_FORMAT_DATE_PICKER = 'YYYY/MM/DD';