import React from 'react';
import classNames from 'classnames/bind';

// Styles
import styles from './CardLayout.module.scss';

type CardLayoutProps = {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
};

const cx = classNames.bind(styles);

const CardLayout = ({ children, style, className }: CardLayoutProps) => {
  return (
    <div id='cardLayout' className={cx('card-layout_container', className)} style={style}>
      {children}
    </div>
  );
};

export default React.memo(CardLayout);
