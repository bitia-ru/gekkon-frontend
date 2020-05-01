import React from 'react';
import * as R from 'ramda';
import PropTypes from 'prop-types';

class Img extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = { image: undefined };
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
    if (R.has(props.src, this.imagesInternal)) {
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
    const { height, defaultImage } = this.props;
    const { image } = this.state;
    return (
      <img height={height} src={image || defaultImage} alt="avatar" />
    );
  }
}

Img.propTypes = {
  height: PropTypes.number,
  defaultImage: PropTypes.string,
};

export default Img;
