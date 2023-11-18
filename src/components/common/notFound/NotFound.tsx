import { Button, Layout, Result } from 'antd';
import classNames from 'classnames/bind';
import { useNavigate } from 'react-router-dom';

import { ExactPath } from '~/utils/enum';
import styles from './NotFound.module.scss';

type Props = {};
const cx = classNames.bind(styles);

const NotFoundPage = (props: Props) => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate(ExactPath.main);
  };

  return (
    <Layout className={cx('main_layout')}>
      <div className={cx('main_content')}>
        <Result
          status='404'
          title='404'
          subTitle='Sorry, the page you visited does not exist.'
          extra={
            <Button type='primary' onClick={handleGoHome}>
              Back Home
            </Button>
          }
        />
      </div>
    </Layout>
  );
};

export default NotFoundPage;
