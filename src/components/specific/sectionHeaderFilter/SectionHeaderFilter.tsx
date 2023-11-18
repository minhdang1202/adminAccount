import React from 'react';
import classNames from 'classnames/bind';

// Styles
import styles from './SectionHeaderFilter.module.scss';

type Props = {
  children: React.ReactNode;
};

const cx = classNames.bind(styles);

const SectionHeaderFilter = ({ children }: Props) => {
  return (
    <div id='sectionHeaderFilter' className={cx('section_header')}>
      {children}
    </div>
  );
};

export default React.memo(SectionHeaderFilter);
