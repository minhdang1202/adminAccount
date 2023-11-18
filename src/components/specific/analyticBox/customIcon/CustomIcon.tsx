import React from 'react';

interface CustomIconProps {
  imgSrc: string;
  altText?: string;
}

const CustomIcon: React.FC<CustomIconProps> = ({ imgSrc, altText }) => {
  return <img src={imgSrc} alt={altText} />;
};

CustomIcon.defaultProps = {
  imgSrc: '',
  altText: '',
};

export default CustomIcon;
