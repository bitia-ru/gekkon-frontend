import React from 'react';
import DivWithBackgroundImageLayout from './DivWithBackgroundImageLayout';


class DivWithBackgroundImage extends React.Component {
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

  componentDidUpdate(newProps) {
    this.processProps(newProps);
  }

  processProps(props) {
    if (!props.image) {
      if (this.state.image !== props.image) {
        this.setState({ image: props.image });
      }

      return;
    }

    if (this.imagesInternal[props.image] !== undefined) {
      if (this.imagesInternal[props.image].loadingStarted) {
        return;
      }

      if (this.state.image !== props.image) {
        this.setState({ image: props.image });
      }

      return;
    }

    this.imagesInternal[props.image] = new Image();
    this.imagesInternal[props.image].src = props.image;
    this.imagesInternal[props.image].loadingStarted = true;
    this.setState(
      { image: undefined },
      () => {
        this.imagesInternal[props.image].onload = () => {
          this.imagesInternal[props.image].loadingStarted = undefined;
          this.setState({ image: props.image });
        };
      },
    );
  }

  render() {
    const { image } = this.state;
    const style = {
      ...(this.props.style ? this.props.style : {}),
      backgroundImage: image === null ? 'none' : (
        image ? `url(${image})` : `url(${require('./placeholder.svg').default})`
      ),
    };

    return (
      <DivWithBackgroundImageLayout style={style} className={this.props.className}>
        {this.props.children}
      </DivWithBackgroundImageLayout>
    );
  }
}


export default DivWithBackgroundImage;
