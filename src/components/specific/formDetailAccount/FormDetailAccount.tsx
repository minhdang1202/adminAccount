import React, { useContext, useEffect, useState } from 'react';
import { Button, Col, DatePicker, Form, Input, InputNumber, Modal, Row, Select, Typography } from 'antd';
import classNames from 'classnames/bind';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { DEFAULT_ROLE, OPTIONS_COUNTRY_CODE, roleAccountManagement, typeOfStatusAccount, REGEX, typeOfRole, DATE_FORMAT_DATE_PICKER } from '~/utils/constants';
import styles from './FormDetailAccount.module.scss';
import { AdminProtectedPath, BUTTON_DANGER, DEFAULT_STATUS_ACCOUNT, MIN_AGE_DEFAULT, MODAL_CONFIRM, OPTIONS_EDIT_STATUS_ACCOUNT, TYPE_TOAST_MESSAGE } from '~/utils/enum';
import { useNavigate } from 'react-router-dom';
import { deleteAccount, updateDetailAccount } from '~/thunks/account/detailAccount/accountDetailThunk';
import { LoadingContext, ToastContext } from '~/contexts';
import { useAppDispatch } from '~/redux/hooks';
import { convertToYYYYMMDD } from '~/utils/helper';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

const cx = classNames.bind(styles);
const { Text } = Typography;
const { confirm } = Modal;
const { TextArea } = Input;
const { Option } = Select;

interface IFormDetailAccountProps {
  accountId?: string | number;
  role?: typeOfRole;
  name?: string;
  email?: string;
  phoneNumber?: string;
  status?: typeOfStatusAccount;
  shortBio?: string;
  postNumber?: number;
  username?: string;
  countryCode?: string;
  dateOfBirth?: string;
  handleGetAccountDetail?: any;
}

interface IFormInput {
  name?: string;
  email?: string;
  phoneNumber?: string;
  status?: typeOfStatusAccount;
  shortBio?: string;
  postNumber?: number;
  username?: string;
  countryCode?: string;
  dateOfBirth?: string;
}

