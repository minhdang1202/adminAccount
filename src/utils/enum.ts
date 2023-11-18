import { NoticeType } from 'antd/es/message/interface';

// Local Storage
export const StorageConstants = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user',
};

// Role
export const Roles = {
  ADMIN: 'ADMIN',
};

// Router && Path
export const RouterPaths = {
  MAIN: '/',
  LOGIN: 'login',
};

export const ExactPath = {
  main: '/',
  auth: {
    login: `/${RouterPaths.LOGIN}`,
  },
};

export const AdminProtectedPath = {
  DASHBOARD: { path: 'home', key: 'home', title: 'Home', selectedKey: 'home' },
  ACCOUNT_MANAGEMENT: { key: 'accountManagement', title: 'Account Management', selectedKey: 'accountManagement' },
  ACCOUNT_MANAGEMENT_FAN: {
    path: 'accountManagement/fans',
    key: 'fans',
    title: 'Fans',
    selectedKey: 'fans',
  },
  ACCOUNT_MANAGEMENT_INFLUENCER: {
    path: 'accountManagement/influencers',
    key: 'influencers',
    title: 'Influencers',
    selectedKey: 'influencers',
  },
  FINALCIAL_MANAGEMENT: { key: 'financialManagement', title: 'Financial Management', selectedKey: 'financialManagement' },
  FINALCIAL_MANAGEMENT_ISSUE_SNAP: {
    path: 'financialManagement/issues',
    key: 'issues',
    title: 'Issue Snap',
    selectedKey: 'issues',
  },
  FINALCIAL_MANAGEMENT_REVENUE_INFLUENCER: {
    path: 'financialManagement/revenueInfluencer',
    key: 'revenueInfluencer',
    title: 'Revenue Influencer',
    selectedKey: 'revenueInfluencer',
  },
  DATA_ANALYSIS: { path: 'dataAnalysis', key: 'dataAnalysis', title: 'Data Analysis', selectedKey: 'dataAnalysis' },
};

export const ERROR_CODE = {
  ERR_BAD_REQUEST: 'ERR_BAD_REQUEST',
};

export const ERROR_MESSAGE = {
  BAD_REQUEST: 'Email or password is incorrect',
  OTHER: 'An error has occurred. Please try again later.',
  NETWORK: 'Network error. Please check your internet connection and try again.',
};

export const DEFAULT_STATUS_ACCOUNT = 'DEACTIVATE';
export const STATUS = {
  ACTIVE: {
    KEY: 'ACTIVE',
    LABEL: 'Active',
  },
  DEACTIVATE: {
    KEY: 'DEACTIVATE',
    LABEL: 'Deactivate',
  },
  BAN: {
    KEY: 'BAN',
    LABEL: 'Ban',
  },
};

