import React from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import classNames from 'classnames/bind';

import styles from './LoadingInfiniteScroll.module.scss';

const cx = classNames.bind(styles);

const LoadingInfiniteScroll = () => {
  const loadingIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

  return (
    <div id='loadingInfiniteScroll' className={cx('loading-infinity-scroll')}>
      <Spin indicator={loadingIcon} />
    </div>
  );
};

export default React.memo(LoadingInfiniteScroll);
