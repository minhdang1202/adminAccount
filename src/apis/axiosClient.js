import axios from 'axios';
import { baseURL, apiKey } from '~/utils/constants';
import { StorageConstants } from '~/utils/enum';
import refreshTokenApi from './refreshToken';

const axiosClient = axios.create({
  baseURL: baseURL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'x-api-key': apiKey,
  },
});

let isRefreshing = false;
let refreshSubscribers = [];

const onResponseError = async (error) => {
  const originalRequest = error.config;

  if (error.response.status === 401 && !originalRequest._retry && localStorage.getItem(StorageConstants.ACCESS_TOKEN)) {
    if (!isRefreshing) {
      isRefreshing = true;

      try {
        const refreshResponse = await refreshTokenApi.callRefreshToken({
          refreshToken: localStorage.getItem(StorageConstants.REFRESH_TOKEN),
        });

        const newAccessToken = refreshResponse.data.data.access;
        const newRefreshToken = refreshResponse.data.data.refresh;

        localStorage.setItem(StorageConstants.ACCESS_TOKEN, newAccessToken);
        localStorage.setItem(StorageConstants.REFRESH_TOKEN, newRefreshToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        const response = await axios(originalRequest);

        isRefreshing = false;

        refreshSubscribers.forEach((subscriber) => subscriber(newAccessToken));
        refreshSubscribers = [];

        return response;
      } catch (error) {
        isRefreshing = false;
        refreshSubscribers.forEach((reject) => reject(error));
        refreshSubscribers = [];

        return Promise.reject(error);
      }
    } else {
      const retrySubscribersPromise = new Promise((resolve, reject) => {
        refreshSubscribers.push((newAccessToken, error) => {
          if (newAccessToken) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            resolve(axios(originalRequest));
          } else {
            reject(error);
          }
        });
      });
      return retrySubscribersPromise;
    }
  }
  return Promise.reject(error);
};

// Add a request interceptor
axiosClient.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    const token = localStorage.getItem(StorageConstants.ACCESS_TOKEN);
    config.headers.Authorization = token ? `Bearer ${token}` : '';
    return config;
  },

  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor

axiosClient.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },

  onResponseError
);

export default axiosClient;
