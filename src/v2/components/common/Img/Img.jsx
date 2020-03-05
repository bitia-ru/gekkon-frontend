import React from 'react';
import defaultAvatar from './images/avatar_placeholder.svg';

class Img extends React.PureComponent {
  render() {
    const { height, src } = this.props;
    return (
      <img height={height} src={(src || defaultAvatar)} />
    );
  }
}

export default Img;
