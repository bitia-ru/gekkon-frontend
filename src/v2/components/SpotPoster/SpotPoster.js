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
    console.log(this.props.data);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.onWindowScroll);
  }

  onWindowScroll = (event) => {
    this.setState({ scrollPosition: document.querySelector('.page__scroll').scrollTop });
    console.log();
  };

  componentDidUpdate(newProps) {
    if (!newProps.data.photo || newProps.data.photo.url === this.state.imageUrl) {
      return;
    }

    if (this.state.imageUrl !== null) {
      this.setState({ imageUrl: null });
    }

    if (this.photosInternal[newProps.data.photo.url] !== undefined) {
      return;
    }

    this.photosInternal[newProps.data.photo.url] = new Image();
    this.photosInternal[newProps.data.photo.url].src = newProps.data.photo.url;
    this.photosInternal[newProps.data.photo.url].onload = () => {
      this.setState({ imageUrl: newProps.data.photo.url });
    };
  }

  render() {
    const { data } = this.props;
    const menuHeight = window.innerWidth > 1440 ? 75 : 65;

    return (
      <>
        <header
          className={css(styles.poster)}
          style={
            {
              height: `calc(40vh - ${this.state.scrollPosition}px)`,
              minHeight: `${menuHeight}px`,
              ...(
                data.photo
                && this.state.imageUrl
              )
                ? { backgroundImage: `url(${this.photosInternal[data.photo.url].src})` }
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
                ...(window.innerHeight * 0.4 - this.state.scrollPosition > menuHeight*2)
                  ? { padding: '0px 30px' }
                  : { padding: 0, height: window.innerHeight * 0.4 - this.state.scrollPosition + menuHeight, maxWidth: 'unset' },
                ...(window.innerHeight * 0.4 - this.state.scrollPosition <= menuHeight)
                  ? { position: 'fixed', top: 0, height: `${menuHeight}px`, overflow: 'hidden', boxShadow: 'rgb(243, 243, 243) 0px 0px 5px' }
                  : { },
              }
            }
          >
            {
              (window.innerHeight * 0.4 - this.state.scrollPosition > menuHeight*2) &&
                <img src={require('@/v2/components/Logo/images/lmstn_logo.png')}
                  className={css(styles.logo)}
                />
            }
            <div className={css(styles.infoBlock)}>
              <div
                className={css(styles.topInfoRow)}
                style={
                  {
                    ...(window.innerHeight * 0.4 - this.state.scrollPosition > menuHeight*2)
                      ? { }
                      : { borderBottom: '1px solid #F3F3F3', marginLeft: `${menuHeight + 25}px` },
                    ...(between(window.innerHeight * 0.4 - this.state.scrollPosition, menuHeight, menuHeight*2))
                      ? { height: window.innerHeight * 0.4 - this.state.scrollPosition }
                      : { },
                  }
                }
              >
                {data.name}
              </div>
              <div
                className={css(styles.bottomInfoRow)}
                style={
                  {
                    ...(window.innerHeight * 0.4 - this.state.scrollPosition > menuHeight*2)
                      ? { backgroundColor: '#FAFAFA' }
                      : { padding: '0px 30px', maxWidth: '1600px', marginLeft: 'auto', marginRight: 'auto' },
                  }
                }
              >
                <div>
                  <div>Адрес:</div>
                  <div>Новорязанская, 30Ас8</div>
                </div>
                <div>
                  <div>Часы работы:</div>
                  <div>10:00 - 23:00</div>
                </div>
                <div>
                  <div>Телефон:</div>
                  <div>+7 (495) 413-67-95</div>
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
  data: PropTypes.object.isRequired,
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
    height: 'calc(40vh + 75px)',
    display: 'flex',
    flexFlow: 'column',
    justifyContent: 'flex-end',

    '@media screen and (max-width: 1440px)': {
      height: 'calc(40vh + 65px)',
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
    border: 'solid 5px white',
    boxSizing: 'content-box',
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