export const OPTIONS_EDIT_STATUS_ACCOUNT = [
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

export const STATUS_REVENUE = {
  PAID: {
    KEY: 'PAID',
    LABEL: 'Paid',
  },
  UNPAID: {
    KEY: 'UNPAID',
    LABEL: 'Unpaid',
  },
};

export const ROLES = {
  FAN: {
    KEY: '00003',
    LABEL: 'Fan',
  },
  INFLUENCER: {
    KEY: '00002',
    LABEL: 'Influencer',
  },
};

export const ORDER_BY = {
  DESC: { LABEL: 'DESC', KEY: 'descend' },
  ASC: { LABEL: 'ASC', KEY: 'ascend' },
};

export const SORT_COLUMN_BY = {
  REVENUE: 'REVENUE',
  SNAP_BALANCE: 'SNAP_BALANCE',
  FOLLOWING: 'FOLLOWING',
};

export const TEXT = {
  PLACEHOLDER_SEARCH_REVENUE: 'Full name, username, email, phone number',
  REMOVE_POST: 'Remove Post',
  REOPEN_POST: 'Reopen Post',
  PHOTO: 'photo',
  VIDEO: 'video',
};

export const Y_SCROLL = `calc(100vh - 64px - 64px - 24px - 24px - 24px - 32px - 16px - 32px - 16px - 55px - 8px )`;
/**
 * Fix
 * 64px: height header
 * 64px: height footer
 * 24px: space between header and card
 * 24px: padding top card
 * 24px: padding bottom card
 * 32px: height section include filter
 * 16px: space between section filter and table
 * 32px: height pagination
 * 16px: margin top pagination
 * 55px: height header
 * 8px: diff height content table and height table inside
 */

export const Y_SCROLL_WITH_CARD_HEADER = `calc(100vh - 64px - 64px - 24px - 24px - 24px - 32px - 16px - 32px - 16px - 55px - 8px - 73px - 24px )`;
/**
 * Fix
 * 64px: height header
 * 64px: height footer
 * 24px: space between header and card
 * 24px: padding top card
 * 24px: padding bottom card
 * 32px: height section include filter
 * 16px: space between section filter and table
 * 32px: height pagination
 * 16px: margin top pagination
 * 55px: height header
 * 8px: diff height content table and height table inside
 * 73px: height card header
 * 24px: space between header and card header
 */

export const Y_SCROLL_HAVE_BOTH = `calc(100% - 174px - 71px - 48px)`;
/**
 * Scroll have both: Have both phone number and email fields
 * Fix
 * 118px: height information card
 * 71px: height total cart
 * 48px: margin between section (24px + 24px)
 */

export const Y_SCROLL_HAVE_ONE_FIELD = `calc(100% - 148px - 71px - 48px)`;
/**
 * Scroll have one: Have phone number or email fields
 * Fix
 * 118px: height information card
 * 71px: height total cart
 * 48px: margin between section (24px + 24px)
 */

export const Y_SCROLL_BASE_TAB_FULL_FIELD_INFORMATION = '100vh - 64px - 24px - 24px - 46px - 16px - 24px - 64px';
export const Y_SCROLL_BASE_TABS_CONTENT_FULL_FIELD_INFORMATION = '100% - 160px - 71px';

export const HEIGHT_TEXT_INFORMATION = 22;

export const TITLE_CARD_HEADER = {
  BALANCE_SNAPS: 'Balance Snaps',
  TOTAL_SNAP_USED: 'Total Snap Used',
  REVENUE_OF_INFLUENCER: 'Revenue Of Influencer',
};

export const POST_REPORT_DEFAULT = {
  NAME: 'Anonymous',
  REASON: 'Content reports...',
};

export const TYPE_DATA = {
  STRING: 'string',
  NUMBER: 'number',
};

export const END_MESSAGE_INFINITY_SCROLL = {
  POST_REPORT: 'End',
};

export const DEFAULT_POST_TYPE = 'PHOTO';
export const POST_TYPE = {
  VIDEO: 'VIDEO',
  PHOTO: 'PHOTO',
};
export const POST_TAGNAME = {
  VIDEO: 'VIDEO',
  IMG: 'IMG',
};

export const MODAL_CONFIRM = {
  REMOVE_POST: {
    TITLE: 'Are you sure remove this post?',
    CONTENT: 'The post will be removed from the app once you confirm',
    SUCCESS: 'The post has been removed successfully!',
    ERROR: 'The post removed failed',
    OK_TEXT: 'Ok',
    CANCEL_TEXT: 'Cancel',
  },

  REOPEN_POST: {
    TITLE: 'Are you sure reopen this post?',
    CONTENT: 'The post will be reopened on the app once you confirm',
    SUCCESS: 'The post has been reopened successfully!',
    ERROR: 'The post removed failed',
    OK_TEXT: 'Ok',
    CANCEL_TEXT: 'Cancel',
  },

  CHANGE_STATUS_ACCOUNT: {
    TITLE: 'Are you sure change status for this account?',
    CONTENT_ACTIVE: 'The status will be activated',
    CONTENT_DEACTIVATE: 'The status will be deactivated',
    SUCCESS: 'The status has been changed successfully!',
    ERROR: 'The status changed failed',
    OK_TEXT: 'Ok',
    CANCEL_TEXT: 'Cancel',
  },

  DELETE_ACCOUNT: {
    TITLE: 'Confirm',
    CONTENT: 'Are you sure to delete this account?',
    SUCCESS: 'The account has been deleted successfully!',
    ERROR: 'The account deleted failed',
    OK_TEXT: 'Delete',
    CANCEL_TEXT: 'Cancel',
  },

  CHANGE_INFORMATION: {
    TITLE: 'Confirm',
    CONTENT: 'Are you sure to save changes?',
    SUCCESS: 'Save changed successfully!',
    ERROR: 'Save changed failed',
    OK_TEXT: 'Save changes',
    CANCEL_TEXT: 'Cancel',
  },

  CHANGE_PASSWORD: {
    TITLE: 'Confirm',
    CONTENT: 'Are you sure to save changes?',
    SUCCESS: 'Password has changed successfully!',
    ERROR: 'Password has changed failed',
    OK_TEXT: 'Save changes',
    CANCEL_TEXT: 'Cancel',
  },

  RESET_FORM: {
    TITLE: 'Discard changes',
    CONTENT: 'Are you sure to discard changes?',
    OK_TEXT: 'Discard changes',
    CANCEL_TEXT: 'Keep editing',
  },

  ISSUE_SNAP: {
    SUCCESS: 'Issue snap has been changed successfully!',
    ERROR: 'Issue snap has been changed failed',
  },
};

export const MODAL_TITLE = {
  ISSUE_SNAP: 'Issue Snap',
};

export const BUTTON_DANGER = 'danger';

export const TYPE_TOAST_MESSAGE = {
  SUCCESS: 'success' as NoticeType,
  ERROR: 'error' as NoticeType,
  INFO: 'info' as NoticeType,
  WARNING: 'warning' as NoticeType,
  LOADING: 'loading' as NoticeType,
};
export const DURATION_TOAST_MESSAGE_DEFAULT = 3;
export const CONTENT_TOAST_MESSAGE_DEFAULT = '';

export const LABEL_CHART_ANALYSIS = {
  ACCOUNT: 'Account',
  SNAP: 'Snap',
};

export const FILTER_REPORT_STATUS = {
  VIEW_ALL: {
    LABEL: 'All',
    VALUE: '',
  },
  FLAG: {
    LABEL: 'Flagged',
    VALUE: 'FLAG',
  },
  NOT_FLAG: {
    LABEL: 'Not Flagged',
    VALUE: 'NOT_FLAG',
  },
};

export const REPORT_OPTION = [
  {
    label: 'All',
    value: '',
  },
  {
    label: 'Flagged',
    value: 'FLAG',
  },
  {
    label: 'Not Flagged',
    value: 'NOT_FLAG',
  },
];

export const FIRST_SELECT_INFLUENCER = {
  label: 'All Influencer',
  value: '',
};

export const PLACEHOLDER = {
  DATA_ANALYSIS: 'Caption...',
  DEFAULT_SEARCH: 'Search...',
  DEFAULT_SELECT: 'Select',
  FILTER_INFLUENCER: 'Select Influencer',
  DEFAULT_NUMBER: '0',
  SEARCH_ISSUE: 'Full name, username, email, phone number',
  SEARCH_FANS: 'Full name, username, email, phone number',
  SEARCH_INFLUENCER: 'Full name, username, email, phone number',
  SHORT_DESCRIPTION: 'Short description...',
};

export const CURRENCY_DEFAULT = '$';

export const MIN_AGE_DEFAULT = 17;