const FormDetailAccount: React.FC<IFormDetailAccountProps> = (props) => {
  const { accountId, role, name, email, phoneNumber, status, shortBio, username, countryCode, dateOfBirth, handleGetAccountDetail } = props;
  const dateOfBirthMoment = dayjs(dateOfBirth, DATE_FORMAT_DATE_PICKER);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const loadingContext = useContext(LoadingContext);
  const toastContext = useContext(ToastContext);

  const [isChangedForm, setIsChangedForm] = useState(false);

  // Component
  const prefixSelector = (
    <Form.Item name='countryCode' noStyle initialValue={OPTIONS_COUNTRY_CODE[0].value}>
      <Select size='large' style={{ width: 80 }}>
        {OPTIONS_COUNTRY_CODE.map((option, index) => (
          <Option key={index} value={option.value}>
            {option.label}
          </Option>
        ))}
      </Select>
    </Form.Item>
  );

  // Call api
  const handleUpdateDetail = (data: {}) => {
    loadingContext?.show();
    dispatch(updateDetailAccount(data))
      .unwrap()
      .then((res) => {
        handleGetAccountDetail(accountId);
        loadingContext?.hide();
        toastContext?.showToast(TYPE_TOAST_MESSAGE.SUCCESS, MODAL_CONFIRM.CHANGE_INFORMATION.SUCCESS);
      })
      .catch((err) => {
        loadingContext?.hide();
        toastContext?.showToast(TYPE_TOAST_MESSAGE.ERROR, MODAL_CONFIRM.CHANGE_INFORMATION.ERROR);
      });
  };

  // Function
  const handleKeyPress = (e: any) => {
    if (e.key && !/^\d$/.test(e.key) && e.key !== 'Backspace') {
      e.preventDefault();
    }
  };

  const handleDateChange = (_: any, value: {}) => {
    if (value) {
      const today = new Date();
      const seventeenYearsAgo = new Date(today);
      seventeenYearsAgo.setFullYear(today.getFullYear() - MIN_AGE_DEFAULT);
      if (value > today) {
        return Promise.reject('Invalid date of birth');
      }
      if (value > seventeenYearsAgo) {
        return Promise.reject('Age must be grand than 17');
      }
      return Promise.resolve();
    }
    return Promise.resolve();
  };

  const handleResetForm = () => {
    confirm({
      title: MODAL_CONFIRM.RESET_FORM.TITLE,
      centered: true,
      icon: <ExclamationCircleFilled />,
      content: MODAL_CONFIRM.RESET_FORM.CONTENT,
      okText: MODAL_CONFIRM.RESET_FORM.OK_TEXT,
      cancelText: MODAL_CONFIRM.RESET_FORM.CANCEL_TEXT,
      okType: BUTTON_DANGER,
      onOk() {
        form.setFieldsValue({ username, name, email, phoneNumber, status, shortBio, countryCode, dateOfBirth: dateOfBirthMoment });
        setIsChangedForm(false);
      },
    });
  };

  const handleSubmitFinish = (values: IFormInput) => {
    confirm({
      title: MODAL_CONFIRM.CHANGE_INFORMATION.TITLE,
      centered: true,
      icon: <></>,
      content: MODAL_CONFIRM.CHANGE_INFORMATION.CONTENT,
      okText: MODAL_CONFIRM.CHANGE_INFORMATION.OK_TEXT,
      onOk() {
        const dataInput = {
          email: email?.trim(),
          name: name?.trim(),
          phoneNumber: phoneNumber?.trim(),
          shortBio: shortBio?.trim(),
          username: username?.trim(),
          ...values,
          accountId,
          dateOfBirth: convertToYYYYMMDD(values.dateOfBirth),
        };
        if (!dataInput.countryCode) delete dataInput.countryCode;
        if (!dataInput.email) delete dataInput.email;
        if (!dataInput.name) delete dataInput.name;
        if (!dataInput.phoneNumber) delete dataInput.phoneNumber;
        if (!dataInput.shortBio) delete dataInput.shortBio;
        if (!dataInput.username) delete dataInput.username;

        handleUpdateDetail(dataInput);
        setIsChangedForm(false);
      },
    });
  };

  const handleDeleteAccount = () => {
    confirm({
      title: MODAL_CONFIRM.DELETE_ACCOUNT.TITLE,
      centered: true,
      icon: <></>,
      content: MODAL_CONFIRM.DELETE_ACCOUNT.CONTENT,
      okText: MODAL_CONFIRM.DELETE_ACCOUNT.OK_TEXT,
      okType: BUTTON_DANGER,
      onOk() {
        loadingContext?.show();
        dispatch(deleteAccount({ accountId: Number(accountId) }))
          .unwrap()
          .then((res) => {
            loadingContext?.hide();
            toastContext?.showToast(TYPE_TOAST_MESSAGE.SUCCESS, MODAL_CONFIRM.CHANGE_INFORMATION.SUCCESS);
            const path = role === roleAccountManagement.FAN ? `/${AdminProtectedPath.ACCOUNT_MANAGEMENT_FAN.path}` : `/${AdminProtectedPath.ACCOUNT_MANAGEMENT_INFLUENCER.path}`;
            navigate(path);
          })
          .catch((err) => {
            loadingContext?.hide();
            toastContext?.showToast(TYPE_TOAST_MESSAGE.ERROR, MODAL_CONFIRM.CHANGE_INFORMATION.ERROR);
          });
      },
    });
  };

  const handleFormChange = () => {
    setIsChangedForm(true);
  };

  useEffect(() => {
    form.setFieldsValue({ username, name, email, phoneNumber, status, shortBio, countryCode, dateOfBirth: dateOfBirth ? dateOfBirthMoment : '' });
  }, [username, name, email, phoneNumber, status, shortBio, countryCode, dateOfBirth]);

  return (
    <div id='formDetailAccount' className={cx('form-detail_container')}>
      <Form form={form} onFinish={handleSubmitFinish} layout='vertical' onValuesChange={handleFormChange}>
        <Form.Item name='name' label='Full Name' rules={[{ required: true, message: 'Full name is required', whitespace: true }]}>
          <Input size='large' />
        </Form.Item>
        <Form.Item name='username' label='Username' rules={[{ required: true, message: 'Username is required', whitespace: true }]}>
          <Input size='large' />
        </Form.Item>
        <Form.Item
          name='email'
          label='Email'
          rules={[
            {
              type: 'email',
              message: 'Invalid email format',
            },
          ]}
        >
          <Input size='large' type='email' addonBefore='@' />
        </Form.Item>
        <Row gutter={16}>
          <Col sm={24} xl={12}>
            <Form.Item
              name='phoneNumber'
              label='Phone Number'
              rules={[
                {
                  pattern: REGEX.PHONE_NUMBER,
                  message: 'Invalid phone number format',
                },
              ]}
            >
              <Input size='large' onKeyDown={handleKeyPress} addonBefore={prefixSelector} />
            </Form.Item>
          </Col>
          <Col sm={24} xl={12}>
            <Form.Item
              name='dateOfBirth'
              label='Date Of Birth'
              rules={[
                {
                  validator: handleDateChange,
                },
              ]}
            >
              <DatePicker size='large' className={cx('form-detail_input-date')} />
            </Form.Item>
          </Col>
        </Row>
        {role !== roleAccountManagement.FAN && (
          <Form.Item name='shortBio' label='Short Bio'>
            <TextArea showCount maxLength={120} style={{ height: 80, resize: 'none' }} />
          </Form.Item>
        )}
        <Row gutter={16}>
          <Col sm={24} xl={12}>
            <Form.Item name='status' label='Status' initialValue={status}>
              <Select size='large' style={{ width: '100%' }}>
                {OPTIONS_EDIT_STATUS_ACCOUNT.map((option, index) => (
                  <Option key={index} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <div className={cx('form-detail_bottom')}>
          <Text type='danger' className={cx('form-detail_btn-delete')} onClick={handleDeleteAccount}>
            Delete account
          </Text>
          <div className=''>
            <Button size='large' htmlType='button' onClick={handleResetForm} disabled={!isChangedForm}>
              Cancel
            </Button>
            <Button size='large' type='primary' htmlType='submit' className={cx('form-detail_btn-submit')}>
              Save Changes
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
};

FormDetailAccount.defaultProps = {
  role: DEFAULT_ROLE,
  name: '',
  accountId: '',
  email: '',
  phoneNumber: '',
  status: DEFAULT_STATUS_ACCOUNT,
  shortBio: '',
  username: '',
  countryCode: '',
  dateOfBirth: '',
  handleGetAccountDetail: () => {},
};

export default React.memo(FormDetailAccount);
