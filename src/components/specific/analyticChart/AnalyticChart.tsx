import React, { useEffect, useMemo, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import styles from './AnalyticChart.module.scss';
import classNames from 'classnames/bind';
import { CategoryScale } from 'chart.js';
import { Chart } from 'chart.js/auto';
import { barChartAnalyticConfig, labelMonthOfChart } from '~/utils/constants';
const cx = classNames.bind(styles);

Chart.register(CategoryScale);
export interface IAnalyticChartProps {
  data: any[];
  title: string;
  label: string;
}
const AnalyticChart: React.FC<IAnalyticChartProps> = ({ data, title, label }) => {
  const stateConfig = useMemo(() => {
    return barChartAnalyticConfig({ data, title, label });
  }, [data, title, label]);

  return <Bar className={cx('chart-analytic')} {...stateConfig} />;
};

AnalyticChart.defaultProps = {
  data: [],
  title: '',
  label: '',
};

export default React.memo(AnalyticChart);
