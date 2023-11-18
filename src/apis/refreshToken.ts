import { urlApiAuth } from '~/utils/constants';
import axiosClient from './axiosClient';

interface ParamType {
  refreshToken: string;
}

const refreshTokenApi = {
  callRefreshToken(params: ParamType) {
    const url = `${urlApiAuth.refreshToken}`;
    return axiosClient.post(url, params);
  },
};

export default refreshTokenApi;
