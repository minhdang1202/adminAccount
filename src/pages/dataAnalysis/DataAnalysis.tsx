import { LoadingOutlined } from '@ant-design/icons';
import { Input, Empty as NoDataComponent, Select, Space, Spin } from 'antd';
import classNames from 'classnames/bind';
import { useContext, useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useSearchParams } from 'react-router-dom';

import { LoadingContext } from '~/contexts';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';

import { selectListInfluencer } from '~/thunks/account/influencer/influencerSlice';
import { getAllAccountInfluencer } from '~/thunks/account/influencer/influencerThunk';
import { dataAnalysisActions, selectPosts } from '~/thunks/dataAnalysis/dataAnalysisSlice';
import { getPosts } from '~/thunks/dataAnalysis/dataAnalysisThunk';

import { PostItem, PostItemDetail } from '~/components/specific';
import CardBackground from '~/components/specific/cardBackground/CardBackground';
import SelectAccount from '~/components/specific/selectAccount/SelectAccount';

import { IDataPost, IParamsInfluencer, IParamsPost } from '~/data/dataAnalysis';
import { KEY_PARAMS, LIMIT_DEFAULT, LIMIT_DEFAULT_INFINITY_SCROLL, PAGE_DEFAULT, ZERO } from '~/utils/constants';
import { FILTER_REPORT_STATUS, FIRST_SELECT_INFLUENCER, PLACEHOLDER, REPORT_OPTION } from '~/utils/enum';
import { convertBytes, convertSecondsToMMSS, formatNumberQuantity, handleQueryString } from '~/utils/helper';

import { IDataInfluencer } from '~/data/account';
import { postDetailActions, selectPostDetail } from '~/thunks/post/detailPost/detailPostSlice';
import { getPostDetail } from '~/thunks/post/detailPost/detailPostThunk';
import styles from './DataAnalysis.module.scss';

const { Search } = Input;
const loadingIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const cx = classNames.bind(styles);

