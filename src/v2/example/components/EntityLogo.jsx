import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, css } from '@/v2/aphrodite';

const styles = StyleSheet.create({
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    zIndex: 1,
  },
  logo: {
    minHeight: '220px',
    minWidth: '220px',
    marginLeft: '160px',
  },
  avatar: {
    minHeight: '160px',
    minWidth: '160px',
    marginLeft: '220px',
    borderRadius: '80px',
  },
  imageWrapper: {
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundColor: '#1A1A1A',
  },
  logoWrapper: {
    height: '200px',
    width: '200px',
  },
  avatarWrapper: {
    height: '140px',
    width: '140px',
    borderRadius: '80px',
  },
});

const EntityLogo = ({ logo, avatar }) => {
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    const bgImg = new Image();
    bgImg.onload = () => setImgLoaded(true);
    bgImg.src = logo || avatar;
  }, [logo, avatar]);

  return (
    <div className={css(styles.logoContainer)}>
      {
        logo ? (
          <div className={css(styles.imageContainer, styles.logo)}>
            <div
              className={css(styles.imageWrapper, styles.logoWrapper)}
              style={imgLoaded ? { backgroundImage: `url(${logo})` } : {}}
            />
          </div>
        ) : (
          <div className={css(styles.imageContainer, styles.avatar)}>
            <div
              className={css(styles.imageWrapper, styles.avatarWrapper)}
              style={imgLoaded ? { backgroundImage: `url(${avatar})` } : {}}
            />
          </div>
        )
      }
    </div>
  );
};

EntityLogo.propTypes = {
  logo: PropTypes.string,
  avatar: PropTypes.string,
};

export default EntityLogo;
