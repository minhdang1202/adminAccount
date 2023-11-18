// Libs
import { useEffect } from 'react';
import { Button, Card, Form, Input } from 'antd';
import classNames from 'classnames/bind';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '~/redux/hooks';
import { handleLogin } from '~/thunks/auth/authThunk';
// Thunks
import { authActions, selectLoading } from '~/thunks/auth/authSlice';
// Shares
import { ERROR_CODE, ERROR_MESSAGE, ExactPath, Roles, StorageConstants } from '~/utils/enum';
import { LoginPayload } from '~/data/auth';
import styles from './Login.module.scss';
import logo from '~/assets/imgs/logo-full.jpg';
import packageJson from '../../../package.json';
import { handleResponseError } from '~/utils/helper';
import { useSelector } from 'react-redux';

import loginBannerImg from '~/assets/imgs/login-banner.svg';

const cx = classNames.bind(styles);

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const accessToken = localStorage.getItem(StorageConstants.ACCESS_TOKEN)!;
  const [form] = Form.useForm();
  const loading = useSelector(selectLoading);

  /**
   * UseEffect Block
   */

  useEffect(() => {
    if (accessToken) {
      navigate(ExactPath.main);
    } else {
      dispatch(authActions.handleLogout());
    }
  }, [navigate]);

  /**
   * Functions Block
   */
  const handleLoginForm = (values: LoginPayload) => {
    dispatch(handleLogin(values))
      .unwrap()
      .then((resp) => {
        if (resp === Roles.ADMIN) {
          navigate(ExactPath.main);
        }
      })
      .catch((err) => {
        if (err?.code === ERROR_CODE.ERR_BAD_REQUEST) {
          handleResponseError(err, ERROR_MESSAGE.BAD_REQUEST);
        } else {
          handleResponseError(err, ERROR_MESSAGE.OTHER);
        }
        console.log(`err: => ${JSON.stringify(err, null, 2)}`);
        dispatch(authActions.handleLogout());
      });
  };

  return (
    <>
      {!accessToken && (
        <div className={cx('main_layout')}>
          <div className={cx('layout_login_left')}>
            <img src={loginBannerImg} alt='img-bg-football' />
          </div>
          <div className={cx('login_form')}>
            <Card className={cx('login_form-card')}>
              <Form name='basic' form={form} onFinish={handleLoginForm} layout='vertical' size='large'>
                <Form.Item>
                  <div className={cx('login_form-logo')}>
                    <img src={logo} alt='logo' className={cx('login_form-logo-img')} />
                  </div>
                  <h1 className={cx('login_form-title')}>Welcome to Snapfans</h1>
                  <p className={cx('login_form-desc')}>Statistics and management</p>
                </Form.Item>

                <Form.Item
                  label='Email'
                  name='email'
                  rules={[
                    {
                      type: 'email',
                      message: 'Invalid email format',
                    },
                    {
                      required: true,
                      message: 'Email is required',
                    },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item label='Password' name='password' rules={[{ required: true, message: 'Password is required' }]}>
                  <Input.Password />
                </Form.Item>

                <Button loading={loading} type='primary' htmlType='submit' className={cx('btn_login')}>
                  Login
                </Button>
              </Form>
            </Card>

            <div className={cx('login_form-version')}>{packageJson.version}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
