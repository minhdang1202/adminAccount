import classNames from 'classnames/bind';
import React, { useEffect, useState } from 'react';
import { DEFAULT_TYPE_MESSAGE_ACTIVITY, typeFileOfPost, typeOfMessageActivity, typesMessageActivity } from '~/utils/constants';
import { icPlayCircleFilled } from '~/utils/icon.constants';
import styles from './ActivityTimeLine.module.scss';
import { checkSingularOrPlural, convertNumberHasNotFractionDigit, convertTimestampToCustomFormatTime } from '~/utils/helper';
import { DEFAULT_POST_TYPE, POST_TYPE, TEXT } from '~/utils/enum';

const cx = classNames.bind(styles);

interface IActivityTimeLine {
  postUrl?: string;
  shortDescription?: string;
  snap?: number;
  timeline?: string;
  money?: string;
  type?: typeOfMessageActivity;
  fileType?: typeFileOfPost;
  onClick?: () => void;
  currency?: string;
}

const ActivityTimeLine: React.FC<IActivityTimeLine> = (props) => {
  const { postUrl, shortDescription, type, snap, money, timeline, fileType, onClick, currency } = props;
  const timelineConvert = convertTimestampToCustomFormatTime(timeline);

  const [message, setMessage] = useState<any>(<></>);

  useEffect(() => {
    let valueSnap = convertNumberHasNotFractionDigit(snap);
    let valueMoney = convertNumberHasNotFractionDigit(money);
    handleShowMessage(type, valueSnap, timeline, valueMoney);
  }, [type, snap, timeline, money]);

  const handleShowMessage = (type?: typeOfMessageActivity, snap?: string, timeline?: string, money?: string) => {
    const textFileType = fileType === POST_TYPE.VIDEO ? TEXT.VIDEO : TEXT.PHOTO;

    switch (type) {
      case typesMessageActivity.BUY_SNAP:
        const componentMessageViewPost = (
          <div className={cx('message')}>
            <span className={cx('text-bold')}>You </span>
            have exchanged for
            <span className={cx('text-bold')}>
              {' '}
              {money} {currency}{' '}
            </span>
            token to get
            <span className={cx('text-bold')}>
              {' '}
              {snap} snap{checkSingularOrPlural(props.snap)} {timelineConvert}
            </span>
          </div>
        );
        setMessage(componentMessageViewPost);
        break;
      case typesMessageActivity.VIEW_POST:
        const componentMessageBuySnap = (
          <div className={cx('message')}>
            <span className={cx('text-bold')}>You </span>
            paid
            <span className={cx('text-bold')}>
              {' '}
              {snap} snap{checkSingularOrPlural(props.snap)}{' '}
            </span>
            to watch the {textFileType}
            <span className={cx('text-bold')}> {timelineConvert}</span>
          </div>
        );
        setMessage(componentMessageBuySnap);
        break;
      case typesMessageActivity.CREATE_POST:
        const componentMessageCreatePost = (
          <div className={cx('message')}>
            <span className={cx('text-bold')}>Your </span>
            content has been uploaded. Viewers need
            <span className={cx('text-bold')}>
              {' '}
              {snap} snap{checkSingularOrPlural(props.snap)}{' '}
            </span>
            to be able to watch the {textFileType}
            <span className={cx('text-bold')}> {timelineConvert}</span>
          </div>
        );
        setMessage(componentMessageCreatePost);
        break;

      default:
        setMessage(<></>);
        break;
    }
  };

  const handleShowModalDetailVideo = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <div className={cx('content')}>
      {message}
      <div className={cx('videoInformation')}>
        {type !== typesMessageActivity.BUY_SNAP && (
          <>
            <div className={cx('videoImg')} onClick={handleShowModalDetailVideo}>
              {fileType === POST_TYPE.VIDEO ? (
                <>
                  <video src={postUrl}></video>
                  <img src={icPlayCircleFilled} className={cx('playIcon')}></img>
                </>
              ) : (
                <img src={postUrl}></img>
              )}
            </div>
            <div className={cx('videoDescription')}>{shortDescription}</div>
          </>
        )}
      </div>
    </div>
  );
};

ActivityTimeLine.defaultProps = {
  postUrl: '',
  shortDescription: '',
  type: DEFAULT_TYPE_MESSAGE_ACTIVITY,
  snap: 0,
  timeline: '',
  money: '',
  fileType: '',
  onClick: () => {},
  currency: '',
};

export default ActivityTimeLine;
