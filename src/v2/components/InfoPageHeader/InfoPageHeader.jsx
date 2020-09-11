import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, css } from '../../aphrodite';

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
      image,
      title,
      height,
      bgHeaderColor,
    } = this.props;
    const { bgImageLoaded } = this.state;
    return (
      <header
        className={css(styles.aboutUsHeader)}
        style={
          bgImageLoaded
            ? {
              backgroundImage: `url(${image})`,
              height: height || '40vh',
            }
            : {
              backgroundColor: bgHeaderColor || '#718b9f',
              height: height || '40vh',
            }
        }
      >
        <div className={css(styles.aboutUsHeaderContent)}>
          <h1 className={css(styles.aboutUsHeaderTitle)}>{title}</h1>
        </div>
      </header>
    );
  }
}

const styles = StyleSheet.create({
  aboutUsHeader: {
    backgroundColor: '#EBEBE2',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  aboutUsHeaderTitle: {
    fontSize: '100px',
    lineHeight: '1em',
    color: '#FDFDFD',
    fontWeight: 'normal',
    fontFamily: ['GilroyBold', 'sans-serif'],
    marginTop: '150px',
    marginBottom: '0',
    '@media screen and (max-width: 1600px)': {
      fontSize: '70px',
      marginBottom: '60px',
    },
  },
  aboutUsHeaderContent: {
    height: 'calc(40vh - 75px)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    maxHeight: '900px',
    width: '82%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
});

InfoPageHeader.propTypes = {
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  height: PropTypes.string,
  bgHeaderColor: PropTypes.string,
};
