import React from 'react';
import * as R from 'ramda';
import PropTypes from 'prop-types';
import defaultAvatar from './images/avatar_placeholder.svg';

class Img extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      image: undefined,
    };

    this.imagesInternal = {};
  }

  componentDidMount() {
    this.processProps(this.props);
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      this.processProps(this.props);
    }
  }

  processProps(props) {
    if (R.has([props.src], this.imagesInternal)) {
      this.setState({ image: props.src });
      return;
    }
    this.imagesInternal[props.src] = new Image();
    this.imagesInternal[props.src].src = props.src;
    this.setState(
      { image: undefined },
      () => {
        this.imagesInternal[props.src].onload = () => {
          this.setState({ image: props.src });
        };
      },
    );
  }

  render() {
    const { style, placeholder } = this.props;
    const { image } = this.state;
    return (
      <img height={style.height} src={image ? `${image}` : placeholder} />
    );
  }
}

Img.PropTypes = {
  height: PropTypes.number,
  src: PropTypes.string,
};

export default Img;
