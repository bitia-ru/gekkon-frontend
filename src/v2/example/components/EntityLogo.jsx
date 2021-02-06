import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, css } from '@/v2/aphrodite';

const styles = StyleSheet.create({
  entityLogoContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  entityLogoImageContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    zIndex: 1,
  },
  entityLogo: {
    minHeight: '220px',
    minWidth: '220px',
    marginLeft: '160px',
  },
  entityLogoAvatar: {
    minHeight: '160px',
    minWidth: '160px',
    marginLeft: '220px',
    borderRadius: '80px',
  },
  entityLogoImageWrapper: {
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundColor: '#1A1A1A',
  },
  entityLogoWrapper: {
    height: '200px',
    width: '200px',
  },
  entityLogoAvatarWrapper: {
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
    <div className={css(styles.entityLogoContainer)}>
      {
        logo ? (
          <div className={css(styles.entityLogoImageContainer, styles.entityLogoAvatar)}>
            <div
              className={css(styles.entityLogoImageWrapper, styles.entityLogoAvatarWrapper)}
              style={imgLoaded ? { backgroundImage: `url(${avatar})` } : {}}
            />
          </div>
        ) : (
          <div className={css(styles.entityLogoImageContainer, styles.entityLogo)}>
            <div
              className={css(styles.entityLogoImageWrapper, styles.entityLogoWrapper)}
              style={imgLoaded ? { backgroundImage: `url(${logo})` } : {}}
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
