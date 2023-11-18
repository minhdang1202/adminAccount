import { LIMIT_DEFAULT, PAGE_DEFAULT, urlApiIssueSnap, urlApiRevenue } from '~/utils/constants';
import axiosClient from './axiosClient';

interface IParamListRevenue {
  page?: number;
  limit?: number;
  revenueYear: number;
  revenueMonth: string;
  searchKey?: string;
  payoutStatus?: string;
  sort?: string;
  order?: string;
}

interface IParamListIssueSnap {
  page?: number;
  limit?: number;
  searchKey?: string;
  role?: string;
  sort?: string;
  order?: string;
}

interface IParamIssueSnap {
  accountId?: string | number;
  snap: number;
}

export const revenueApi = {
  getListRevenue(payload: IParamListRevenue) {
    const { page = PAGE_DEFAULT, limit = LIMIT_DEFAULT, revenueYear, revenueMonth, searchKey, payoutStatus, sort, order } = payload;

    let url = `${urlApiRevenue.getAll}revenueYear=${revenueYear}&revenueMonth=${revenueMonth}&page=${page}&limit=${limit}`;

    if (searchKey) {
      url += `&searchKey=${searchKey}`;
    }
    if (payoutStatus) {
      url += `&payoutStatus=${payoutStatus}`;
    }
    if (sort) {
      url += `&sort=${sort}`;
    }
    if (order) {
      url += `&order=${order}`;
    }

    return axiosClient.get(url);
  },
};

export const issueSnapApi = {
  getListIssueSnap(payload: IParamListIssueSnap) {
    const { page = PAGE_DEFAULT, limit = LIMIT_DEFAULT, searchKey, role, sort, order } = payload;

    let url = `${urlApiIssueSnap.getAll}&page=${page}&limit=${limit}`;

    if (searchKey) {
      url += `&searchKey=${searchKey}`;
    }
    if (role) {
      url += `&role=${role}`;
    }
    if (sort) {
      url += `&sort=${sort}`;
    }
    if (order) {
      url += `&order=${order}`;
    }

    return axiosClient.get(url);
  },
  issueSnapForAccount(payload: IParamIssueSnap) {
    let url = `${urlApiIssueSnap.getAll}`;
    return axiosClient.post(url, payload);
  }
};
