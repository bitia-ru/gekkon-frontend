import React from 'react';
import PropTypes from 'prop-types';
import defaultAvatar from './images/avatar_placeholder.svg';

const Img = ({ height, src }) => (
  <img height={height} src={(src || defaultAvatar)} />
);

Img.PropTypes = {
  height: PropTypes.number,
  src: PropTypes.string,
};

export default Img;
