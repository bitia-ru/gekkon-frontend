import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MainNav from '../MainNav/MainNav';
import Logo from '../Logo/Logo';

import './InfoPageHeader.css';


export default class InfoPageHeader extends Component {
  constructor(props) {
    super(props);

    this.state = {
      bgImageLoaded: false,
    };
  }

  componentDidMount() {
    const { image } = this.props;
    const bgImg = new Image();
    bgImg.onload = () => this.setState({ bgImageLoaded: true });
    bgImg.src = image;
  }

  render() {
    const { image, title, } = this.props;
    const { bgImageLoaded } = this.state;

    return (
      <header
        className="about-us-header"
        style={bgImageLoaded ? { backgroundImage: `url(${image})` } : {}}
      >
        <div className="about-us-header__top">
          <Logo />
          <MainNav />
        </div>
        <div className="about-us-header__content">
          <h1 className="about-us-header__title">{title}</h1>
        </div>
      </header>
    );
  }
}

InfoPageHeader.propTypes = {
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};
