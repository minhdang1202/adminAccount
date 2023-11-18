import { Avatar, Modal, Space, Tabs, TabsProps, Timeline } from 'antd';
import classNames from 'classnames/bind';
import { useContext, useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ActivityTimeLine, AnalyticBox, CardLayout, DetailAccountCover, FormDetailAccount, FormDetailAccountPassword, PostItem, PostItemDetail } from '~/components/specific';

import { IParamActivityPost } from '~/apis/account';
import LoadingInfiniteScroll from '~/components/specific/loadingInfiniteScroll/LoadingInfiniteScroll';
import NoData from '~/components/specific/noData/NoData';
import { LoadingContext, ToastContext } from '~/contexts';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { selectAccountDetail } from '~/thunks/account/detailAccount/accountDetailSlice';
import { getAccountDetail } from '~/thunks/account/detailAccount/accountDetailThunk';
import { accountActivityActions, selectAccountActivityPagination, selectAccountActivityResponses } from '~/thunks/account/detailAccount/activity/accountActivitySlice';
import { getAccountActivity } from '~/thunks/account/detailAccount/activity/accountActivityThunk';
import { selectListPost } from '~/thunks/account/detailAccount/listPost/listPostSlice';
import { getListPostByAccount } from '~/thunks/account/detailAccount/listPost/listPostThunk';
import { postDetailActions, selectPostDetail } from '~/thunks/post/detailPost/detailPostSlice';
import { getPostDetail } from '~/thunks/post/detailPost/detailPostThunk';
import { LIMIT_DEFAULT_INFINITY_SCROLL, LIST_TAB_INFLUENCER_DETAIL, PAGE_DEFAULT, ROLE_INFLUENCER, roleAccountManagement } from '~/utils/constants';
import {
  AdminProtectedPath,
  CURRENCY_DEFAULT,
  STATUS,
  TITLE_CARD_HEADER,
  Y_SCROLL_BASE_TABS_CONTENT_FULL_FIELD_INFORMATION,
  Y_SCROLL_BASE_TAB_FULL_FIELD_INFORMATION,
} from '~/utils/enum';
import {
  convertBytes,
  convertSecondsToMMSS,
  convertStringToNumber,
  formatNumberQuantity,
  groupByCreatedAt,
  handleCalHeightWithInformation,
  handleConvertDataActivity,
} from '~/utils/helper';
import { icDollarCircleGold, icSnapGold } from '~/utils/icon.constants';
import { imgAvatarDefault, imgErrorDefault } from '~/utils/image.constants';
import styles from './InfluencerDetail.module.scss';
const cx = classNames.bind(styles);

