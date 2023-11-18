import { typeOfStatusAccount } from "~/utils/constants";

export interface AccountFanPayload {
  status?: string;
  sort?: string;
  order?: string;
  page?: number;
  limit?: number;
  searchKey?: string;
}

export interface IDataInfluencer {
  avatar: string;
  countFollower: string;
  countPost: string;
  countryCode: string;
  createdAt: string;
  email: string;
  id: string;
  name: string;
  phoneNumber: string;
  status: string;
  username: string;
}

export interface IUpdateDetailPayload {
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

export interface IUpdatePasswordPayload {
  accountId?: string | number;
  newPassword: string;
}

export interface IDeleteAccountPayload {
  accountId?: string | number;
}