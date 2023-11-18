import { urlApiPost } from '~/utils/constants';
import axiosClient from './axiosClient';

interface IParamPostType {
  searchKey?: string;
  reportStatus?: string;
  accountId?: number;
  page?: number;
  limit?: number;
}

const dataAnalysisApi = {
  getPosts(params: IParamPostType) {
    let url = `${urlApiPost.getPost}?`;

    if (params?.searchKey) {
      url += `searchKey=${params?.searchKey}&`;
    }

    if (params?.reportStatus) {
      url += `reportStatus=${params?.reportStatus}&`;
    }

    if (params?.accountId) {
      url += `accountId=${params?.accountId}&`;
    }

    if (params?.page && params?.limit) {
      url += `page=${params?.page}&limit=${params?.limit}&`;
    }

    return axiosClient.get(url);
  },
};

export default dataAnalysisApi;
