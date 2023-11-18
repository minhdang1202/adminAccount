import React from 'react';
import classNames from 'classnames/bind';
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Tooltip } from 'antd';

// Styles
import styles from './AvatarColumn.module.scss';

type Props = {
  src?: string;
  text?: string;
};

const cx = classNames.bind(styles);

const AvatarColumn = ({ src, text }: Props) => {
  return (
    <div id='avatarColumn' className={cx('avatar-column_layout')}>
      <Avatar size='large' src={src && src} icon={!src && <UserOutlined />} />
      {text && (
        <Tooltip title={text}>
          <span className={cx('fans_fan-name')}>{text}</span>
        </Tooltip>
      )}
    </div>
  );
};

AvatarColumn.defaultProps = {
  src: <UserOutlined />,
  text: '',
};
export default React.memo(AvatarColumn);
