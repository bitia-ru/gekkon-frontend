import React from 'react';
import * as R from 'ramda';
import { css, StyleSheet } from '../../../aphrodite';
import SpotCardLayout from '../SpotCard/SpotCardLayout';


const SpotsCardViewLayout = ({ spots, onSpotClicked, style: inputStyle }) => (
  <div className={css(inputStyle, style.container)}>
    {
      R.map(
        spot => (
          <SpotCardLayout
            key={spot.id}
            className={css(style.card)}
            spot={spot}
            onClick={() => onSpotClicked && onSpotClicked(spot.id)}
          />
        ),
      )(spots)
    }
  </div>
);

const style = StyleSheet.create({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    margin: '-20px',
  },
  card: {
    margin: '20px',
    width: 'calc(20% - 40px)',

    '@media screen and (max-width: 1800px)': {
      width: 'calc(25% - 40px)',
    },

    '@media screen and (max-width: 1300px)': {
      width: 'calc(33.3% - 40px)',
    },
  },
});


export default SpotsCardViewLayout;
