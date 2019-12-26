import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import MainNav from '../MainNav/MainNav';
import Logo from '../Logo/Logo';
import Button from '../Button/Button';
import { logIn, signUp } from '../../utils/navigation';

import './MainPageHeader.css';


const bgImage = require('./images/main-page-header.jpg');

class MainPageHeader extends Component {
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
    const { user } = this.props;

    const { bgImageLoaded, posterPhotoLoaded } = this.state;

    return (
      <header
        className="main-page-header"
        style={bgImageLoaded ? { backgroundImage: `url(${bgImage})` } : {}}
      >
        <div className="main-page-header__top">
          <Logo />
          <MainNav />
        </div>
        <div className="main-page-header__content">
          <div className="main-page-header__text">
            <h1 className="main-page-header__title">Не можешь вспомнить свою первую 6С?</h1>
            <p className="main-page-header__descr">Не пытайся запоминать боль, записывай</p>
            <div className="main-page-header__button-wrapper">
              {
                !user && (
                  <>
                    <Button
                      size="big"
                      style="normal"
                      title="Зарегистрироваться"
                      onClick={() => { signUp(this.props.history); }}
                    />
                    <Button
                      size="big"
                      style="transparent"
                      title="Войти"
                      onClick={() => { logIn(this.props.history); }}
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

const mapStateToProps = state => ({
  user: state.usersStore.users[state.usersStore.currentUserId],
});

export default withRouter(connect(mapStateToProps)(MainPageHeader));
