import { LIMIT_DEFAULT, LIMIT_DEFAULT_INFINITY_SCROLL, LIST_TAB_INFLUENCER_DETAIL, PAGE_DEFAULT, typeOfStatusAccount, urlApiAccount } from '~/utils/constants';
import axiosClient from './axiosClient';
import { removeLastCharacter } from '~/utils/helper';

interface IParamAccountFanType {
  status?: string;
  sort?: string;
  order?: string;
  page?: number;
  limit?: number;
  searchKey?: string;
}

export const accountFanApi = {
  getListAccount(params: IParamAccountFanType) {
    let url = `${urlApiAccount.getListAccount}?`;
    if (params?.status) {
      url += `status=${params?.status}&`;
    }
    if (params?.sort) {
      url += `sort=${params?.sort}&`;
    }
    if (params?.order) {
      url += `order=${params?.order}&`;
    }
    if (params?.page && params?.limit) {
      url += `page=${params?.page}&limit=${params?.limit}&`;
    }
    if (params?.searchKey) {
      url += `searchKey=${params?.searchKey}&`;
    }

    return axiosClient.get(removeLastCharacter(url));
  },
};

interface IParamType {
  id: string;
}

export interface IParamListPost {
  id: string;
  page?: number;
  limit?: number;
  type: string;
}

interface IParamChangeStatusAccount {
  accountId: string;
  status: string;
}

export interface IParamActivityPost {
  id: string;
  page?: number;
  limit?: number;
}
interface IPayloadUpdateAccount {
  accountId?: string;
  name?: string;
  email?: string;
  phoneNumber?: string;
  status?: typeOfStatusAccount;
  shortBio?: string;
  postNumber?: number;
  username?: string;
  countryCode?: string;
  dateOfBirth?: string;
}
interface IPayloadUpdateAccountPassword {
  accountId?: string | number;
  newPassword: string;
}
interface IPayloadDeleteAccount {
  accountId?: string | number;
}

export const accountApi = {
  getAccountDetail(payload: IParamType) {
    const { id } = payload;
    let url = `${urlApiAccount.getDetail}${id}`;

    return axiosClient.get(url);
  },

  getListPostByAccount(payload: IParamListPost) {
    const { id, page = PAGE_DEFAULT, limit = LIMIT_DEFAULT_INFINITY_SCROLL, type } = payload;
    let url = urlApiAccount.getListPost;
    switch (type) {
      case LIST_TAB_INFLUENCER_DETAIL.POST.key:
        url += `${id}`;
        break;
      case LIST_TAB_INFLUENCER_DETAIL.FAVORITE_POST.key:
        url += `favorite/${id}`;
        break;
      case LIST_TAB_INFLUENCER_DETAIL.POST_VIEWED.key:
        url += `viewed/${id}`;
        break;

      default:
        break;
    }

    url += `?page=${page}&limit=${limit}`;

    return axiosClient.get(url);
  },

  changeStatusAccount(payload: IParamChangeStatusAccount) {
    let url = urlApiAccount.changeStatus;
    return axiosClient.post(url, payload);
  },

  getAccountActivity(params: IParamActivityPost) {
    const { id, page = PAGE_DEFAULT, limit = LIMIT_DEFAULT } = params;
    let url = `${urlApiAccount.getActivity}${id}`;
    url += `?page=${page}&limit=${limit}`;
    return axiosClient.get(url);
  },

  updateDetailAccount(payload: IPayloadUpdateAccount) {
    let url = urlApiAccount.updateDetail;
    return axiosClient.put(url, payload);
  },

  updateDetailAccountPassword(payload: IPayloadUpdateAccountPassword) {
    let url = urlApiAccount.updatePassword;
    return axiosClient.put(url, payload);
  },

  deleteAccount(payload: IPayloadDeleteAccount) {
    let url = urlApiAccount.deleteDetail;
    return axiosClient.delete(url, { data: payload });
  },
};
