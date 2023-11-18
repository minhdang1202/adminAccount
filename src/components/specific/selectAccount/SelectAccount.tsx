import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './SelectAccount.module.scss';
import { Avatar, Select, Tooltip } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { FIRST_SELECT_INFLUENCER, PLACEHOLDER } from '~/utils/enum';
import { OptionItem, Props } from '~/data/selectAccount';
const { Option } = Select;

const cx = classNames.bind(styles);

const SelectAccount = ({ onChange, dataOptions, placeholder, loadMoreData, hasMore, loading, setLoading, labelAll }: Props) => {
  const options: OptionItem[] = dataOptions;

  const handlePopupScroll = (e: any) => {
    const { target } = e;
    const { scrollTop, clientHeight, scrollHeight } = target;

    const scrollPercentage = (100 * scrollTop) / (scrollHeight - clientHeight);

    if (scrollPercentage > 95 && !loading && hasMore) {
      setLoading?.(true);
      loadMoreData?.();
    }
  };

  return (
    <Select
      id='selectAccount'
      placeholder={placeholder}
      optionLabelProp='label'
      onPopupScroll={handlePopupScroll}
      style={{ width: 200 }}
      onChange={onChange}
      defaultValue={labelAll}
    >
      <Option value={FIRST_SELECT_INFLUENCER.value} label={FIRST_SELECT_INFLUENCER.label}>
        <div className={cx('select_account-all')}>{FIRST_SELECT_INFLUENCER.label}</div>
      </Option>
      {options?.map((option, idx) => {
        return (
          <Option key={option?.id} value={option.id} label={option.username}>
            <Tooltip
              placement='right'
              title={
                <>
                  {option.name} <span>{option.username ? `( ${option.username} )` : ''}</span>
                </>
              }
            >
              {option.avatar ? (
                <Avatar className={cx('select_account-avatar')} src={option.avatar} size={32} />
              ) : (
                <Avatar className={cx('select_account-avatar')} icon={<UserOutlined />} size={32} />
              )}
              {option.name} <span className={cx('userName')}>{option.username ? `( ${option.username} )` : ''}</span>
            </Tooltip>
          </Option>
        );
      })}
    </Select>
  );
};

SelectAccount.defaultProps = {
  labelAll: '',
  onChange: () => {},
  dataOptions: [],
  loadData: () => {},
  selected: '',
  placeholder: PLACEHOLDER.DEFAULT_SELECT,
  loadMoreData: () => {},
  loading: false,
};

export default SelectAccount;
