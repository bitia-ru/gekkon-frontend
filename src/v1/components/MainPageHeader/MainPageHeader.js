import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MainNav from '../MainNav/MainNav';
import Logo from '../Logo/Logo';
import Button from '../Button/Button';
import { notReady, notExist } from '../../utils';
import './MainPageHeader.css';

const bgImage = require('./images/main-page-header.jpg');

export default class MainPageHeader extends Component {
  constructor(props) {
    super(props);

    this.state = {
      bgImageLoaded: false,
      posterPhotoLoaded: false,
    };
  }

  componentDidMount() {
    const bgImg = new Image();
    bgImg.onload = () => this.setState({ bgImageLoaded: true });
    bgImg.src = bgImage;
  }

  render() {
    const {
      changeNameFilter,
      logIn,
      signUp,
      logOut,
      user,
      openProfile,
    } = this.props;
    const { bgImageLoaded, posterPhotoLoaded } = this.state;
    return (
      <header
        className="main-page-header"
        style={bgImageLoaded ? { backgroundImage: `url(${bgImage})` } : {}}
      >
        <div className="main-page-header__top">
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
        <div className="main-page-header__content">
          <div className="main-page-header__text">
            <h1 className="main-page-header__title">
              Не можешь вспомнить свою первую 6С?
            </h1>
            <p className="main-page-header__descr">
              Не пытайся запоминать боль, записывай
            </p>
            <div className="main-page-header__button-wrapper">
              {
                (!notReady(user) && notExist(user)) && (
                  <>
                    <Button
                      size="big"
                      style="normal"
                      title="Зарегистрироваться"
                      onClick={signUp}
                    />
                    <Button
                      size="big"
                      style="transparent"
                      title="Войти"
                      onClick={logIn}
                    />
                  </>
                )
              }
            </div>
          </div>
          <div className="main-page-header__img">
            <picture>
              <source
                media="(max-width: 1600px)"
                srcSet={require('./images/main-page-header-img_desktop-md.png')}
              />
              <img
                src={require('./images/main-page-header-img.png')}
                alt="Скалолаз"
                onLoad={() => this.setState({ posterPhotoLoaded: true })}
                style={{ visibility: posterPhotoLoaded ? 'visible' : 'hidden' }}
              />
            </picture>
          </div>
        </div>
      </header>
    );
  }
}

MainPageHeader.propTypes = {
  user: PropTypes.object,
  changeNameFilter: PropTypes.func.isRequired,
  logIn: PropTypes.func.isRequired,
  signUp: PropTypes.func.isRequired,
  logOut: PropTypes.func.isRequired,
  openProfile: PropTypes.func.isRequired,
};
