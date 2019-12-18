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
    const {
      changeNameFilter,
      logIn,
      signUp,
      logOut,
      user,
      openProfile,
      image,
      title,
    } = this.props;
    const { bgImageLoaded } = this.state;
    return (
      <header
        className="about-us-header"
        style={bgImageLoaded ? { backgroundImage: `url(${image})` } : {}}
      >
        <div className="about-us-header__top">
          <Logo />
          <MainNav
            changeNameFilter={changeNameFilter}
            logIn={logIn}
            signUp={signUp}
            logOut={logOut}
            user={user}
            openProfile={openProfile}
          />
        </div>
        <div className="about-us-header__content">
          <h1 className="about-us-header__title">{title}</h1>
        </div>
      </header>
    );
  }
}

InfoPageHeader.propTypes = {
  user: PropTypes.object,
  changeNameFilter: PropTypes.func.isRequired,
  logIn: PropTypes.func.isRequired,
  signUp: PropTypes.func.isRequired,
  logOut: PropTypes.func.isRequired,
  openProfile: PropTypes.func.isRequired,
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};
