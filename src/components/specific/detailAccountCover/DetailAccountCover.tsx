import React from 'react';

import { Avatar, Divider } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import classNames from 'classnames/bind';
import { DEFAULT_ROLE, roleAccountManagement, typeOfRole } from '~/utils/constants';
import { checkSingularOrPlural, convertNumberHasNotFractionDigit } from '~/utils/helper';
import styles from './DetailAccountCover.module.scss';
const cx = classNames.bind(styles);

interface IDetailAccountCoverProps {
  role?: typeOfRole;
  avatarUrl?: string;
  coverUrl?: string;
  followingNumber?: number;
  followerNumber?: number;
  postNumber?: number;
}

const DetailAccountCover: React.FC<IDetailAccountCoverProps> = (props) => {
  const { role, avatarUrl, coverUrl, followingNumber, followerNumber, postNumber } = props;
  return (
    <div id='detailAccountCover' className={cx('cover_container')}>
      {coverUrl ? <img className={cx('cover_background-img')} src={coverUrl} alt='' /> : <div className={cx('cover_background-img')}></div>}
      <div className={cx('cover_avatar')}>
        {avatarUrl ? <Avatar className={cx('cover_avatar-img')} src={avatarUrl} size={90} /> : <Avatar className={cx('cover_avatar-img')} icon={<UserOutlined />} size={90} />}
        {role === roleAccountManagement.FAN ? (
          <div className={cx('cover_quantity')}>
            {convertNumberHasNotFractionDigit(followingNumber)} Following{checkSingularOrPlural(followingNumber)}
          </div>
        ) : (
          <div className={cx('cover_quantity')}>
            {convertNumberHasNotFractionDigit(followerNumber)} Follower{checkSingularOrPlural(followerNumber)} <Divider type='vertical' className={cx('divider')} />{' '}
            {convertNumberHasNotFractionDigit(postNumber)} Post{checkSingularOrPlural(postNumber)}
          </div>
        )}
      </div>
    </div>
  );
};

DetailAccountCover.defaultProps = {
  role: DEFAULT_ROLE,
  avatarUrl: '',
  coverUrl: '',
  followingNumber: 0,
  followerNumber: 0,
  postNumber: 0,
};

export default React.memo(DetailAccountCover);
