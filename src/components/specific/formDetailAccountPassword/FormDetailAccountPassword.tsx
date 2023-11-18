import React, { useContext } from 'react';

import { Avatar, Button, Col, Divider, Form, Input, Modal, Row, Space, Switch } from 'antd';
import classNames from 'classnames/bind';
import { ExclamationCircleFilled } from '@ant-design/icons';

import styles from './FormDetailAccountPassword.module.scss';
import { LoadingContext, ToastContext } from '~/contexts';
import { useAppDispatch } from '~/redux/hooks';
import { MODAL_CONFIRM, TYPE_TOAST_MESSAGE } from '~/utils/enum';
import { updateDetailAccountPassword } from '~/thunks/account/detailAccount/accountDetailThunk';
const cx = classNames.bind(styles);
const { confirm } = Modal;

interface IFormDetailAccountPasswordProps {
  accountId?: string | number;
}

interface IFormPasswordInput {
  newPassword: string;
}

interface IPayloadUpdateAccountPassword {
  accountId?: string | number;
  newPassword: string;
}

const FormDetailAccountPassword: React.FC<IFormDetailAccountPasswordProps> = (props) => {
  const { accountId } = props;
  const [form] = Form.useForm();
  const loadingContext = useContext(LoadingContext);
  const dispatch = useAppDispatch();
  const toastContext = useContext(ToastContext);

  const validateConfirmPassword = (_: any, value: string) => {
    const newPasswordInput = form.getFieldValue('newPassword');
    if (value?.trim() !== '' && value !== newPasswordInput) {
      return Promise.reject('Your password and confirm password must match');
    }
    return Promise.resolve();
  };

  const handleUpdateDetail = (data: IPayloadUpdateAccountPassword) => {
    loadingContext?.show();
    dispatch(updateDetailAccountPassword(data))
      .unwrap()
      .then((res) => {
        loadingContext?.hide();
        toastContext?.showToast(TYPE_TOAST_MESSAGE.SUCCESS, MODAL_CONFIRM.CHANGE_INFORMATION.SUCCESS);
      })
      .catch((err) => {
        loadingContext?.hide();
        toastContext?.showToast(TYPE_TOAST_MESSAGE.ERROR, MODAL_CONFIRM.CHANGE_INFORMATION.ERROR);
      });
  };

  const handleSubmitFinish = (values: IFormPasswordInput) => {
    confirm({
      title: MODAL_CONFIRM.CHANGE_PASSWORD.TITLE,
      centered: true,
      icon: <></>,
      content: MODAL_CONFIRM.CHANGE_PASSWORD.CONTENT,
      okText: MODAL_CONFIRM.CHANGE_PASSWORD.OK_TEXT,
      onOk() {
        handleUpdateDetail({ accountId, newPassword: values.newPassword.trim() });
        form.resetFields();
      },
    });
  };

  return (
    <div id='formDetailAccountPassword' className={cx('form-pass_container')}>
      <Form form={form} onFinish={handleSubmitFinish} layout='vertical'>
        <Form.Item name='newPassword' label='New Password' rules={[{ required: true, message: 'New password is required', whitespace: true }]}>
          <Input.Password size='large' type='password' autoComplete='off' />
        </Form.Item>
        <Form.Item
          className={cx('issues_modal-item-input')}
          name='confirmPassword'
          label='Confirm Password'
          rules={[{ required: true, message: 'Confirm password is required', whitespace: true }, { validator: validateConfirmPassword }]}
        >
          <Input.Password size='large' type='password' autoComplete='off' />
        </Form.Item>
        <div className={cx('form-pass_bottom')}>
          <Form.Item>
            <Button size='large' type='primary' htmlType='submit'>
              Change Password
            </Button>
          </Form.Item>
        </div>
      </Form>
    </div>
  );
};

FormDetailAccountPassword.defaultProps = {
  accountId: '',
};

export default React.memo(FormDetailAccountPassword);
