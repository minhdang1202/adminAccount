import { urlApiInfluencer } from '~/utils/constants';
import axiosClient from './axiosClient';

const accountInfluencerApi = {
  getAllInfluencer(params: any) {
    let url = `${urlApiInfluencer.getAll}?`;
    if (params?.searchKey) {
      url += `searchKey=${params?.searchKey}&`;
    }

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

    return axiosClient.get(url);
  },
};

export default accountInfluencerApi;
