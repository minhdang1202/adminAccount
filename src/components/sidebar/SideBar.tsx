import { BarChartOutlined, DatabaseOutlined, DollarOutlined, UsergroupDeleteOutlined } from '@ant-design/icons';
import { Menu, MenuProps, theme } from 'antd';
import Sider from 'antd/es/layout/Sider';
import classNames from 'classnames/bind';
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AdminProtectedPath } from '~/utils/enum';
import { getSideNav } from '~/utils/helper';
import { imgLogo, imgLogoFull } from '~/utils/image.constants';
import styles from './SideBar.module.scss';

const cx = classNames.bind(styles);

type MenuItem = Required<MenuProps>['items'][number];

function getItem(label: React.ReactNode, key: React.Key, icon?: React.ReactNode, children?: MenuItem[]): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const SideBar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const locations = useLocation().pathname.split('/');

  const [openKeys, setOpenKeys] = useState<string[]>(() => {
    if (locations.includes(AdminProtectedPath.ACCOUNT_MANAGEMENT.key)) {
      return [AdminProtectedPath.ACCOUNT_MANAGEMENT.key];
    }
    if (locations.includes(AdminProtectedPath.FINALCIAL_MANAGEMENT.key)) {
      return [AdminProtectedPath.FINALCIAL_MANAGEMENT.key];
    }
    return [];
  });

  const items: MenuItem[] = [
    getItem(<Link to={'' + AdminProtectedPath.DASHBOARD.path}>{AdminProtectedPath.DASHBOARD.title}</Link>, AdminProtectedPath.DASHBOARD.key, <DatabaseOutlined />),
    getItem(AdminProtectedPath.ACCOUNT_MANAGEMENT.title, AdminProtectedPath.ACCOUNT_MANAGEMENT.key, <UsergroupDeleteOutlined />, [
      getItem(
        <Link to={'/' + AdminProtectedPath.ACCOUNT_MANAGEMENT_FAN.path}>{AdminProtectedPath.ACCOUNT_MANAGEMENT_FAN.title}</Link>,
        AdminProtectedPath.ACCOUNT_MANAGEMENT_FAN.key
      ),
      getItem(
        <Link to={'/' + AdminProtectedPath.ACCOUNT_MANAGEMENT_INFLUENCER.path}>{AdminProtectedPath.ACCOUNT_MANAGEMENT_INFLUENCER.title}</Link>,
        AdminProtectedPath.ACCOUNT_MANAGEMENT_INFLUENCER.key
      ),
    ]),
    getItem(AdminProtectedPath.FINALCIAL_MANAGEMENT.title, AdminProtectedPath.FINALCIAL_MANAGEMENT.key, <DollarOutlined />, [
      getItem(
        <Link to={'/' + AdminProtectedPath.FINALCIAL_MANAGEMENT_ISSUE_SNAP.path}>{AdminProtectedPath.FINALCIAL_MANAGEMENT_ISSUE_SNAP.title}</Link>,
        AdminProtectedPath.FINALCIAL_MANAGEMENT_ISSUE_SNAP.key
      ),
      getItem(
        <Link to={'/' + AdminProtectedPath.FINALCIAL_MANAGEMENT_REVENUE_INFLUENCER.path}>{AdminProtectedPath.FINALCIAL_MANAGEMENT_REVENUE_INFLUENCER.title}</Link>,
        AdminProtectedPath.FINALCIAL_MANAGEMENT_REVENUE_INFLUENCER.key
      ),
    ]),
    getItem(<Link to={'' + AdminProtectedPath.DATA_ANALYSIS.path}>{AdminProtectedPath.DATA_ANALYSIS.title}</Link>, AdminProtectedPath.DATA_ANALYSIS.key, <BarChartOutlined />),
  ];

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const handleOpenChange = (keys: string[]) => {
    setOpenKeys(keys);
  };

  return (
    <div id='sidebar'>
      <Sider width={255} style={{ background: colorBgContainer }} collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)} className={cx('sidebar_container')}>
        <div className={cx('adminLayout_logo')}>
          <Link to='/'>{collapsed ? <img src={imgLogo} alt='logo' height={48} /> : <img src={imgLogo} alt='logo' height={48} />}</Link>
        </div>
        <Menu mode='inline' openKeys={openKeys} onOpenChange={handleOpenChange} defaultSelectedKeys={[getSideNav(locations).selectedKey]} items={items} />
      </Sider>
    </div>
  );
};

export default SideBar;
