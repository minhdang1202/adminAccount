import { message } from 'antd';
import dayjs from 'dayjs';
import { AdminProtectedPath, ERROR_MESSAGE, HEIGHT_TEXT_INFORMATION, STATUS } from './enum';
import {
  CURRENT_MONTH_LOCAL_LONG_NAME,
  CURRENT_MONTH_LOCAL_VALUE_DEFAULT,
  DAYS_OF_WEEK,
  MONTHS,
  OPTIONS_MONTH,
  PAGE_DEFAULT,
  TIME_UNIT,
  TYPE_ORDER,
  TYPE_ORDER_ASC,
  TYPE_ORDER_DESC,
  codeResponseApi,
} from './constants';

export const getSideNav = (list: string[]) => {
  if (list.length <= 1) {
    return AdminProtectedPath.DASHBOARD;
  } else {
    if (!list[1]) {
      return AdminProtectedPath.DASHBOARD;
    } else {
      const listTrimmed = list.filter((item) => item);
      let foundKey;
      for (let i = listTrimmed.length - 1; i >= 0; i--) {
        foundKey = Object.keys(AdminProtectedPath).find((key) => AdminProtectedPath[key as keyof typeof AdminProtectedPath]?.key === listTrimmed[i]);
        if (foundKey) {
          break;
        }
      }
      return AdminProtectedPath[foundKey as keyof typeof AdminProtectedPath];
    }
  }
};

export const handleResponseError = (err: any, msg: string) => {
  if (err?.code === codeResponseApi.errNetwork) {
    message.error(ERROR_MESSAGE?.NETWORK);
    return;
  }

  message.error(msg);
};

export const removeLastCharacter = (string: string) => {
  return string.slice(0, -1);
};

export const objectIsEmpty = (obj: any): boolean => {
  let isEmpty = false;
  if (!obj) {
    return false;
  }
  if (Object.keys(obj).length === 0) {
    isEmpty = true;
  }
  return isEmpty;
};

export const convertNumberHasNotFractionDigit = (value: string | number | undefined) => {
  const number = Number(value);
  if (!number) {
    return '0';
  }

  const formattedNumber = number.toLocaleString('en-US', { maximumFractionDigits: 0 });
  return formattedNumber;
};

export const convertStringToNumber = (str: string) => {
  const number = Number(str);
  if (!number) {
    return str;
  }

  const formattedNumber = number.toLocaleString('en-US', { maximumFractionDigits: 2 });
  return formattedNumber;
};

export const convertRevenueNumber = (str: string) => {
  const number = Number(str);
  const formattedNumber = number.toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 });

  return formattedNumber;
};

export const formattedPhoneNumber = (countryCode: string, phoneNumber: string) => {
  return `+${countryCode} ${phoneNumber}`;
};

export const getCurrentMonthObject = () => {
  const currentDate = new Date();
  const currentMonthName = currentDate.toLocaleString(CURRENT_MONTH_LOCAL_VALUE_DEFAULT, { month: CURRENT_MONTH_LOCAL_LONG_NAME });

  const currentMonthObject = OPTIONS_MONTH.find((month) => month.label === currentMonthName);

  return currentMonthObject;
};

export const checkExistOption = (listOption: any, itemSelected: any) => {
  if (!listOption || listOption?.length <= 0 || !itemSelected) {
    return '';
  }
  const isShowLabel = listOption.some((option: any) => option.value === itemSelected);

  const item = isShowLabel ? itemSelected : '';

  return item;
};

export const convertBytes = (bytes: number | string) => {
  let convertBytes = Number(bytes);
  if (!convertBytes) {
    return;
  }

  const units = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  let unitIndex = 0;
  while (convertBytes >= 1024 && unitIndex < units.length - 1) {
    convertBytes /= 1024;
    unitIndex++;
  }

  return convertBytes?.toFixed(1) + ' ' + units[unitIndex];
};

export const convertSecondsToMMSS = (seconds: number) => {
  const min = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0');
  const second = (seconds % 60).toString().padStart(2, '0');
  return `${min}:${second}`;
};

export const formatNumberQuantity = (value: number) => {
  if (value < 1000) {
    return value.toString();
  }

  if (value < 1000000) {
    return (value / 1000).toFixed(1) + 'k';
  }

  return (value / 1000000).toFixed(1) + 'm';
};

export const checkSingularOrPlural = (value: string | number | undefined) => {
  if (!value) {
    return;
  }
  if (+value > 1) {
    return 's';
  }
};

export const getListCurrentYear = () => {
  let currentYear = new Date().getFullYear();
  let yearsArray = [];
  let startYear = 2022;

  for (let year = currentYear; year >= startYear; year--) {
    yearsArray.push({ label: year.toString(), value: year.toString() });
  }

  return yearsArray;
};

