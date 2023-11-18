import { Form, InputNumber, Modal, Pagination, Select } from 'antd';
import Search from 'antd/es/input/Search';
import Table, { ColumnsType } from 'antd/es/table';
import classNames from 'classnames/bind';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AvatarColumn, CardBackground, CardLayout, SectionHeaderFilter } from '~/components/specific';

import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { issueSnapActions, selectIssueSnap, selectLoadingIssueSnap } from '~/thunks/financial/issueSnap/issueSnapSlice';
import { getListIssueSnap, issueSnapForAccount } from '~/thunks/financial/issueSnap/issueSnapThunk';
import { LoadingContext, ToastContext } from '~/contexts';

import { KEY_PARAMS, LIMIT_DEFAULT, OPTIONS_ROLE, PAGE_DEFAULT } from '~/utils/constants';
import { MODAL_CONFIRM, MODAL_TITLE, ORDER_BY, PLACEHOLDER, ROLES, SORT_COLUMN_BY, TYPE_TOAST_MESSAGE, Y_SCROLL } from '~/utils/enum';
import { imgSnapIcon } from '~/utils/image.constants';
import { addKeyToObjectInArr, convertNumberHasNotFractionDigit, defaultSortOrder, formattedPhoneNumber, handleQueryString } from '~/utils/helper';

import styles from './Issues.module.scss';
const cx = classNames.bind(styles);

interface IColumnTable {
  id: string | number | undefined;
  key: string;
  name: string;
  email: string;
  username: string;
  countryCode: string;
  phoneNumber: string;
  avatar: string;
  snapBalance: number;
  role: string;
  issuesSnap: any;
}

interface IParamObject {
  role?: string;
  searchKey?: string;
  payoutStatus?: string;
  sort?: string;
  order?: string;
  page?: number;
  limit?: number;
}

