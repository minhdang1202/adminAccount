import React from 'react';
import classNames from 'classnames/bind';
import { Layout, theme } from 'antd';
import packageJson from '../../package.json';

import styles from './LayoutPanel.module.scss';
import { HeaderLayout, SideBar } from '~/components';
import { Content, Footer } from 'antd/es/layout/layout';
import { Outlet } from 'react-router-dom';

const cx = classNames.bind(styles);

const LayoutPanel = () => {
  const currentYear = new Date().getFullYear();

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout className={cx('adminLayout_container')}>
      <SideBar />
      <Layout className={cx('adminLayout_info')}>
        <HeaderLayout />
        <Content className={cx('adminLayout_content')}>
          <div className={cx('adminLayout_content_detail')}>
            <Outlet />
          </div>
        </Content>
        <Footer className={cx('adminFooter')}>
          <div>&copy; {currentYear} Snaps. All rights reserved.</div>
          <div className={cx('version')}>{`Version ${packageJson.version}`}</div>
        </Footer>
      </Layout>
    </Layout>
  );
};

export default LayoutPanel;
