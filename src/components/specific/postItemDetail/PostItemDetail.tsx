import React, { useContext, useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import { EyeFilled, HeartFilled, UserOutlined, ExclamationCircleFilled } from '@ant-design/icons';

import ReactPlayer from 'react-player';
import { Avatar, Button, Modal, Space, Typography } from 'antd';

import { imgErrorDefault, imgSnapIcon } from '~/utils/image.constants';
// Styles
import styles from './PostItemDetail.module.scss';
import ListReport from '../listReport/ListReport';
import { HEIGHT_MODAL_DETAIL_POST, PAGE_DEFAULT, WIDTH_MODAL_DETAIL_POST } from '~/utils/constants';
import { BUTTON_DANGER, DEFAULT_POST_TYPE, END_MESSAGE_INFINITY_SCROLL, MODAL_CONFIRM, PLACEHOLDER, POST_TYPE, TEXT, TYPE_TOAST_MESSAGE } from '~/utils/enum';
import { IParamRemovePost } from '~/apis/post';
import { LoadingContext, ToastContext } from '~/contexts';
import { getPostDetail, removePostDetail } from '~/thunks/post/detailPost/detailPostThunk';
import { useAppDispatch } from '~/redux/hooks';
const cx = classNames.bind(styles);
const { Text } = Typography;
const { confirm } = Modal;

interface DataReport {
  userInfo: {
    username: string;
    name: string;
    avatar: string;
  };
  content: string;
}

type Props = {
  detailPost: {
    id?: any;
    type?: string;
    url?: string;
    quantityLike?: string;
    quantityView?: string;
    quantitySnaps?: number;
    caption?: string;
    time?: string;
    report?: DataReport[];
    totalPageReport?: number;
    isRemoved?: boolean;
  };
  userInfo?: {
    img: string;
    name: string;
    username: string;
  };
  isModalOpen?: boolean;
  isAutoPlay?: boolean;
  onCancel: () => void;
};

const PostItemDetail = ({ detailPost, userInfo, isModalOpen, isAutoPlay, onCancel }: Props) => {
  const isVideo = detailPost?.type === POST_TYPE.VIDEO ? true : false;
  const loading = false;
  const loadingContext = useContext(LoadingContext);
  const toastContext = useContext(ToastContext);
  const dispatch = useAppDispatch();

  const [listReport, setListReport] = useState<any>([]);
  const [page, setPage] = useState(PAGE_DEFAULT + 1);
  const [isRemoved, setIsRemoved] = useState<boolean>(detailPost?.isRemoved || false);

  const handleLoadMoreData = () => {
    if (!detailPost) {
      return;
    }
    dispatch(getPostDetail({ id: detailPost?.id, page }))
      .unwrap()
      .then((response) => {
        setPage((page) => page + 1);
      })
      .catch((err) => {});
  };

  const handleChangeStatusRemoveOrReopenPost = (params: IParamRemovePost) => {
    loadingContext?.show();
    dispatch(removePostDetail(params))
      .unwrap()
      .then(() => {
        loadingContext?.hide();
        setIsRemoved((isRemoved) => !isRemoved);
        toastContext?.showToast(TYPE_TOAST_MESSAGE.SUCCESS, isRemoved ? MODAL_CONFIRM.REOPEN_POST.SUCCESS : MODAL_CONFIRM.REMOVE_POST.SUCCESS);
      })
      .catch(() => {
        loadingContext?.hide();
        toastContext?.showToast(TYPE_TOAST_MESSAGE.ERROR, isRemoved ? MODAL_CONFIRM.REOPEN_POST.ERROR : MODAL_CONFIRM.REMOVE_POST.ERROR);
      });
  };

  const handleOpenConfirmRemovePost = () => {
    confirm({
      title: isRemoved ? MODAL_CONFIRM.REOPEN_POST.TITLE : MODAL_CONFIRM.REMOVE_POST.TITLE,
      icon: <ExclamationCircleFilled />,
      content: isRemoved ? MODAL_CONFIRM.REOPEN_POST.CONTENT : MODAL_CONFIRM.REMOVE_POST.CONTENT,
      okText: isRemoved ? MODAL_CONFIRM.REOPEN_POST.OK_TEXT : MODAL_CONFIRM.REMOVE_POST.OK_TEXT,
      okType: BUTTON_DANGER,
      cancelText: isRemoved ? MODAL_CONFIRM.REOPEN_POST.CANCEL_TEXT : MODAL_CONFIRM.REMOVE_POST.CANCEL_TEXT,
      onOk() {
        handleChangeStatusRemoveOrReopenPost({ postId: detailPost?.id });
      },
    });
  };

  const onCancelModal = () => {
    setPage(1);
    setListReport([]);
    onCancel();
  };

  useEffect(() => {
    if (detailPost?.isRemoved) {
      setIsRemoved(detailPost?.isRemoved);
    }
  }, [detailPost?.isRemoved]);

  useEffect(() => {
    const reports: any = detailPost?.report?.values || [];

    const displayList =
      reports?.map((report: any) => {
        return {
          userInfo: {
            username: report?.account.name,
            name: report?.account.name,
            avatar: report?.account.avatar,
          },
          content: report?.reason,
        };
      }) || [];

    setListReport([...listReport, ...displayList]);
  }, [detailPost?.report]);

  return (
    <div id='postItemDetail'>
      <Modal open={isModalOpen} onCancel={onCancelModal} closeIcon={false} footer={[]} width={'fit-content'} centered style={{ padding: '16px' }}>
        {loading ? (
          'Loading'
        ) : (
          <Space direction='vertical' size={16} align='end'>
            <Space size='large' align='start' wrap>
              <div className={cx('post-detail_container')}>
                <div className={cx('post-detail_content')}>
                  <div className={cx('post-detail_content-action')}>
                    <div className={cx('post-detail_content-action-item')}>
                      <HeartFilled className={`${cx('post-detail_content-action-icon')} ${cx('action-icon_heart')}`} />
                      <span className={cx('post-detail_content-action-number')}>{detailPost.quantityLike}</span>
                    </div>
                    <div className={cx('post-detail_content-action-item')}>
                      <EyeFilled className={`${cx('post-detail_content-action-icon')} ${cx('action-icon_view')}`} />
                      <span className={cx('post-detail_content-action-number')}>{detailPost.quantityView}</span>
                    </div>
                    <div className={cx('post-detail_content-action-item')}>
                      <img className={cx('post-detail_content-action-img')} src={imgSnapIcon} alt='' />
                      <span className={cx('post-detail_content-action-number')}>{detailPost.quantitySnaps}</span>
                    </div>
                  </div>
                  <div className={cx('post-detail_media')}>
                    {isVideo ? (
                      <ReactPlayer className={cx('post-detail_video')} url={detailPost?.url} controls={true} playing={isAutoPlay} />
                    ) : (
                      <img className={cx('post-detail_img')} src={detailPost?.url} alt='' />
                    )}
                  </div>
                </div>
                <div className={cx('post-detail_description')}>
                  <div className={cx('post-detail_user-info')}>
                    <Avatar src={userInfo?.img && userInfo?.img} icon={!userInfo?.img && <UserOutlined />} />
                    <span className={cx('post-detail_user-name')}>
                      {userInfo?.name}
                      <span className={cx('post-detail_username')}>{` ( ${userInfo?.username} )`}</span>
                    </span>
                  </div>
                  <p className={cx('post-detail_description-caption', !detailPost.caption && 'post-detail_no-caption')}>{detailPost.caption || PLACEHOLDER.DATA_ANALYSIS}</p>
                </div>
              </div>

              {detailPost?.totalPageReport !== 0 && (
                <Space direction='vertical' size={6}>
                  <Text strong>Report</Text>
                  <ListReport
                    data={listReport || []}
                    width={WIDTH_MODAL_DETAIL_POST}
                    height={HEIGHT_MODAL_DETAIL_POST}
                    endMessage={END_MESSAGE_INFINITY_SCROLL.POST_REPORT}
                    onLoadMoreData={handleLoadMoreData}
                    hasMoreData={page <= (detailPost?.totalPageReport || 0)}
                  />
                </Space>
              )}
            </Space>

            <Button danger={!isRemoved} onClick={handleOpenConfirmRemovePost} className={cx(isRemoved ? 'unRemove' : 'remove')}>
              {isRemoved ? TEXT.REOPEN_POST : TEXT.REMOVE_POST}
            </Button>
          </Space>
        )}
      </Modal>
    </div>
  );
};

PostItemDetail.defaultProps = {
  detailPost: {
    type: DEFAULT_POST_TYPE,
    url: imgErrorDefault,
    quantityLike: '',
    quantityView: '',
    quantitySnaps: '',
    caption: '',
    time: '',
    isRemoved: false,
  },
  userInfo: {
    img: '',
    name: '',
    username: '',
  },
  isModalOpen: false,
  isAutoPlay: false,
  onCancel: () => {},
};

export default React.memo(PostItemDetail);
