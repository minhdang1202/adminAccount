import React from 'react';
import { Empty } from 'antd';
import classNames from 'classnames/bind';

import styles from './NoData.module.scss';

const cx = classNames.bind(styles);

const NoData = () => {
  return (
    <div id='noData' className={cx('empty-data-container')}>
      <Empty className={cx('empty-data')} />
    </div>
  );
};

export default React.memo(NoData);