const DataAnalysis = () => {
  const dispatch = useAppDispatch();
  const loadingContext = useContext(LoadingContext);
  const dataAnalysis = useAppSelector(selectPosts);
  const dataInfluencer = useAppSelector(selectListInfluencer);
  const { pagination, responses: posts } = dataAnalysis;
  const { responses: resInfluencer, pagination: paginationInfluencer } = dataInfluencer;
  const [searchParams, setSearchParams] = useSearchParams();
  const params = Object.fromEntries([...searchParams]);
  const postDetail = useAppSelector(selectPostDetail);
  const { account, post, report } = postDetail;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAutoPlay, setIsAutoPlay] = useState(false);

  const [hasMoreInfluencer, setHasMoreInfluencer] = useState<boolean>(true);
  const [loadingInfluencer, setLoadingInfluencer] = useState<boolean>(false);
  const [arrInfluencer, setArrInfluencer] = useState<IDataInfluencer[]>([]);
  const [pageInfluencer, setPageInfluencer] = useState<number>(PAGE_DEFAULT);
  const [reportSelected, setReportSelected] = useState<string>(handleQueryString(REPORT_OPTION, params?.reportStatus, FILTER_REPORT_STATUS.VIEW_ALL.VALUE));

  const [dataPosts, setDataPosts] = useState<IDataPost[]>([]);

  const [paramObject, setParamObject] = useState<IParamsPost>({
    accountId: params?.accountId,
    limit: LIMIT_DEFAULT_INFINITY_SCROLL,
    page: PAGE_DEFAULT,
    reportStatus: params?.reportStatus,
    searchKey: params?.searchKey,
  });

  const handleCommonChange = (fieldName: string, fieldValue: string, isChangeParamUrl: boolean = true) => {
    const newParamObject: IParamsPost = { ...paramObject, [fieldName]: fieldValue, page: PAGE_DEFAULT };
    if (isChangeParamUrl) {
      setSearchParams({ ...params, [fieldName]: fieldValue });
    }
    dispatch(dataAnalysisActions.resetDataAnalysis());
    setDataPosts([]);
    setParamObject(newParamObject);
    getAllPost(newParamObject);
  };

  const getAllPost = (params: IParamsPost, isNotShowMore: boolean = true) => {
    if (isNotShowMore) {
      loadingContext?.show();
    }

    dispatch(getPosts(params))
      .unwrap()
      .then((res) => {
        loadingContext?.hide();
      })
      .catch((err) => {
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

  const getAllInfluencer = (paramsInfluencer: IParamsInfluencer) => {
    dispatch(getAllAccountInfluencer(paramsInfluencer))
      .unwrap()
      .then((res) => {
        setArrInfluencer(res?.data?.responses);
        setPageInfluencer(pageInfluencer + 1);
      })
      .catch((err) => {});
  };

  const handleChangeFlagged = (value: string) => {
    handleCommonChange(KEY_PARAMS.REPORT_STATUS, value);
  };

  const onChangeInfluencer = (value: string) => {
    handleCommonChange(KEY_PARAMS.ACCOUNT_ID, value, false);
  };

  const onSearchCaption = (value: string) => {
    handleCommonChange(KEY_PARAMS.SEARCH_KEY, value);
  };

  const handleOpenModal = (id: string) => {
    handleGetPostDetail(id);
    setIsAutoPlay(true);
  };

  const handleCancel = () => {
    dispatch(postDetailActions.resetPost());
    setIsAutoPlay(false);
    setIsModalOpen(false);
  };

  const handleLoadMoreInfluencer = () => {
    setPageInfluencer(pageInfluencer + 1);

    let params = {
      page: pageInfluencer,
      limit: LIMIT_DEFAULT,
    };

    if (arrInfluencer?.length >= paginationInfluencer?.totalItems) {
      setHasMoreInfluencer(false);
      return;
    }

    dispatch(getAllAccountInfluencer(params))
      .unwrap()
      .then((res) => {
        setArrInfluencer(arrInfluencer.concat(res?.data?.responses));
        setLoadingInfluencer(false);
      })
      .catch((err) => {});
  };

  const handleLoadMorePosts = () => {
    getAllPost({ ...paramObject, page: pagination?.page + 1 }, false);
  };

  useEffect(() => {
    let paramsInfluencer = {
      page: pageInfluencer,
      limit: LIMIT_DEFAULT,
    };

    getAllInfluencer(paramsInfluencer);
    getAllPost(paramObject);

    return () => {
      dispatch(dataAnalysisActions.resetDataAnalysis());
    };
  }, []);

  useEffect(() => {
    if (!posts || posts?.length === ZERO) {
      return;
    }

    setDataPosts([...dataPosts, ...posts]);
  }, [posts]);

  return (
    <div id='dataAnalysis' className={cx('height-full')}>
      <CardBackground>
        <div>
          <Space className={cx('data_analysis-actions')}>
            <Select placeholder='Select' className={cx('select_status')} onChange={handleChangeFlagged} options={REPORT_OPTION} defaultValue={reportSelected} />
            <SelectAccount
              onChange={onChangeInfluencer}
              dataOptions={arrInfluencer}
              placeholder={PLACEHOLDER.FILTER_INFLUENCER}
              loading={loadingInfluencer}
              setLoading={setLoadingInfluencer}
              loadMoreData={handleLoadMoreInfluencer}
              hasMore={hasMoreInfluencer}
              labelAll={FIRST_SELECT_INFLUENCER.label}
            />
            <Search defaultValue={params?.searchKey} placeholder={PLACEHOLDER.DATA_ANALYSIS} className={cx('search')} onSearch={onSearchCaption} />
          </Space>
          {Object.keys(dataAnalysis).length !== ZERO && (
            <div id='scrollableDiv' className={cx('infinite_scroll')}>
              {dataPosts?.length > ZERO ? (
                <InfiniteScroll
                  hasMore={pagination?.page < pagination?.totalPages}
                  dataLength={dataPosts?.length}
                  next={handleLoadMorePosts}
                  loader={
                    <div className={cx('infinity-scroll-loading')}>
                      <Spin indicator={loadingIcon} />
                    </div>
                  }
                  scrollableTarget='scrollableDiv'
                  scrollThreshold={1}
                >
                  <Space wrap size={22} align='start'>
                    {dataPosts?.map((post: IDataPost, idx: number) => (
                      <PostItem
                        key={idx}
                        postInfo={{
                          type: post?.fileType,
                          size: convertBytes(post?.size),
                          time: convertSecondsToMMSS(+post?.durationSeconds),
                          url: post?.url,
                        }}
                        onClick={() => handleOpenModal(post?.id)}
                      />
                    ))}
                  </Space>
                </InfiniteScroll>
              ) : (
                <div className={cx('empty-data')}>
                  <NoDataComponent style={{ padding: '42px 24px 50px' }} />
                </div>
              )}
            </div>
          )}
        </div>
      </CardBackground>

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
    </div>
  );
};

export default DataAnalysis;
