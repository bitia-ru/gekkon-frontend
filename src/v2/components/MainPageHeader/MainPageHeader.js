import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Button from '@/v1/components/Button/Button';
import { notReady, notExist } from '@/v1/utils';
import './MainPageHeader.css';
import { currentUser } from '@/v2/redux/user_session/utils';
import SocialLinkButton from '@/v1/components/SocialLinkButton/SocialLinkButton';
import { TELEGRAM_LINK, TWITTER_LINK } from '@/v1/Constants/SocialLinks';

const bgImage = require('./images/main-page-header.jpg').default;

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
    const { user, history } = this.props;
    const { bgImageLoaded, posterPhotoLoaded } = this.state;

    const socialLinksSprite = require(
      '@/../img/social-links-sprite/social-links-sprite.svg',
    ).default;

    return (
      <header
        className="main-page-header"
        style={bgImageLoaded ? { backgroundImage: `url(${bgImage})` } : {}}
      >
        <div className="main-page-header__content">
          <div className="main-page-header__text">
            <h1 className="main-page-header__title">
              Не можешь вспомнить свою первую 6С?
            </h1>
            <p className="main-page-header__descr">Не пытайся запоминать боль, записывай</p>
            <div className="main-page-header__button-wrapper">
              {
                (!notReady(user) && notExist(user)) ? (
                  <>
                    <Button
                      size="big"
                      style="normal"
                      title="Зарегистрироваться"
                      onClick={() => history.push('#signup')}
                    />
                    <Button
                      size="big"
                      style="transparent"
                      title="Войти"
                      onClick={() => history.push('#signin')}
                    />
                  </>
                ) : (
                  <ul className="social-links">
                    <li>
                      <SocialLinkButton
                        dark
                        href={TELEGRAM_LINK}
                        xlinkHref={`${socialLinksSprite}#icon-telegram`}
                      />
                    </li>
                    <li>
                      <SocialLinkButton
                        dark
                        href={TWITTER_LINK}
                        xlinkHref={`${socialLinksSprite}#icon-twitter`}
                      />
                    </li>
                  </ul>
                )
              }
            </div>
          </div>
          <div className="main-page-header__img">
            <picture>
              <source
                media="(max-width: 1600px)"
                srcSet={require('./images/main-page-header-img_desktop-md.png').default}
              />
              <img
                src={require('./images/main-page-header-img.png').default}
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

MainPageHeader.propTypes = { user: PropTypes.object };

const mapStateToProps = state => ({ user: currentUser(state) });

export default connect(mapStateToProps)(withRouter(MainPageHeader));
