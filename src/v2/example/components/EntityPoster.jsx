import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, css } from '@/v2/aphrodite';

const styles = StyleSheet.create({
  posterContainer: {
    height: '385px',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
});

const EntityPoster = ({ poster, bgHeaderColor }) => {
  const [posterLoaded, setPosterLoaded] = useState(false);

  useEffect(() => {
    const bgPoster = new Image();
    bgPoster.onload = () => setPosterLoaded(true);
    bgPoster.src = poster;
  }, [poster]);

  return (
    <>
      {
        poster ? (
          <div
            className={css(styles.posterContainer)}
            style={posterLoaded ? { backgroundImage: `url(${poster})` } : {}}
          />
        ) : (
          <div
            className={css(styles.posterContainer)}
            style={{ backgroundColor: bgHeaderColor }}
          />
        )
      }
    </>
  );
};

EntityPoster.propTypes = {
  poster: PropTypes.string,
  bgHeaderColor: PropTypes.string,
};

export default EntityPoster;
