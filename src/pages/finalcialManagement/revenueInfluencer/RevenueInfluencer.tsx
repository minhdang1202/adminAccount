import { DollarOutlined } from '@ant-design/icons';
import { Badge, Modal, Pagination, Select, Tooltip } from 'antd';
import Search from 'antd/es/input/Search';
import Table, { ColumnsType } from 'antd/es/table';
import classNames from 'classnames/bind';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AvatarColumn, CardBackground, CardLayout, SectionHeaderFilter } from '~/components/specific';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import {
  BADGE_STATUS_ERROR,
  BADGE_STATUS_SUCCESS,
  KEY_PARAMS,
  LIMIT_DEFAULT,
  MODAL_CONFIRM_TITLE,
  OPTIONS_MONTH,
  OPTION_STATUS_PAYOUT,
  PAGE_DEFAULT,
  ZERO,
} from '~/utils/constants';
import { ORDER_BY, SORT_COLUMN_BY, STATUS_REVENUE, TEXT, Y_SCROLL } from '~/utils/enum';
import { checkExistOption, convertRevenueNumber, defaultSortOrder, formattedPhoneNumber, getCurrentMonthObject, getListCurrentYear } from '~/utils/helper';

import { LoadingContext } from '~/contexts';
import { revenueInfluencerActions, selectLoadingRevenueInfluencer, selectRevenueInfluencer } from '~/thunks/financial/revenue/revenueSlice';
import { getListRevenueInfluencer } from '~/thunks/financial/revenue/revenueThunk';
import styles from './RevenueInfluencer.module.scss';

interface IParamObject {
  revenueYear?: string;
  revenueMonth?: string;
  searchKey?: string;
  payoutStatus?: string;
  sort?: string;
  order?: string;
  page?: number;
  limit?: number;
}

const cx = classNames.bind(styles);

const handleQueryString = (listOption: any, queryValue: any, defaultValue: any) => {
  if (!queryValue) {
    return defaultValue;
  }

  const existOption = checkExistOption(listOption, queryValue);

  if (existOption) {
    return existOption;
  }

  return null;
};

