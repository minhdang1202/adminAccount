import React, { useEffect } from 'react';
import classNames from 'classnames/bind';
import { PlaySquareOutlined } from '@ant-design/icons';

// Styles
import styles from './PostItem.module.scss';
import { imgErrorDefault } from '~/utils/image.constants';
import { POST_TAGNAME, POST_TYPE } from '~/utils/enum';

type Props = {
  postInfo?: {
    type?: string;
    url?: any;
    size?: any;
    time?: any;
  };
  onClick?: () => void;
};

const cx = classNames.bind(styles);

const PostItem = ({ postInfo, onClick }: Props) => {
  const isVideo = postInfo?.type === POST_TYPE.VIDEO ? true : false;

  useEffect(() => {
    const load = (element: any) => {
      const url = element.getAttribute('data-src');

      if (element.tagName === POST_TAGNAME.IMG) {
        element.setAttribute('src', url);
      } else if (element.tagName === POST_TAGNAME.VIDEO) {
        element.setAttribute('src', url);
        element.load();
      }
    };

    const lazyLoadElements = () => {
      const lazyElements = document.querySelectorAll('.lazy');
      lazyElements.forEach((element) => {
        load(element);
      });
    };

    const useIntersectionObserver = 'IntersectionObserver' in window;
    let observer: IntersectionObserver | null = null;

    if (useIntersectionObserver) {
      const lazyElements = document.querySelectorAll('.lazy');
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            load(entry.target);
            observer!.unobserve(entry.target);
          }
        });
      });

      lazyElements.forEach((element) => {
        observer!.observe(element);
      });
    } else {
      window.addEventListener('load', lazyLoadElements);
      lazyLoadElements();
    }

    return () => {
      if (useIntersectionObserver && observer) {
        const lazyElements = document.querySelectorAll('.lazy');
        lazyElements.forEach((element) => {
          observer!.unobserve(element);
        });
      } else {
        window.removeEventListener('load', lazyLoadElements);
      }
    };
  }, []);

  return (
    <>
      <div className={cx('post_container')} onClick={onClick}>
        <div className={cx('post_header')}>{isVideo && <PlaySquareOutlined className={cx('post_button-play')} />}</div>
        {isVideo ? (
          <video data-src={postInfo?.url} className={`lazy ${cx('post_video')} ${cx('post_content')}`} />
        ) : (
          <img className={`lazy ${cx('post_img')} ${cx('post_content')}`} data-src={postInfo?.url} alt='Post image' />
        )}
        <div className={cx('post_bottom')}>
          <span className={cx('post_img-size')}>{postInfo?.size}</span>
          {isVideo && <span className={cx('post_img-time')}>{postInfo?.time}</span>}
        </div>
      </div>
    </>
  );
};

PostItem.defaultProps = {
  postInfo: {
    type: POST_TYPE.PHOTO,
    url: imgErrorDefault,
    size: '',
    time: '',
  },
  onclick: () => {},
};

export default React.memo(PostItem);
