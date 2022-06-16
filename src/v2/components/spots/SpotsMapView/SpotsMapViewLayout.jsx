import React from 'react';
import * as R from 'ramda';
// TODO: import { YMaps, Map, Placemark } from 'react-yandex-maps';
import { css, StyleSheet } from '../../../aphrodite';


const SpotsMapViewLayout = ({ spots, onSpotClicked, style: inputStyle }) => (
  <div className={css(inputStyle, style.container)}>
    {
      //<YMaps>
      //  <Map
      //    className={css(style.map)}
      //    defaultState={{ center: [55.75, 37.57], zoom: 11 }}
      //  >
      //    {
      //      R.map(
      //        spot => (
      //          <Placemark
      //            geometry={spot.data.coordinates}
      //            properties={{
      //              iconCaption: spot.name,
      //            }}
      //            onClick={() => onSpotClicked && onSpotClicked(spot.id)}
      //          />
      //        ),
      //      )(R.filter(spot => spot.data && spot.data.coordinates)(spots))
      //    }
      //  </Map>
      //</YMaps>
    }
  </div>
);

const style = StyleSheet.create({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  map: {
    width: '100%',
    height: '80vh',
  },
});


export default SpotsMapViewLayout;