const RevenueInfluencer = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const params = Object.fromEntries([...searchParams]);
  const OPTION_YEAR = getListCurrentYear();
  const dispatch = useAppDispatch();
  const loadingContext = useContext(LoadingContext);

  const revenuesInfluencer = useAppSelector(selectRevenueInfluencer);
  const loading = useAppSelector(selectLoadingRevenueInfluencer);
  const { responses: listRevenue, pagination } = revenuesInfluencer;
  const searchRef = useRef<any>(null);

  const [pageSelected, setPageSelected] = useState<number>(Number(params?.page) || PAGE_DEFAULT);
  const [idIssue, setIdIssue] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [statusSelected, setStatusSelected] = useState<string>(handleQueryString(OPTION_STATUS_PAYOUT, params?.status, ''));
  const [monthSelected, setMonthSelected] = useState<string>(handleQueryString(OPTIONS_MONTH, params?.month, getCurrentMonthObject()?.value));
  const [yearSelected, setYearSelected] = useState<string>(handleQueryString(OPTION_YEAR, params?.year, OPTION_YEAR[0].value));
  const [limitSelected, setLimitSelected] = useState<number>(Number(params?.limit) || LIMIT_DEFAULT);
  const [valueInputSearch, setValueInputSearch] = useState<string>(params?.searchKey ? params?.searchKey : '');
  const [paramObject, setParamObject] = useState<IParamObject>({
    revenueYear: yearSelected,
    revenueMonth: monthSelected,
    searchKey: params?.searchKey,
    payoutStatus: statusSelected,
    sort: params?.sort,
    order: params?.order,
    page: pageSelected,
    limit: limitSelected,
  });
  const [loadingMarkPaid, setLoadingMarkPaid] = useState<boolean>(false);

  const columns: ColumnsType<any> = [
    {
      title: 'Influencer',
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
      title: 'Revenue',
      dataIndex: 'revenue',
      ellipsis: true,
      sorter: true,
      render: (data) => (data ? '$ ' + convertRevenueNumber(data) : '-'),
      defaultSortOrder: defaultSortOrder(paramObject?.order, paramObject?.sort, SORT_COLUMN_BY.REVENUE),
      width: 120,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      ellipsis: true,
      render: (data) => (
        <Badge
          status={data === STATUS_REVENUE.PAID.KEY ? BADGE_STATUS_SUCCESS : BADGE_STATUS_ERROR}
          text={data === STATUS_REVENUE.PAID.KEY ? STATUS_REVENUE.PAID.LABEL : STATUS_REVENUE.UNPAID.LABEL}
        />
      ),
      width: 110,
    },
    {
      title: 'Action',
      dataIndex: 'action',
      ellipsis: true,
      align: 'center',
      render: (data, dataRow) =>
        dataRow.status === STATUS_REVENUE.PAID.KEY ? (
          ''
        ) : (
          <Tooltip placement='top' title={'Mark paid'}>
            <span onClick={() => openModalAction(dataRow)} className={`${cx('action_button')} ${loadingMarkPaid && cx('disable-event')}`}>
              <DollarOutlined />
            </span>
          </Tooltip>
        ),
      width: 88,
    },
  ];

  // function
  const handleConvertDataRevenue = (data: any[]) => {
    if (!data || data?.length === 0) {
      return [];
    }
    const dataConvert = data?.map((item: any) => ({
      ...item,
      key: item?.id,
      revenue: item?.totalRevenue,
      status: item?.isPaid ? STATUS_REVENUE.PAID.KEY : STATUS_REVENUE.UNPAID.KEY,
    }));
    return dataConvert;
  };

  const handleChangeStatus = (value: string) => {
    const newParamObject = { ...paramObject, payoutStatus: value, page: PAGE_DEFAULT };
    handleSetDefaultPageInUrl(KEY_PARAMS.STATUS, value);
    handleCommonChange(newParamObject, PAGE_DEFAULT);
  };

  const handleChangeMonth = (value: string) => {
    const newParamObject = { ...paramObject, revenueMonth: value, page: PAGE_DEFAULT };
    handleSetDefaultPageInUrl(KEY_PARAMS.MONTH, value);
    handleCommonChange(newParamObject, PAGE_DEFAULT);
  };

  const handleChangeYear = (value: string) => {
    const newParamObject = { ...paramObject, revenueYear: value, page: PAGE_DEFAULT };
    handleSetDefaultPageInUrl(KEY_PARAMS.YEAR, value);
    handleCommonChange(newParamObject, PAGE_DEFAULT);
  };

  const handleSearch = (value: string) => {
    if (searchRef.current) {
      searchRef.current.blur();
    }
    const newParamObject = { ...paramObject, searchKey: value, page: PAGE_DEFAULT };
    handleSetDefaultPageInUrl(KEY_PARAMS.SEARCH_KEY, value);
    handleCommonChange(newParamObject, PAGE_DEFAULT);
  };

  const handleChangePagination = (page: number, pageSize: number) => {
    const newParamObject = { ...paramObject, page, limit: pageSize };
    setSearchParams({ ...params, page: page.toString(), limit: pageSize.toString() });

    handleCommonChange(newParamObject, page, pageSize);
  };

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
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
    handleSortRevenue(orderBy);
  };

  const handleSortRevenue = (order: any) => {
    let newParamObject = {};
    if (order) {
      newParamObject = { ...paramObject, sort: SORT_COLUMN_BY.REVENUE, order: order };
      setSearchParams({ ...params, sort: SORT_COLUMN_BY.REVENUE, order: order });
    } else {
      const { sort, order, ...param } = params;
      newParamObject = { ...paramObject, sort: '', order: '' };
      setSearchParams(param);
    }
    handleCommonChange(newParamObject);
  };

  const handleCommonChange = (newParamObject: IParamObject, currentPage?: number, currentLimit?: number) => {
    setParamObject(newParamObject);
    handleGetRevenueInfluencer(newParamObject);

    if (currentPage) {
      setPageSelected(currentPage);
    }

    if (currentLimit) {
      setLimitSelected(currentLimit);
    }
  };

  const handleSetDefaultPageInUrl = (fieldName: string, fieldValue: string) => {
    if (params?.page) {
      setSearchParams({ ...params, [fieldName]: fieldValue, page: PAGE_DEFAULT.toString() });
    } else {
      setSearchParams({ ...params, [fieldName]: fieldValue });
    }
  };

  const handleGetRevenueInfluencer = (params: any) => {
    loadingContext?.show();
    dispatch(getListRevenueInfluencer(params))
      .unwrap()
      .then((res) => {
        loadingContext?.hide();
      })
      .catch((err) => {
        loadingContext?.hide();
      });
  };

  const openModalAction = (dataRow: any) => {
    setLoadingMarkPaid(true);
    setIdIssue(dataRow?.id);
    Modal.confirm({
      title: MODAL_CONFIRM_TITLE,
      content: (
        <span>
          Pay <span className={cx('text-highlight')}> {dataRow?.username}</span> $ {dataRow?.revenue}
        </span>
      ),
      onOk: handleOk,
      onCancel: handleCancel,
    });
  };

  const handleOk = () => {
    setLoadingMarkPaid(false);
    setOpen(false);
  };

  const handleCancel = () => {
    setLoadingMarkPaid(false);
    setOpen(false);
  };

  useEffect(() => {
    let queryObject = {};
    if (monthSelected) {
      queryObject = { ...queryObject, month: monthSelected };
    }
    if (yearSelected) {
      queryObject = { ...queryObject, year: yearSelected };
    }
    setSearchParams({ ...params, ...queryObject });
    handleGetRevenueInfluencer(paramObject);

    return () => {
      dispatch(revenueInfluencerActions.resetRevenuesInfluencer());
    };
  }, []);

  return (
    <div id='revenueInfluencer' className={cx('height-full')}>
      <CardLayout className={`height-full`}>
        <CardBackground>
          <SectionHeaderFilter>
            <Select onChange={handleChangeStatus} options={OPTION_STATUS_PAYOUT} defaultValue={statusSelected} className={cx('select_box')} />
            <Select defaultValue={monthSelected} onChange={handleChangeMonth} options={OPTIONS_MONTH} className={cx('select_box')} />
            <Select defaultValue={yearSelected} options={OPTION_YEAR} onChange={handleChangeYear} className={cx('select_box')} />
            <Search placeholder={TEXT.PLACEHOLDER_SEARCH_REVENUE} defaultValue={valueInputSearch} onSearch={handleSearch} className={cx('search_box')} ref={searchRef} />
          </SectionHeaderFilter>
          {!loading && (
            <>
              <Table columns={columns} dataSource={handleConvertDataRevenue(listRevenue)} onChange={handleTableChange} scroll={{ y: Y_SCROLL }} pagination={false} />
              {pagination?.totalItems !== ZERO && (
                <Pagination
                  total={pagination?.totalItems}
                  current={pageSelected}
                  onChange={handleChangePagination}
                  className={cx('pagination')}
                  showSizeChanger
                  pageSize={limitSelected}
                />
              )}
            </>
          )}
        </CardBackground>
      </CardLayout>
    </div>
  );
};

export default React.memo(RevenueInfluencer);
