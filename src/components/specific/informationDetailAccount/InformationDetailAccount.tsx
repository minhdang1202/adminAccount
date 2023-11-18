import React from 'react';

import { UserOutlined } from '@ant-design/icons';
import { Avatar, Divider, Space, Switch } from 'antd';
import classNames from 'classnames/bind';
import { roleAccountManagement } from '~/utils/constants';
import { checkSingularOrPlural, convertNumberHasNotFractionDigit } from '~/utils/helper';
import styles from './InformationDetailAccount.module.scss';
const cx = classNames.bind(styles);
interface IInformationProps {
  role: 'fan' | 'influencer';
  avatarUrl?: string;
  name?: string;
  email?: string;
  phone?: string;
  followingNumber?: number;
  followerNumber?: number;
  isActive?: boolean;
  shortDescription?: string;
  postNumber?: number;
  userName?: string;
  countryCode?: string;
  onChangeStatus?: () => void;
  showModal?: boolean;
}

const InformationDetailAccount: React.FC<IInformationProps> = (props) => {
  const { role, avatarUrl, name, email, phone, followingNumber, followerNumber, isActive, shortDescription, postNumber, userName, countryCode, onChangeStatus, showModal } = props;

  const handleChangeStatus = () => {
    if (onChangeStatus) {
      onChangeStatus();
      return;
    }
  };

  return (
    <div id='informationDetailAccount' className={cx('content')}>
      <div className={cx('content_left')}>
        {avatarUrl ? <Avatar src={avatarUrl} size={64} /> : <Avatar icon={<UserOutlined />} size={64} />}
        <div className={cx('information')}>
          <Space direction='vertical' size={4}>
            <div className={cx('name')}>
              {name} <span className={cx('userName')}> {userName ? `( ${userName} )` : ''}</span>
            </div>
            <div className={cx('email')}>{email}</div>
            {phone && (
              <div className={cx('phone')}>
                {countryCode ? `(${countryCode})` : ''} {phone}
              </div>
            )}
            {role === roleAccountManagement.FAN ? (
              <div className={cx('quantity')}>
                {convertNumberHasNotFractionDigit(followingNumber)} Following{checkSingularOrPlural(followingNumber)}
              </div>
            ) : (
              <div className={cx('quantity')}>
                {convertNumberHasNotFractionDigit(followerNumber)} Follower{checkSingularOrPlural(followerNumber)} <Divider type='vertical' className={cx('divider')} />{' '}
                {convertNumberHasNotFractionDigit(postNumber)} Post{checkSingularOrPlural(postNumber)}
              </div>
            )}
            <div className={cx('shortDescription')}>{shortDescription}</div>
          </Space>
        </div>
      </div>
      <div className={cx('status')}>
        <span className={cx('label')}>Active</span>
        <Switch checked={isActive} onChange={handleChangeStatus} disabled={showModal} />
      </div>
    </div>
  );
};

InformationDetailAccount.defaultProps = {
  role: 'fan',
  avatarUrl: '',
  name: '',
  email: '',
  phone: '',
  followingNumber: 0,
  followerNumber: 0,
  isActive: true,
  shortDescription: '',
  postNumber: 0,
  userName: '',
  countryCode: '',
  onChangeStatus: () => {},
  showModal: false,
};

export default React.memo(InformationDetailAccount);
