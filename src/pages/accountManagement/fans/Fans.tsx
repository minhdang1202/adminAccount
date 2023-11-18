import React, { useContext, useEffect, useRef, useState } from 'react';
import { Badge, Pagination, Select, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import Search from 'antd/es/input/Search';
import { useNavigate, useSearchParams } from 'react-router-dom';
import classNames from 'classnames/bind';
import { AvatarColumn, CardBackground, SectionHeaderFilter } from '~/components/specific';
import NoData from '~/components/specific/noData/NoData';

import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { getAllAccountFan } from '~/thunks/account/fan/fanThunk';
import { selectListAccountFan, selectLoading } from '~/thunks/account/fan/fanSlice';
import { LoadingContext } from '~/contexts/LoadingContext';
import { listPostActions } from '~/thunks/account/detailAccount/listPost/listPostSlice';
import { accountDetailActions } from '~/thunks/account/detailAccount/accountDetailSlice';

import { KEY_PARAMS, LIMIT_DEFAULT, OPTIONS_STATUS, PAGE_DEFAULT, TYPE_ORDER, TYPE_ORDER_ASC, TYPE_ORDER_DESC } from '~/utils/constants';
import {
  addKeyToObjectInArr,
  convertNumberHasNotFractionDigit,
  defaultSortOrder,
  formattedPhoneNumber,
  handleQueryString,
  handleSetDefaultPageInUrl,
  renderStatusBadge,
} from '~/utils/helper';
import { STATUS, AdminProtectedPath, Y_SCROLL, ORDER_BY, SORT_COLUMN_BY, PLACEHOLDER } from '~/utils/enum';

import styles from './Fans.module.scss';

const cx = classNames.bind(styles);

interface DataType {
  key: React.Key;
  avatar?: string;
  name?: string;
  email?: string;
  username?: string;
  countryCode?: string;
  phoneNumber?: string;
  countFollowing: number;
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

const Fans: React.FC = () => {
  const loadingContext = useContext(LoadingContext);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const searchRef = useRef<any>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const params = Object.fromEntries([...searchParams]);

  const dataSourceAccountFans = useAppSelector(selectListAccountFan);
  const loading = useAppSelector(selectLoading);
  const { responses, pagination } = dataSourceAccountFans;

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
      title: 'Fan',
      dataIndex: 'name',
      ellipsis: true,
      render: (data, dataRow) => (data ? <AvatarColumn src={dataRow?.avatar} text={data} /> : '-'),
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
      title: 'Following',
      dataIndex: 'countFollowing',
      ellipsis: true,
      sorter: true,
      render: (data) => convertNumberHasNotFractionDigit(data),
      defaultSortOrder: defaultSortOrder(paramObject?.order, paramObject?.sort, SORT_COLUMN_BY.FOLLOWING),
      width: 120,
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

  //call api
  const handleGetAllAccount = (params: any) => {
    loadingContext?.show();
    dispatch(getAllAccountFan(params))
      .unwrap()
      .then((response) => {
        loadingContext?.hide();
      })
      .catch((error) => {
        loadingContext?.hide();
      });
  };

  const handleCommonChange = (newParamObject: IParamObject, currentPage?: number, currentLimit?: number) => {
    setParamObject(newParamObject);
    handleGetAllAccount(newParamObject);

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
    handleSortFollowing(orderBy);
  };

  const handleSortFollowing = (order: any) => {
    let newParamObject = {};
    if (order) {
      newParamObject = { ...paramObject, sort: SORT_COLUMN_BY.FOLLOWING, order: order };
      setSearchParams({ ...params, sort: SORT_COLUMN_BY.FOLLOWING, order: order });
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
    handleGetAllAccount(paramObject);

    return () => {
      dispatch(listPostActions.resetPosts());
      dispatch(accountDetailActions.resetAccount());
    };
  }, []);

  return (
    <div id='fans' className={cx('fans')}>
      <CardBackground>
        <SectionHeaderFilter>
          <Select defaultValue={statusSelected} onChange={handleChangeStatus} options={OPTIONS_STATUS} style={{ minWidth: '120px' }} />
          <Search placeholder={PLACEHOLDER.SEARCH_FANS} defaultValue={valueInputSearch} onSearch={handleSearch} ref={searchRef} className={cx('search_box')} />
        </SectionHeaderFilter>
        {!loading && (
          <>
            <Table
              columns={columns}
              dataSource={addKeyToObjectInArr(responses)}
              onChange={handleChangeTable}
              onRow={(r: any) => ({
                onClick: () => navigate(`/${AdminProtectedPath.ACCOUNT_MANAGEMENT_FAN.path}/${r.id}`),
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

export default React.memo(Fans);
