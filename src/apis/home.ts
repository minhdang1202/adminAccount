import { urlApiHome } from '~/utils/constants';
import axiosClient from './axiosClient';

export interface IParamDataChart {
  type: string;
  year: string;
}

export const homeApi = {
  getBoxAnalysis: () => {
    const url = urlApiHome.getBoxAnalysis;

    return axiosClient.get(url);
  },

  getDataChart: (params: IParamDataChart) => {
    const { type, year } = params;
    const url = `${urlApiHome.getDataChart}type=${type}&year=${year}`;

    return axiosClient.get(url);
  },
};