const InfluencerDetail = () => {
  const dispatch = useAppDispatch();
  const { influencerId } = useParams();
  const loadingContext = useContext(LoadingContext);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const influencerDetail = useAppSelector(selectAccountDetail);
  const postDetail = useAppSelector(selectPostDetail);
  const listPost = useAppSelector(selectListPost);
  const { pagination, responses: posts } = listPost;
  const { account, post, report } = postDetail;
  const keyCurrentTab = searchParams.get('t');
  const accountActivityResponses = useAppSelector(selectAccountActivityResponses);
  const paginationActivity = useAppSelector(selectAccountActivityPagination);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [statusAccount, setStatusAccount] = useState<boolean>(false);
  const [pageNum, setPageNum] = useState(1);
  const [listPostDisplay, setListPostDisplay] = useState<any>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [pageNumActivity, setPageNumActivity] = useState(PAGE_DEFAULT);
  const [accountActivityConverted, setAccountActivityConverted] = useState<{}[]>([]);

  const {
    avatar,
    coverUrl,
    countFollower,
    countPost,
    countFollowing,
    countryCode,
    email,
    name,
    phoneNumber,
    shortBio,
    snapBalance,
    status,
    totalSnapRevenue,
    totalSnapUsed,
    username,
    dateOfBirth,
  } = influencerDetail;
  const heightTabContent = `calc( ${Y_SCROLL_BASE_TAB_FULL_FIELD_INFORMATION}`;

  // Function
  const onLoadMore = () => {
    handleGetListPost({ id: influencerId, type: keyCurrentTab || LIST_TAB_INFLUENCER_DETAIL.POST.key, page: pageNum + 1 }, false);
  };

  const onLoadMoreActivity = () => {
    if (influencerId) {
      handleGetAccountActivity({ id: influencerId, page: pageNumActivity + 1 }, false);
    }
  };

  const handleChangeTab = (key: string) => {
    if (!influencerId) {
      return;
    }

    navigate({ pathname: '/' + AdminProtectedPath.ACCOUNT_MANAGEMENT_INFLUENCER.path + '/' + influencerId, search: key ? `?t=${key}` : '' });
    setListPostDisplay([]);
    setPageNum(1);
    setPageNumActivity(PAGE_DEFAULT);
    setAccountActivityConverted([]);
    if (key === LIST_TAB_INFLUENCER_DETAIL.ACCOUNT_SUMMARY.key) {
      handleGetAccountDetail(influencerId);
    } else if (key === LIST_TAB_INFLUENCER_DETAIL.ACTIVITIES.key) {
      handleGetAccountActivity({ id: influencerId });
    } else {
      handleGetListPost({ id: influencerId, type: key });
    }
  };

  const handleOpenModal = (id: any) => {
    setIsAutoPlay(true);
    handleGetPostDetail(id);
  };

  const handleCancel = () => {
    dispatch(postDetailActions.resetPost());
    setIsAutoPlay(false);
    setIsModalOpen(false);
  };

  // Call api
  const handleGetAccountActivity = (query: IParamActivityPost, isNotLoadMore: boolean = true) => {
    if (isNotLoadMore) {
      loadingContext?.show();
    }
    dispatch(getAccountActivity({ id: query?.id, page: query?.page }))
      .unwrap()
      .then((response) => {
        loadingContext?.hide();
        if (query?.page) setPageNumActivity(query?.page);
      })
      .catch((error) => {
        loadingContext?.hide();
      });
  };

  const handleGetPostDetail = (id?: string, page?: number) => {
    if (!isModalOpen) {
      loadingContext?.show();
    }
    dispatch(getPostDetail({ id, page }))
      .unwrap()
      .then((response) => {
        loadingContext?.hide();
        setIsModalOpen(true);
      })
      .catch((err) => {
        loadingContext?.hide();
      });
  };

  const handleGetAccountDetail = (query: string | null) => {
    loadingContext?.show();

    dispatch(getAccountDetail({ id: query }))
      .unwrap()
      .then((response) => {
        loadingContext?.hide();
      })
      .catch((error) => {
        loadingContext?.hide();
      });
  };

  const handleGetListPost = (params: any, isNotLoadMore: boolean = true) => {
    if (isNotLoadMore) {
      loadingContext?.show();
    }
    dispatch(getListPostByAccount(params))
      .unwrap()
      .then((response) => {
        loadingContext?.hide();
        if (params?.page) setPageNum(params?.page);
      })
      .catch((error) => {
        loadingContext?.hide();
      });
  };

  // Components
  const AccountSummary = () => {
    return (
      <div id='accountSummaryInfluencer' className={cx('summary_container')} style={{ height: heightTabContent }}>
        <DetailAccountCover role={ROLE_INFLUENCER} avatarUrl={avatar} coverUrl={coverUrl} postNumber={countPost} followerNumber={countFollower} />
        <div className={cx('summary_content')}>
          <div className={cx('summary_form-edit')}>
            <h2 className={cx('summary_title-section')}>Account detail</h2>
            <FormDetailAccount
              role={ROLE_INFLUENCER}
              accountId={influencerId}
              name={name}
              email={email}
              phoneNumber={phoneNumber}
              countryCode={countryCode}
              status={status}
              shortBio={shortBio}
              username={username}
              dateOfBirth={dateOfBirth}
              handleGetAccountDetail={handleGetAccountDetail}
            />
          </div>
          <div className={cx('summary_container')}>
            <div className={cx('summary_form-pass')}>
              <h2 className={cx('summary_title-section')}>Change password</h2>
              <FormDetailAccountPassword accountId={influencerId} />
            </div>
            <div className={cx('summary_analysis')}>
              <h2 className={cx('summary_title-section')}>Analysis</h2>
              <div className={cx('summary_analysis-list')}>
                <AnalyticBox title={TITLE_CARD_HEADER.BALANCE_SNAPS} url={icSnapGold} quantity={convertStringToNumber(snapBalance)} hasBackground={true} />
                <AnalyticBox title={TITLE_CARD_HEADER.TOTAL_SNAP_USED} url={icSnapGold} quantity={convertStringToNumber(totalSnapUsed)} hasBackground={true} />
                <AnalyticBox
                  title={TITLE_CARD_HEADER.REVENUE_OF_INFLUENCER}
                  url={icDollarCircleGold}
                  quantity={convertStringToNumber(totalSnapRevenue)}
                  hasBackground={true}
                  currency={`${CURRENCY_DEFAULT} `}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ActivitiesTab = () => {
    const activities = handleConvertDataActivity(accountActivityConverted);

    const ActivityComponent = (
      <div id='activitiesTab' className={cx('timeline')} style={{ height: heightTabContent }}>
        {accountActivityConverted && accountActivityConverted.length ? (
          <InfiniteScroll
            loader={<LoadingInfiniteScroll />}
            dataLength={accountActivityConverted?.length}
            next={onLoadMoreActivity}
            hasMore={pageNumActivity < paginationActivity?.totalPages}
            scrollableTarget='activitiesTab'
            scrollThreshold={1}
          >
            {activities?.map((item: any, index: number) => (
              <div key={index}>
                <div className={cx('date')}>{item.date}</div>
                <Timeline
                  className={cx('timeline_content')}
                  items={item?.data?.map((activity: any) => {
                    const { data, createdAt, type } = activity;
                    return {
                      dot: <Avatar src={avatar ? avatar : imgAvatarDefault} size={24} />,
                      children: (
                        <ActivityTimeLine
                          postUrl={data?.url || imgErrorDefault}
                          money={data?.price}
                          snap={data?.snapPrice || data?.snap}
                          timeline={createdAt}
                          shortDescription={data?.caption}
                          type={type}
                          fileType={data?.fileType}
                          onClick={() => handleOpenModal(data?.postId)}
                          currency={data?.currency || CURRENCY_DEFAULT}
                        />
                      ),
                    };
                  })}
                />
              </div>
            ))}
          </InfiniteScroll>
        ) : (
          <NoData />
        )}
      </div>
    );
    return ActivityComponent;
  };

  const postsTab = (key: any) => {
    const PostComponent =
      listPostDisplay && listPostDisplay?.length ? (
        <div id={key} className={cx('infinite_scroll-list-post')} style={{ height: heightTabContent }}>
          <InfiniteScroll
            loader={<LoadingInfiniteScroll />}
            dataLength={listPostDisplay?.length}
            next={onLoadMore}
            hasMore={pageNum < pagination?.totalPages}
            scrollableTarget={key}
            scrollThreshold={1}
          >
            <Space wrap={true}>
              {listPostDisplay?.map((post: any, index: number) => {
                const { fileType, url, size, durationSeconds, id } = post;
                return (
                  <PostItem
                    postInfo={{
                      type: fileType,
                      url: url,
                      size: convertBytes(+size),
                      time: convertSecondsToMMSS(+durationSeconds),
                    }}
                    onClick={() => handleOpenModal(id)}
                    key={index}
                  />
                );
              })}
            </Space>
          </InfiniteScroll>
        </div>
      ) : (
        <NoData />
      );
    return <div className={cx(!listPostDisplay || !listPostDisplay?.length ? 'tab_posts-empty-content' : '', 'content-tab')}>{PostComponent}</div>;
  };

  const items: TabsProps['items'] = [
    {
      key: LIST_TAB_INFLUENCER_DETAIL.ACCOUNT_SUMMARY.key,
      label: LIST_TAB_INFLUENCER_DETAIL.ACCOUNT_SUMMARY.title,
      children: AccountSummary(),
    },
    {
      key: LIST_TAB_INFLUENCER_DETAIL.POST.key,
      label: LIST_TAB_INFLUENCER_DETAIL.POST.title,
      children: postsTab(LIST_TAB_INFLUENCER_DETAIL.POST.key),
    },
    {
      key: LIST_TAB_INFLUENCER_DETAIL.FAVORITE_POST.key,
      label: LIST_TAB_INFLUENCER_DETAIL.FAVORITE_POST.title,
      children: postsTab(LIST_TAB_INFLUENCER_DETAIL.FAVORITE_POST.key),
    },
    {
      key: LIST_TAB_INFLUENCER_DETAIL.POST_VIEWED.key,
      label: LIST_TAB_INFLUENCER_DETAIL.POST_VIEWED.title,
      children: postsTab(LIST_TAB_INFLUENCER_DETAIL.POST_VIEWED.key),
    },
    {
      key: LIST_TAB_INFLUENCER_DETAIL.ACTIVITIES.key,
      label: LIST_TAB_INFLUENCER_DETAIL.ACTIVITIES.title,
      children: ActivitiesTab(),
    },
  ];

  useEffect(() => {
    if (accountActivityResponses && accountActivityResponses?.length > 0) {
      const result = groupByCreatedAt(accountActivityResponses);
      setAccountActivityConverted([...accountActivityConverted, ...result]);
    }
  }, [accountActivityResponses]);

  useEffect(() => {
    const displayList = posts || [];
    if (JSON.stringify(listPostDisplay) !== JSON.stringify(displayList)) {
      setListPostDisplay([...listPostDisplay, ...displayList]);
    } else {
      setListPostDisplay(displayList);
    }
  }, [posts]);

  useEffect(() => {
    if (influencerId) {
      handleGetAccountDetail(influencerId);
      if (keyCurrentTab === LIST_TAB_INFLUENCER_DETAIL.ACCOUNT_SUMMARY.key) {
        handleGetAccountDetail(influencerId);
      } else if (keyCurrentTab === LIST_TAB_INFLUENCER_DETAIL.ACTIVITIES.key) {
        handleGetAccountActivity({ id: influencerId });
      } else {
        handleGetListPost({ id: influencerId, type: keyCurrentTab || LIST_TAB_INFLUENCER_DETAIL.POST.key, limit: LIMIT_DEFAULT_INFINITY_SCROLL });
      }
    }
    return () => {
      dispatch(accountActivityActions.resetActivityState());
    };
  }, []);

  useEffect(() => {
    if (status) {
      setStatusAccount(status === STATUS.ACTIVE.KEY);
    }

    return () => {
      setStatusAccount(false);
    };
  }, [status]);

  return (
    <div id='influencerDetail' className={cx('influencer-detail')}>
      <CardLayout className={`height-full`}>
        <div className={cx('influencer_layout-tab-content')}>
          <Tabs defaultActiveKey={keyCurrentTab || ''} items={items} onChange={handleChangeTab} size={'middle'} />
        </div>
        {post && (
          <PostItemDetail
            isModalOpen={isModalOpen}
            isAutoPlay={isAutoPlay}
            onCancel={handleCancel}
            detailPost={{
              id: post?.id,
              type: post?.fileType,
              url: post?.url,
              quantityLike: formatNumberQuantity(post?.countLike),
              quantityView: formatNumberQuantity(post?.countView),
              quantitySnaps: post?.snapPrice,
              caption: post?.caption,
              totalPageReport: report?.totalPages,
              report: report,
              isRemoved: post?.isRemoved,
            }}
            userInfo={{ name: account?.name, img: account?.avatar, username: account?.username }}
          />
        )}
      </CardLayout>
    </div>
  );
};

export default InfluencerDetail;
