import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { notAvail } from '@/v1/utils/index';
import { StyleSheet, css } from '../../aphrodite';

export default class LikeButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      btnIsBusy: false,
    };
  }

  onChange = () => {
    const { onChange } = this.props;
    if (!onChange) { return; }
    this.setState({ btnIsBusy: true }, () => onChange && onChange(this.afterChange));
  };

  afterChange = () => {
    this.setState({ btnIsBusy: false });
  };

  render() {
    const { numOfLikes, isLiked } = this.props;
    const { btnIsBusy } = this.state;
    const { onChange } = this;
    return (
      <button
        className={css(styles.likeButton, isLiked ? styles.likeButtonActive : '')}
        type="button"
        style={
          (notAvail(numOfLikes) || btnIsBusy)
            ? { cursor: 'wait' }
            : {}
        }
        onClick={btnIsBusy ? null : onChange}
      >
        <span className={css(styles.likeButtonIcon)}>
          <svg>
            <use xlinkHref={`${require('./images/like.svg').default}#icon-like`} />
          </svg>
        </span>
        <span className={css(styles.likeButtonCount)}>
          {
            notAvail(numOfLikes)
              ? <>&nbsp;</>
              : numOfLikes
          }
        </span>
      </button>
    );
  }
}

const styles = StyleSheet.create({
  likeButton: {
    backgroundColor: 'transparent',
    border: '0',
    boxShadow: 'none',
    padding: '0',
    display: 'flex',
    alignItems: 'center',
    fontFamily: ['GilroyRegular', 'sans-serif'],
    cursor: 'pointer',
    outline: 'none',
    '@media screen and (max-width: 1440px)': {
      height: '24px',
    },
    ':hover': {
      '> span:last-child': {
        color: '#1f1f1f',
      },
      '> svg': {
        fill: '#1f1f1f',
      },
    },
  },

  likeButtonCount: {
    ':hover': {
      color: '#1f1f1f',
    },
    color: '#828282',
    fontSize: '16px',
    transition: 'color .4s ease-out',
    lineHeight: '1.5em',
    '@media screen and (max-width: 1440px)': {
      fontSize: '14px',
    },
  },

  likeButtonIcon: {
    '> svg': {
      ':hover': {
        fill: '#1f1f1f',
      },
      transition: 'fill .4s ease-out',
      fill: '#828282',
    },
    width: '20px',
    height: '17px',
    display: 'flex',
    marginRight: '8px',
    marginTop: '-3px',
    '@media screen and (max-width: 1440px)': {
      marginTop: '-2px',
    },
  },
  likeButtonActive: {
    '> span:last-child': {
      color: '#ff3347',
    },
    '> svg:last-child': {
      fill: '#ff3347',
    },
    ':hover': {
      '> span:last-child': {
        color: '#ff3347',
      },
      '> svg:last-child': {
        fill: '#ff3347',
      },
    },
  },

});

LikeButton.propTypes = {
  numOfLikes: PropTypes.number,
  isLiked: PropTypes.bool,
  onChange: PropTypes.func,
};

LikeButton.defaultProps = {
  isLiked: false,
};
