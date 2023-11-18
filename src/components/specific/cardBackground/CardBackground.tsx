import React from 'react';
import classNames from 'classnames/bind';

// Styles
import styles from './CardBackground.module.scss';

type Props = {
  children: React.ReactNode;
};

const cx = classNames.bind(styles);

const CardBackground = ({ children }: Props) => {
  return (
    <div id='cardBackground' className={cx('card_container')}>
      {children}
    </div>
  );
};

export default React.memo(CardBackground);
