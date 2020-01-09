import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, css } from '@/v2/aphrodite';
import './Header.css';
import between from '@/v2/utils/between';


class SpotPoster extends Component {
  constructor(props) {
    super(props);

    this.state = {
      bgImageLoaded: false,
      scrollPosition: 0,
    };
    this.photosInternal = {};
  }

  componentDidMount() {
    window.addEventListener('scroll', this.onWindowScroll, true);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.onWindowScroll);
  }

  onWindowScroll = () => {
    this.setState({ scrollPosition: document.querySelector('.page__scroll').scrollTop });
  };

  componentDidUpdate(newProps) {
    if (!newProps.user.avatar || newProps.user.avatar.url === this.state.imageUrl) {
      return;
    }

    if (this.state.imageUrl !== null) {
      this.setState({ imageUrl: null });
    }

    if (this.photosInternal[newProps.user.avatar.url] !== undefined) {
      return;
    }

    this.photosInternal[newProps.user.avatar.url] = new Image();
    this.photosInternal[newProps.user.avatar.url].src = newProps.user.avatar.url;
    this.photosInternal[newProps.user.avatar.url].onload = () => {
      this.setState({ imageUrl: newProps.user.avatar.url });
    };
  }

  userRoleToText = (role) => {
    switch (role) {
    case 'admin': return 'Админ';
    case 'creator': return 'Наполнитель';
    default: return 'Юзер';
    }
  };

  render() {
    const { user } = this.props;
    const menuHeight = window.innerWidth > 1440 ? 75 : 65;

    return (
      <>
        <header
          className={css(styles.poster)}
          style={
            {
              height: `calc(20vh - ${this.state.scrollPosition}px)`,
              minHeight: `${menuHeight}px`,
              ...(
                user.avatar
                && this.state.imageUrl
              )
                ? { backgroundImage: `url(${this.photosInternal[user.avatar.url].src})` }
                : {},
            }
          }
        />
        <div
          className={css(styles.filler)}
          style={
            {
              ...(window.innerHeight * 0.4 - this.state.scrollPosition <= menuHeight)
                ? { height: window.innerHeight * 0.4 }
                : { },
            }
          }
        >
          <div
            className={css(styles.headerRow)}
            style={
              {
                ...(window.innerHeight * 0.4 - this.state.scrollPosition > menuHeight * 2)
                  ? { padding: '0px 30px' }
                  : { padding: 0, height: window.innerHeight * 0.4 - this.state.scrollPosition + menuHeight, maxWidth: 'unset' },
                ...(window.innerHeight * 0.4 - this.state.scrollPosition <= menuHeight)
                  ? { position: 'fixed', top: 0, height: `${menuHeight}px`, overflow: 'hidden', boxShadow: 'rgb(243, 243, 243) 0px 0px 5px' }
                  : { },
              }
            }
          >
            {
              (window.innerHeight * 0.4 - this.state.scrollPosition > menuHeight * 2) && (
                <img src={(user.avatar && user.avatar.url) ? user.avatar.url : require('./images/avatar_placeholder.svg')}
                  className={css(styles.logo)}
                />
              )
            }
            <div className={css(styles.infoBlock)}>
              <div
                className={css(styles.topInfoRow)}
                style={
                  {
                    ...(window.innerHeight * 0.4 - this.state.scrollPosition > menuHeight * 2)
                      ? { }
                      : { borderBottom: '1px solid #F3F3F3', marginLeft: `${menuHeight + 25}px` },
                    ...(between(window.innerHeight * 0.4 - this.state.scrollPosition, menuHeight, menuHeight * 2))
                      ? { height: window.innerHeight * 0.4 - this.state.scrollPosition }
                      : { },
                  }
                }
              >
                {user.base_name}
              </div>
              <div
                className={css(styles.bottomInfoRow)}
                style={
                  {
                    ...(window.innerHeight * 0.4 - this.state.scrollPosition > menuHeight * 2)
                      ? { backgroundColor: '#FAFAFA' }
                      : { padding: '0px 30px', maxWidth: '1600px', marginLeft: 'auto', marginRight: 'auto' },
                  }
                }
              >
                <div>
                  <div>Роль:</div>
                  <div>{ this.userRoleToText(user.role) }</div>
                </div>
                <div>
                  <div>Достижения:</div>
                  <div>- / -</div>
                </div>
                <div>
                  <div>Карма:</div>
                  <div>-</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

SpotPoster.propTypes = {
  user: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  poster: {
    backgroundColor: '#718B9F',
    width: '100%',
    maxWidth: '100%',
    fontFamily: 'GilroyRegular',
    position: 'fixed',
    top: 0,
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    zIndex: '-1',
  },
  filler: {
    height: 'calc(20vh + 75px)',
    display: 'flex',
    flexFlow: 'column',
    justifyContent: 'flex-end',

    '@media screen and (max-width: 1440px)': {
      height: 'calc(20vh + 65px)',
    },
  },
  headerRow: {
    width: '100%',
    maxWidth: '1600px',
    height: '140px',
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingLeft: '30px',
    paddingRight: '30px',
    display: 'flex',
    flexFlow: 'row',

    '@media screen and (max-width: 1440px)': {
      height: '130px',
    },
  },
  logo: {
    height: 'calc(100% - 10px)',
    boxSizing: 'border-box',
    borderRadius: '70px',
    backgroundColor: '#f3f3f3',
    border: 'solid 5px white',

    '@media screen and (max-width: 1440px)': {
      borderRadius: '65px',
    },
  },
  infoBlock: {
    flex: 1,

    '> div': {
      height: '75px',
      lineHeight: '75px',
      paddingLeft: '22.5px',

      '@media screen and (max-width: 1440px)': {
        height: '65px',
        lineHeight: '65px',
      },
    },
  },
  topInfoRow: {
    fontSize: '22.5px',
    fontWeight: 600,
    textShadow: '0px 0px 1px #000',
    color: '#FAFAFA',
  },
  bottomInfoRow: {
    color: 'black',
    display: 'flex',
    flexFlow: 'row',

    '> div': {
      height: '100%',
      flex: 0,
      display: 'flex',
      flexFlow: 'column',
      padding: '0px 15px 0px 0px',

      '> div': {
        height: '50%',
        width: '100%',
        lineHeight: '37.5px',
        fontSize: '12px',
        fontWeight: 600,
        whiteSpace: 'nowrap',

        ':first-child': {
          color: '#BCC2C3',
          lineHeight: '30px',
        },
        ':last-child': {
          fontFamily: 'GilroyBold',
          lineHeight: '27px',
        },
        '@media screen and (max-width: 1440px)': {
          ':first-child': {
            color: '#BCC2C3',
            lineHeight: '45px',
          },
          lineHeight: '32.5px',
        },
      },
    },
  },
});

export default SpotPoster;