export const handleQueryString = (listOption: { value: string; label: string }[], queryValue: string, defaultValue: string) => {
  if (!queryValue) {
    return defaultValue;
  }

  const existOption = checkExistOption(listOption, queryValue);

  if (existOption) {
    return existOption;
  }

  return null;
};

export const handleSetDefaultPageInUrl = (fieldName: string, fieldValue: string, params: any, setSearchParams: any) => {
  if (params?.page) {
    setSearchParams({ ...params, [fieldName]: fieldValue, page: PAGE_DEFAULT.toString() });
  } else {
    setSearchParams({ ...params, [fieldName]: fieldValue });
  }
};

export const defaultSortOrder = (order?: string, paramSort?: string, sort?: string) => {
  if (paramSort !== sort) {
    return;
  }

  if (order === TYPE_ORDER.ASCEND.sortOderQuery) {
    return TYPE_ORDER_ASC;
  }

  if (order === TYPE_ORDER.DESCEND.sortOderQuery) {
    return TYPE_ORDER_DESC;
  }

  return;
};

export const convertTimestampToCustomFormat = (timestamp: string = '') => {
  const date = new Date(timestamp);
  if (!date) {
    return;
  }

  const dayOfWeek = DAYS_OF_WEEK[date.getUTCDay()];
  const dayOfMonth = date.getUTCDate();
  const month = MONTHS[date.getUTCMonth()];

  return `${dayOfWeek}, ${dayOfMonth} ${month}`;
};

export const convertTimestampToCustomFormatTime = (dateTime: string = '') => {
  const date = new Date(dateTime);
  if (!date) {
    return;
  }

  const hours = date.getHours();
  const minutes = date.getMinutes();
  const amPm = hours >= 12 ? TIME_UNIT.PM : TIME_UNIT.AM;
  const hoursAm = hours > 12 ? hours - 12 : hours;
  // Format hours and minutes to have two digits
  const formattedHours = hoursAm < 10 ? `0${hoursAm}` : hoursAm;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  // Combine hours and minutes
  const result = `${formattedHours}:${formattedMinutes} ${amPm}`;

  return result;
};

// Handle convert data activity
export const groupByCreatedAt = (data: any[]) => {
  const groupedData: any = {};
  data.forEach((item: any) => {
    const createdAt = convertTimestampToCustomFormat(item.createdAt);
    if (!createdAt) {
      return;
    }

    if (!groupedData[createdAt]) {
      groupedData[createdAt] = [];
    }

    groupedData[createdAt].push(item);
  });

  const result = Object.entries(groupedData).map(([createdAt, data]) => ({
    date: createdAt,
    data: data,
  }));

  return result;
};

export const handleConvertDataActivity = (accountActivityConverted: any[]) => {
  let groupedData: any = {};
  accountActivityConverted.forEach((item: any) => {
    const { date, data } = item;
    if (!groupedData[date]) {
      groupedData[date] = data;
    } else {
      groupedData[date] = [...groupedData[date], ...data];
    }
  });

  const result = Object.entries(groupedData).map(([date, data]) => ({
    date,
    data,
  }));

  return result;
};
// End handle convert data activity

export const handleCalHeightWithInformation = (email?: string, phone?: string, shortBio?: string) => {
  let count = 0;
  if (email) count++;
  if (phone) count++;
  if (shortBio) count++;

  return HEIGHT_TEXT_INFORMATION * count;
};

export const addKeyToObjectInArr = (arr: any[]) => {
  if (!arr || !arr?.length) return [];
  const newArr = arr.map((item: any) => ({ ...item, key: item?.id }));

  return newArr;
};

export const convertToYYYYMMDD = (inputTime?: string) => {
  if (!inputTime) {
    return;
  }
  const date = dayjs(inputTime);
  const formattedDate = date.format('YYYY-MM-DD');

  return formattedDate;
};

export const renderStatusBadge = (origin: string, keySuccess: string, keyError?: string, keyWarning?: string) => {
  let badgeStatus: "warning" | "error" | "success" | "processing" | "default" | undefined = undefined;;
  let badgeText;
  if (origin === keySuccess) {
    badgeStatus = 'success';
    badgeText = STATUS.ACTIVE.LABEL
  }
  if (origin === keyError) {
    badgeStatus = 'error';
    badgeText = STATUS.DEACTIVATE.LABEL
  }
  if (origin === keyWarning) {
    badgeStatus = 'warning';
    badgeText = STATUS.BAN.LABEL
  }
  return { badgeStatus, badgeText };
};