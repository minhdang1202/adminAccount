import { message } from 'antd';
import { NoticeType } from 'antd/es/message/interface';
import { ReactNode, createContext, useContext } from 'react';
import { CONTENT_TOAST_MESSAGE_DEFAULT, DURATION_TOAST_MESSAGE_DEFAULT, TYPE_TOAST_MESSAGE } from '~/utils/enum';

interface IToastContext {
  showToast: (type: NoticeType, content: string, duration?: number) => void;
}

export const ToastContext = createContext<IToastContext | null>(null);

type ToastContextProps = {
  children: ReactNode;
};

export const ToastProvider = (props: ToastContextProps) => {
  const [messageApi, contextHolder] = message.useMessage();

  const contextValue = {
    showToast: (type: NoticeType, content = CONTENT_TOAST_MESSAGE_DEFAULT, duration = DURATION_TOAST_MESSAGE_DEFAULT) => {
      const validTypes = [TYPE_TOAST_MESSAGE.SUCCESS, TYPE_TOAST_MESSAGE.ERROR, TYPE_TOAST_MESSAGE.INFO, TYPE_TOAST_MESSAGE.WARNING, TYPE_TOAST_MESSAGE.LOADING];
      const messageType = validTypes.includes(type) ? type : TYPE_TOAST_MESSAGE.SUCCESS;

      messageApi.open({
        type: messageType,
        content: content,
        duration: duration,
      });
    },
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {contextHolder}
      {props.children}
    </ToastContext.Provider>
  );
};
