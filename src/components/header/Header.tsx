import { SettingOutlined } from '@ant-design/icons';
import { Breadcrumb, Dropdown, MenuProps, theme } from 'antd';
import { Header } from 'antd/es/layout/layout';
import classNames from 'classnames/bind';
import { useLayoutEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { authActions } from '~/thunks/auth/authSlice';
import { icLogout } from '~/utils/icon.constants';
import styles from './Header.module.scss';
import { AdminProtectedPath } from '~/utils/enum';

const cx = classNames.bind(styles);
type AdminProtectedPathType = typeof AdminProtectedPath;
interface IUser {
  email: string;
  language: string;
  role: string;
}

const HeaderLayout = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { influencerId, fanId } = useParams();

  const [user, setUser] = useState<IUser>();
  const [open, setOpen] = useState(false);

  const handleCapitalizeTitleBreakCrumbInPath = (param: any) => {
    const foundKey = Object.keys(AdminProtectedPath).find((key) => AdminProtectedPath[key as keyof AdminProtectedPathType]?.key === param);
    if (!foundKey) {
      return '';
    }
    const foundObject = AdminProtectedPath[foundKey as keyof AdminProtectedPathType];
    if (!foundObject) {
      return '';
    }
    return foundObject?.title;
  };

  const breadCrumbView = () => {
    const { pathname } = location;
    const pathnames = pathname.split('/').filter((item) => item);

    const pathnamesObj = pathnames.map((item) => {
      return { title: handleCapitalizeTitleBreakCrumbInPath(item) };
    });
    const pathnamesObjTrim = pathnamesObj.filter((item) => item.title);
    if (influencerId) {
      pathnamesObjTrim.push({ title: influencerId });
    }
    if (fanId) {
      pathnamesObjTrim.push({ title: fanId });
    }

    return <Breadcrumb items={pathnamesObjTrim} />;
  };

  const items: MenuProps['items'] = [
    {
      label: <div>{`Hello, ${user?.email ? user?.email : 'Admin'}`}</div>,
      key: '0',
    },
    {
      type: 'divider',
    },
    {
      label: (
        <div className={cx('header_logout')}>
          <img className={cx('header_logout-icon')} alt='logout' src={icLogout} /> Logout
        </div>
      ),
      key: 'logout',
    },
  ];

  const handleLogout = () => {
    dispatch(authActions.handleLogout());
    navigate('/login');
  };
  const handleMenuClick: MenuProps['onClick'] = (e) => {
    if (e.key === 'logout') {
      setOpen(false);
      handleLogout();
    }
  };
  const handleOpenChange = (flag: boolean) => {
    setOpen(flag);
  };

  useLayoutEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
  }, []);

  return (
    <Header style={{ background: colorBgContainer }} className={cx('adminHeader')}>
      <div>{breadCrumbView()}</div>
      <div className={cx('header_action')}>
        <Dropdown
          menu={{
            items,
            onClick: handleMenuClick,
          }}
          onOpenChange={handleOpenChange}
          open={open}
          trigger={['click']}
          overlayClassName={cx('dropdown-container')}
        >
          <a onClick={(e) => e.preventDefault()} className={cx('header_dropdown')}>
            <SettingOutlined className={cx('header_dropdown-icon')} />
          </a>
        </Dropdown>
      </div>
    </Header>
  );
};

export default HeaderLayout;
