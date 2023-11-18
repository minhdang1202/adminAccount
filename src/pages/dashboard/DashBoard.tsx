import classNames from 'classnames/bind';
import { useContext, useEffect, useState } from 'react';

import { Select } from 'antd';
import { AnalyticBox, AnalyticChart } from '~/components/specific';
import { LoadingContext } from '~/contexts';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { selectBoxAnalysis } from '~/thunks/home/boxAnalysis/boxAnalysisSlice';
import { getBoxAnalysis } from '~/thunks/home/boxAnalysis/boxAnalysisThunk';
import { chartAnalysisActions, selectChartAnalysis, selectLoadingChartAnalysis } from '~/thunks/home/chartAnalysis/chartAnalysisSlice';
import { getDataChart } from '~/thunks/home/chartAnalysis/chartAnalysisThunk';
import { analyticType, analyticTypeOptions } from '~/utils/constants';
import { LABEL_CHART_ANALYSIS } from '~/utils/enum';
import { convertNumberHasNotFractionDigit, getListCurrentYear } from '~/utils/helper';
import { icSnapGold, icUserGold } from '~/utils/icon.constants';
import styles from './DashBoard.module.scss';
import { IParamDataChart } from '~/apis/home';

const cx = classNames.bind(styles);

interface ITypeSelect {
  label: string;
  value: string;
}

const DashBoard = () => {
  const dispatch = useAppDispatch();
  const loadingContext = useContext(LoadingContext);
  const boxAnalysis = useAppSelector(selectBoxAnalysis);
  const loading = useAppSelector(selectLoadingChartAnalysis);
  const { totalSnapPurchase, totalSnapUsed, countFanAccount, countInfluencerAccount } = boxAnalysis;
  const chartAnalysis = useAppSelector(selectChartAnalysis);
  const { chart: dataChart } = chartAnalysis;
  const OPTION_YEAR = getListCurrentYear();

  const [typeChartSelected, setTypeChartSelected] = useState<ITypeSelect>(analyticTypeOptions[0]);
  const [yearSelected, setYearSelected] = useState<string>(OPTION_YEAR[0].value);
  const [labelChart, setLabelChart] = useState<string>(LABEL_CHART_ANALYSIS.ACCOUNT);

  const handleChangeTypeChart = (value: string) => {
    const objValue = analyticTypeOptions.find((type) => type.value === value);
    if (!objValue) {
      return;
    }
    setTypeChartSelected(objValue);
    if (value === analyticType.FANS.value || value === analyticType.INFLUENCERS.value) {
      setLabelChart(LABEL_CHART_ANALYSIS.ACCOUNT);
    } else {
      setLabelChart(LABEL_CHART_ANALYSIS.SNAP);
    }
    handleGetDataChartAnalysis({ type: value, year: yearSelected });
  };

  const handleChangeYear = (value: string) => {
    setYearSelected(value);
    handleGetDataChartAnalysis({ type: typeChartSelected.value, year: value });
  };

  const handleConvertDataChart = (data: any[]) => {
    if (!data || data?.length === 0) return [];

    const dataConvert = data.map((item: any) => ({
      value: item?.value,
    }));

    return dataConvert;
  };

  const handleGetBoxAnalysis = () => {
    loadingContext?.show();
    dispatch(getBoxAnalysis())
      .unwrap()
      .then(() => {
        loadingContext?.hide();
      })
      .catch(() => {
        loadingContext?.hide();
      });
  };

  const handleGetDataChartAnalysis = (params: IParamDataChart) => {
    loadingContext?.show();
    dispatch(getDataChart(params))
      .unwrap()
      .catch(() => {
        loadingContext?.hide();
      })
      .then(() => {
        loadingContext?.hide();
      });
  };

  useEffect(() => {
    handleGetBoxAnalysis();
    handleGetDataChartAnalysis({ type: typeChartSelected.value, year: yearSelected });

    return () => {
      dispatch(chartAnalysisActions.resetStateChartAnalysis());
    };
  }, []);

  return (
    <div className={cx('content')}>
      <div className={cx('content_analytic')}>
        <AnalyticBox title={analyticType.FANS.label} quantity={convertNumberHasNotFractionDigit(countFanAccount)} url={icUserGold} />
        <AnalyticBox title={analyticType.INFLUENCERS.label} quantity={convertNumberHasNotFractionDigit(countInfluencerAccount)} url={icUserGold} />
        <AnalyticBox title={analyticType.SNAPS_PURCHASED.label} quantity={convertNumberHasNotFractionDigit(totalSnapPurchase)} url={icSnapGold} />
        <AnalyticBox title={analyticType.SNAP_USED.label} quantity={convertNumberHasNotFractionDigit(totalSnapUsed)} url={icSnapGold} />
      </div>
      <div className={cx('content_chart')}>
        <div className={cx('content_chart-selection')}>
          <Select onChange={handleChangeTypeChart} className={cx('type_chart-select')} value={typeChartSelected.value} options={analyticTypeOptions} />
          <Select onChange={handleChangeYear} className={cx('year-select')} value={yearSelected} options={OPTION_YEAR} />
        </div>
        <div className={cx('content_char-bar')}>{!loading && <AnalyticChart title={typeChartSelected.label} label={labelChart} data={handleConvertDataChart(dataChart)} />}</div>
      </div>
    </div>
  );
};

export default DashBoard;
