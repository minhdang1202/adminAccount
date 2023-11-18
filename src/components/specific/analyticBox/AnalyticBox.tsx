import React from 'react';

import styles from './AnalyticBox.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

interface IAnalyticBoxProps {
  title: string;
  Icon?: React.ElementType;
  url?: string;
  quantity?: string | number;
  currency?: string;
  hasBackground?: boolean;
}

const AnalyticBox: React.FC<IAnalyticBoxProps> = ({ title, Icon, url, quantity, currency, hasBackground }) => {
  return (
    <div id='analyticBox' className={`${cx('content')} ${hasBackground && cx('content-gray')}`}>
      <div className={cx('content_top')}>
        <div className={cx('title')}>{title}</div>
        {Icon && <Icon className={cx('icon')} />}
        {url && <img src={url} width={24} height={24} />}
      </div>
      <div className={cx('content_bottom')}>
        {currency}
        {quantity}
      </div>
    </div>
  );
};

AnalyticBox.defaultProps = {
  title: '',
  quantity: 0,
  currency: '',
  hasBackground: false,
};

export default React.memo(AnalyticBox);