const Issues = () => {
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const params = Object.fromEntries([...searchParams]);
  const loadingContext = useContext(LoadingContext);
  const searchRef = useRef<HTMLDivElement>(null);
  const [form] = Form.useForm();
  const toastContext = useContext(ToastContext);

  const dataSourceAccountFans = useAppSelector(selectIssueSnap);
  const loading = useAppSelector(selectLoadingIssueSnap);
  const { responses: listIssueSnap, pagination } = dataSourceAccountFans;

  const [pageSelected, setPageSelected] = useState<number>(Number(params?.page) || PAGE_DEFAULT);
  const [limitSelected, setLimitSelected] = useState<number>(Number(params?.limit) || LIMIT_DEFAULT);
  const [roleSelected, setRoleSelected] = useState<string>(handleQueryString(OPTIONS_ROLE, params?.role, ''));
  const [valueInputSearch, setValueInputSearch] = useState<string>(params?.searchKey ? params?.searchKey : '');
  const [idIssue, setIdIssue] = useState<string | number | undefined>();
  const [dataUserModal, setDataUserModal] = useState<string>();
  const [open, setOpen] = useState<boolean>(false);
  const [paramObject, setParamObject] = useState<IParamObject>({
    searchKey: params?.searchKey,
    role: params?.role,
    sort: params?.sort,
    order: params?.order,
    page: pageSelected,
    limit: limitSelected,
  });

  const columns: ColumnsType<IColumnTable> = [
    {
      title: 'User',
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
      title: 'Balance Snap',
      dataIndex: 'snapBalance',
      ellipsis: true,
      render: (data) => convertNumberHasNotFractionDigit(data),
      sorter: true,
      defaultSortOrder: defaultSortOrder(paramObject?.order, paramObject?.sort, SORT_COLUMN_BY.SNAP_BALANCE),
      width: 140,
    },
    {
      title: 'Role',
      dataIndex: 'role',
      ellipsis: true,
      render: (data) => <span className=''>{data === ROLES.FAN.KEY ? ROLES.FAN.LABEL : ROLES.INFLUENCER.LABEL}</span>,
      width: 110,
    },
    {
      title: 'Action',
      dataIndex: 'issuesSnap',
      ellipsis: true,
      render: (data, dataRow: IColumnTable) => {
        return (
          <span onClick={() => openModalIssueSnap(dataRow)} className={cx('action_button')}>
            Issue snap
          </span>
        );
      },
      width: 120,
    },
  ];

  // call api
  const handleGetIssueSnap = (params: IParamObject) => {
    loadingContext?.show();
    dispatch(getListIssueSnap(params))
      .unwrap()
      .then((res) => {
        loadingContext?.hide();
      })
      .catch((err) => {
        loadingContext?.hide();
      });
  };

  // function
  const handleSetDefaultPageInUrl = (fieldName: string, fieldValue: string) => {
    if (params?.page) {
      setSearchParams({ ...params, [fieldName]: fieldValue, page: PAGE_DEFAULT.toString() });
    } else {
      setSearchParams({ ...params, [fieldName]: fieldValue });
    }
  };

  const handleChangeRole = (value: string) => {
    const newParamObject = { ...paramObject, role: value, page: PAGE_DEFAULT };
    handleSetDefaultPageInUrl(KEY_PARAMS.ROLE, value);
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

  const handleCommonChange = (newParamObject: IParamObject, currentPage?: number, currentLimit?: number) => {
    setParamObject(newParamObject);
    handleGetIssueSnap(newParamObject);

    if (currentPage) {
      setPageSelected(currentPage);
    }

    if (currentLimit) {
      setLimitSelected(currentLimit);
    }
  };

  // table
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
    handleSortBalanceSnap(orderBy);
  };

  const handleChangePagination = (page: number, pageSize: number) => {
    const newParamObject = { ...paramObject, page, limit: pageSize };
    setSearchParams({ ...params, page: page.toString(), limit: pageSize.toString() });

    handleCommonChange(newParamObject, page, pageSize);
  };

  // handle sorting
  const handleSortBalanceSnap = (order: string) => {
    let newParamObject = {};
    if (order) {
      newParamObject = { ...paramObject, sort: SORT_COLUMN_BY.SNAP_BALANCE, order: order };
      setSearchParams({ ...params, sort: SORT_COLUMN_BY.SNAP_BALANCE, order: order });
    } else {
      const { sort, order, ...param } = params;
      newParamObject = { ...paramObject, sort: '', order: '' };
      setSearchParams(param);
    }
    handleCommonChange(newParamObject);
  };

  // handle modal issue snap
  const openModalIssueSnap = (data: IColumnTable) => {
    if (data?.id && data?.username) {
      setIdIssue(+data.id);
      setDataUserModal(data.username);
      setOpen(true);
    }
  };

  const handleOk = () => {
    const snapToIssue = form.getFieldValue('snapIssue');
    loadingContext?.show();
    dispatch(issueSnapForAccount({ accountId: idIssue, snap: snapToIssue }))
      .unwrap()
      .then((res) => {
        form.resetFields();
        loadingContext?.hide();
        handleGetIssueSnap(paramObject);
        toastContext?.showToast(TYPE_TOAST_MESSAGE.SUCCESS, MODAL_CONFIRM.ISSUE_SNAP.SUCCESS);
      })
      .catch((err) => {
        form.resetFields();
        loadingContext?.hide();
        toastContext?.showToast(TYPE_TOAST_MESSAGE.ERROR, MODAL_CONFIRM.ISSUE_SNAP.ERROR);
      });
    setOpen(false);
  };

  const handleCancel = () => {
    form.resetFields();
    setOpen(false);
  };

  useEffect(() => {
    let queryObject = {};
    if (roleSelected) {
      queryObject = { ...queryObject, role: roleSelected };
    }
    setSearchParams({ ...params, ...queryObject });
    handleGetIssueSnap(paramObject);

    return () => {
      dispatch(issueSnapActions.resetIssueSnap());
    };
  }, []);

  return (
    <div id='issues' className={cx('height-full')}>
      <CardLayout className={`height-full`}>
        <CardBackground>
          <SectionHeaderFilter>
            <Select defaultValue={roleSelected} onChange={handleChangeRole} options={OPTIONS_ROLE} style={{ minWidth: '120px' }} />
            <Search placeholder={PLACEHOLDER.SEARCH_ISSUE} defaultValue={valueInputSearch} onSearch={handleSearch} className={cx('search_box')} />
          </SectionHeaderFilter>
          {!loading && (
            <>
              <Table columns={columns} dataSource={addKeyToObjectInArr(listIssueSnap)} onChange={handleTableChange} scroll={{ y: Y_SCROLL }} pagination={false} />
              {pagination?.totalItems > 0 && (
                <Pagination
                  total={pagination?.totalItems}
                  current={pageSelected}
                  showSizeChanger
                  onChange={handleChangePagination}
                  className={cx('pagination')}
                  style={{ marginTop: '16px', display: 'block', textAlign: 'right' }}
                  pageSize={limitSelected}
                />
              )}
            </>
          )}

          <Modal open={open} title={MODAL_TITLE.ISSUE_SNAP} onOk={handleOk} onCancel={handleCancel} closeIcon={false} maskClosable={false}>
            <Form form={form} layout='vertical'>
              <Form.Item
                className={cx('issues_modal-item-input')}
                name='snapIssue'
                label={
                  <span>
                    Issue snap to <span className={cx('text-highlight')}> {dataUserModal}</span>
                  </span>
                }
              >
                <InputNumber
                  className={cx('issues_modal-input')}
                  size='large'
                  placeholder={PLACEHOLDER.DEFAULT_NUMBER}
                  min={1}
                  max={100000}
                  addonAfter={
                    <div className={cx('issues_modal-input-img')}>
                      <img src={imgSnapIcon} alt='' />
                    </div>
                  }
                />
              </Form.Item>
            </Form>
          </Modal>
        </CardBackground>
      </CardLayout>
    </div>
  );
};

export default React.memo(Issues);
