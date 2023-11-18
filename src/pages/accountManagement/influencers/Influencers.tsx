import React, { useContext, useEffect, useRef, useState } from 'react';
import { Avatar, Badge, Pagination, Select, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { UserOutlined } from '@ant-design/icons';
import { useNavigate, useSearchParams } from 'react-router-dom';
import classNames from 'classnames/bind';
import { CardBackground, SectionHeaderFilter } from '~/components/specific';
import Search from 'antd/es/input/Search';
import { LoadingContext } from '~/contexts';

import { getAllAccountInfluencer } from '~/thunks/account/influencer/influencerThunk';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { selectListInfluencer, selectLoading } from '~/thunks/account/influencer/influencerSlice';
import { listPostActions } from '~/thunks/account/detailAccount/listPost/listPostSlice';
import { accountDetailActions } from '~/thunks/account/detailAccount/accountDetailSlice';

import { AdminProtectedPath, ORDER_BY, PLACEHOLDER, STATUS, Y_SCROLL } from '~/utils/enum';
import {
  addKeyToObjectInArr,
  convertNumberHasNotFractionDigit,
  defaultSortOrder,
  formattedPhoneNumber,
  handleQueryString,
  handleSetDefaultPageInUrl,
  renderStatusBadge,
} from '~/utils/helper';
import { KEY_PARAMS, LIMIT_DEFAULT, OPTIONS_STATUS, PAGE_DEFAULT, SORT_BY } from '~/utils/constants';
import styles from './Influencers.module.scss';
const cx = classNames.bind(styles);

interface DataType {
  key: React.Key;
  avatar?: string;
  name?: string;
  email?: string;
  username?: string;
  countryCode?: string;
  phoneNumber?: string;
  countFollower: number;
  countPost: number;
  status?: string;
}

interface IParamObject {
  searchKey?: string;
  status?: string;
  sort?: string;
  order?: string;
  page?: number;
  limit?: number;
}

const Influencers = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const loadingContext = useContext(LoadingContext);
  const [searchparams, setSearchParams] = useSearchParams();
  const params = Object.fromEntries([...searchparams]);
  const searchRef = useRef<any>(null);

  const loading = useAppSelector(selectLoading);
  const dataSourceAccountInfluencer = useAppSelector(selectListInfluencer);
  const { responses, pagination } = dataSourceAccountInfluencer;

  const [pageSelected, setPageSelected] = useState<number>(Number(params?.page) || PAGE_DEFAULT);
  const [limitSelected, setLimitSelected] = useState<number>(Number(params?.limit) || LIMIT_DEFAULT);
  const [statusSelected, setStatusSelected] = useState<string>(handleQueryString(OPTIONS_STATUS, params?.status, ''));
  const [valueInputSearch, setValueInputSearch] = useState<string>(params?.searchKey ? params?.searchKey : '');
  const [paramObject, setParamObject] = useState<IParamObject>({
    searchKey: params?.searchKey,
    status: params?.status,
    sort: params?.sort,
    order: params?.order,
    page: pageSelected,
    limit: limitSelected,
  });

  const columns: ColumnsType<DataType> = [
    {
      title: 'Influencer',
      dataIndex: 'name',
      ellipsis: true,
      render: (data, dataRow) => (
        <div className={cx('influencer_col-influencer')}>
          <Avatar className={cx('col_influencer-avatar')} size='large' src={dataRow?.avatar && dataRow?.avatar} icon={!dataRow?.avatar && <UserOutlined />} />
          <span className={cx('col_influencer-name')}>{data}</span>
        </div>
      ),
      width: 280,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      ellipsis: true,
      render: (data) => (data ? data : '-'),
      width: 280,
    },
    {
      title: 'Username',
      dataIndex: 'username',
      ellipsis: true,
      render: (data) => (data ? data : '-'),
      width: 180,
    },
    {
      title: 'Phone Number',
      dataIndex: 'phoneNumber',
      ellipsis: true,
      render: (data, dataRow) => (dataRow.countryCode && dataRow.phoneNumber ? formattedPhoneNumber(dataRow.countryCode, dataRow.phoneNumber) : '-'),
      width: 180,
    },
    {
      title: 'Followers',
      dataIndex: 'countFollower',
      ellipsis: true,
      render: (data) => convertNumberHasNotFractionDigit(data),
      sorter: true,
      width: 120,
      defaultSortOrder: defaultSortOrder(paramObject?.order, paramObject?.sort, SORT_BY.FOLLOWER.param),
    },
    {
      title: 'Posted',
      dataIndex: 'countPost',
      ellipsis: true,
      render: (data) => convertNumberHasNotFractionDigit(data),
      sorter: true,
      width: 120,
      defaultSortOrder: defaultSortOrder(paramObject?.order, paramObject?.sort, SORT_BY.POSTED.param),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      ellipsis: true,
      render: (item) => (
        <Badge
          status={renderStatusBadge(item, STATUS.ACTIVE.KEY, STATUS.DEACTIVATE.KEY, STATUS.BAN.KEY).badgeStatus}
          text={renderStatusBadge(item, STATUS.ACTIVE.KEY, STATUS.DEACTIVATE.KEY, STATUS.BAN.KEY).badgeText}
        />
      ),
      width: 120,
    },
  ];

  // call api
  const handleGetAllInfluencer = (payload: IParamObject) => {
    loadingContext?.show();
    dispatch(getAllAccountInfluencer(payload))
      .unwrap()
      .then((response) => {
        loadingContext?.hide();
      })
      .catch((error) => {
        loadingContext?.hide();
      });
  };

  // function
  const handleCommonChange = (newParamObject: IParamObject, currentPage?: number, currentLimit?: number) => {
    setParamObject(newParamObject);
    handleGetAllInfluencer(newParamObject);

    if (currentPage) {
      setPageSelected(currentPage);
    }

    if (currentLimit) {
      setLimitSelected(currentLimit);
    }
  };

  const handleChangeStatus = (value: string) => {
    const newParamObject = { ...paramObject, status: value, page: PAGE_DEFAULT };
    handleSetDefaultPageInUrl(KEY_PARAMS.STATUS, value, params, setSearchParams);
    handleCommonChange(newParamObject, PAGE_DEFAULT);
  };

  const handleSearch = (value: string) => {
    if (searchRef.current) {
      searchRef.current.blur();
    }
    const newParamObject = { ...paramObject, searchKey: value, page: PAGE_DEFAULT };
    handleSetDefaultPageInUrl(KEY_PARAMS.SEARCH_KEY, value, params, setSearchParams);
    handleCommonChange(newParamObject, PAGE_DEFAULT);
  };

  const handleChangeTable = (pagination: any, filters: any, sorter: any) => {
    let orderBy = '';

    switch (sorter?.order) {
      case ORDER_BY.DESC.KEY:
        orderBy = ORDER_BY.DESC.LABEL;
        break;
      case ORDER_BY.ASC.KEY:
        orderBy = ORDER_BY.ASC.LABEL;
        break;

      default:
        orderBy = '';
        break;
    }
    handleSort(sorter, orderBy);
  };

  const handleSort = (sorter: any, order: string) => {
    const { field } = sorter || {};

    let newParamObject = {};
    if (order) {
      newParamObject = { ...paramObject, sort: field === SORT_BY.FOLLOWER.key ? SORT_BY.FOLLOWER.param : SORT_BY.POSTED.param, order: order };
      setSearchParams({ ...params, sort: field === SORT_BY.FOLLOWER.key ? SORT_BY.FOLLOWER.param : SORT_BY.POSTED.param, order: order });
    } else {
      const { sort, order, ...param } = params;
      newParamObject = { ...paramObject, sort: '', order: '' };
      setSearchParams(param);
    }
    handleCommonChange(newParamObject);
  };

  const handleChangePagination = (page: number, pageSize: number) => {
    const newParamObject = { ...paramObject, page, limit: pageSize };
    setSearchParams({ ...params, page: page.toString(), limit: pageSize.toString() });

    handleCommonChange(newParamObject, page, pageSize);
  };

  //useEffect
  useEffect(() => {
    let queryObject = {};
    if (statusSelected) {
      queryObject = { ...queryObject, status: statusSelected };
    }
    setSearchParams({ ...params, ...queryObject });
    handleGetAllInfluencer(paramObject);

    return () => {
      dispatch(listPostActions.resetPosts());
      dispatch(accountDetailActions.resetAccount());
    };
  }, []);

  return (
    <div id='influencers' className='height-full'>
      <CardBackground>
        <SectionHeaderFilter>
          <Select defaultValue={statusSelected} onChange={handleChangeStatus} options={OPTIONS_STATUS} style={{ minWidth: '120px' }} />
          <Search defaultValue={valueInputSearch} placeholder={PLACEHOLDER.SEARCH_INFLUENCER} onSearch={handleSearch} className={cx('search_box')} />
        </SectionHeaderFilter>
        {!loading && (
          <>
            <Table
              columns={columns}
              dataSource={addKeyToObjectInArr(responses)}
              onChange={handleChangeTable}
              onRow={(r: any) => ({
                onClick: () => navigate(`/${AdminProtectedPath.ACCOUNT_MANAGEMENT_INFLUENCER.path}/${r.id}`),
              })}
              rowClassName={() => cx('table-row-pointer')}
              scroll={{ y: Y_SCROLL }}
              pagination={false}
            />
            {pagination?.totalItems > 0 && (
              <Pagination
                total={pagination?.totalItems}
                pageSize={pagination?.limit || LIMIT_DEFAULT}
                current={pagination?.page}
                showSizeChanger
                onChange={handleChangePagination}
                className={cx('pagination')}
                style={{ marginTop: '16px', display: 'block', textAlign: 'right' }}
              />
            )}
          </>
        )}
      </CardBackground>
    </div>
  );
};

export default Influencers;
