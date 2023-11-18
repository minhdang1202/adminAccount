import { UserOutlined } from '@ant-design/icons';
import { Avatar, List } from 'antd';
import classNames from 'classnames/bind';
import React, { useCallback, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { END_MESSAGE_INFINITY_SCROLL, POST_REPORT_DEFAULT, TYPE_DATA } from '~/utils/enum';
import LoadingInfiniteScroll from '../loadingInfiniteScroll/LoadingInfiniteScroll';
import styles from './ListReport.module.scss';

const cx = classNames.bind(styles);

interface DataType {
  userInfo: {
    username: string;
    name: string;
    avatar: string;
  };
  content: string;
}

interface Props {
  width?: string | number;
  height?: string | number;
  data: DataType[];
  hasMoreData: boolean;
  endMessage?: string;
  onLoadMoreData: () => void;
}

const ListReport = ({ data, width, height, endMessage, onLoadMoreData, hasMoreData }: Props) => {
  const [listItemsContainerRef, setListItemsContainerRef] = useState<any>();

  const listItemsContainerRefChange = useCallback((node: HTMLDivElement | null) => {
    if (node !== null) {
      setListItemsContainerRef(node);
    }
  }, []);

  return (
    <div
      ref={listItemsContainerRefChange}
      style={{ width: typeof width === TYPE_DATA.STRING ? `${width}` : width, height: typeof height === TYPE_DATA.STRING ? `${height}` : height }}
      className={cx('list_report')}
    >
      {listItemsContainerRef && (
        <InfiniteScroll dataLength={data.length} next={onLoadMoreData} hasMore={hasMoreData} loader={<LoadingInfiniteScroll />} scrollableTarget={listItemsContainerRef}>
          <List
            dataSource={data}
            renderItem={(item) => (
              <List.Item key={item.userInfo.username} className={'border-none'}>
                <List.Item.Meta
                  avatar={item.userInfo.avatar ? <Avatar src={item.userInfo.avatar} /> : <Avatar icon={<UserOutlined />} />}
                  title={item.userInfo.name || POST_REPORT_DEFAULT.NAME}
                  description={item.content || POST_REPORT_DEFAULT.REASON}
                />
              </List.Item>
            )}
          />
        </InfiniteScroll>
      )}
    </div>
  );
};

ListReport.defaultProp = {
  width: 390,
  height: 796,
  data: [],
  hasMoreData: false,
  endMessage: END_MESSAGE_INFINITY_SCROLL.POST_REPORT,
  onLoadMoreData: () => {},
};

export default React.memo(ListReport);
