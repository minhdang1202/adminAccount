import { LIMIT_DEFAULT, PAGE_DEFAULT, urlApiPost } from '~/utils/constants';
import axiosClient from './axiosClient';

interface IParamPostDetail {
  id: string;
  page?: number;
  limit?: number;
}

export interface IParamRemovePost {
  postId: string;
}

export const postApi = {
  getPostDetail(payload: IParamPostDetail) {
    const { id, page = PAGE_DEFAULT, limit = LIMIT_DEFAULT } = payload;
    let url = `${urlApiPost.getDetail}${id}?page=${page}&limit=${limit}`;

    return axiosClient.get(url);
  },

  removePostDetail(params: IParamRemovePost) {
    let url = urlApiPost.removeDetail;

    return axiosClient.post(url, params);
  },
};
