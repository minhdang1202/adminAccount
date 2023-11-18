import { useContext } from 'react';
import { Button } from 'antd';
import classNames from 'classnames/bind';
// Contexts
import { LoadingContext } from '~/contexts/LoadingContext';
// Styles
import styles from './HelloGreenify.module.scss';

type Props = {};

const cx = classNames.bind(styles);

const HelloGreenify = (props: Props) => {
  const loadingContext = useContext(LoadingContext);

  const mockToggleLoading = () => {
    loadingContext?.show();
    setTimeout(() => {
      loadingContext?.hide();
    }, 1500);
  };

  return (
    <>
      <div className={cx('hello_world')}>Hi, GreenifyVN</div>
      <Button type='link' onClick={mockToggleLoading}>
        Toggle Loading
      </Button>
    </>
  );
};

export default HelloGreenify;
