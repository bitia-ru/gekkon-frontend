import React from 'react';
import { css, StyleSheet } from '../../../aphrodite';
import SpotsCardView from '@/v2/components/spots/SpotsCardView/SpotsCardView';
import ViewModeSwitcher from '../../common/ViewModeSwitcher/ViewModeSwitcher';
import SpotsMapView from '@/v2/components/spots/SpotsMapView/SpotsMapView';


const SpotsBlockLayout = ({ spots, onSpotClicked, viewMode }) => (
  <div className={css(style.container)}>
    <div className={css(style.headerRow)}>
      <div className={css(style.title)}>Скалодромы</div>
      <div className={css(style.viewModeSwitcher)}>
        <ViewModeSwitcher
          viewModeData={{ scheme: {}, list: {} }}
          onViewModeChange={viewMode && viewMode.onChange}
          viewMode={viewMode && viewMode.value}
        />
      </div>
    </div>
    {
      viewMode && viewMode.value === 'scheme' ? (
        <SpotsMapView spots={spots} onSpotClicked={onSpotClicked} />
      ) : (
        <SpotsCardView spots={spots} onSpotClicked={onSpotClicked} />
      )
    }
  </div>
);

const style = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: '70px',
    marginBottom: '150px',
    backgroundColor: '#FAFAFA',
    maxWidth: '1750px',
    marginLeft: 'auto',
    marginRight: 'auto',

    '@media screen and (max-width: 1800px)': {
      maxWidth: '1500px',
      marginLeft: 'auto',
      marginRight: 'auto',
    },

    '@media screen and (max-width: 1600px)': {
      margin: '50px 50px 100px 50px',
    },
  },
  headerRow: {
    display: 'flex',
    fontSize: '38px',
    fontFamily: 'GilroyBold, sans-serif',
    marginBottom: '70px',

    '@media screen and (max-width: 1600px)': {
      fontSize: '32px',
      marginBottom: '30px',
    },

    '@media screen and (max-width: 1440px)': {
      fontSize: '24px',
      marginBottom: '30px',
    },
  },
  title: {
    flex: 1,
  },
  viewModeSwitcher: {
    flex: '0 0 60px',
  },
});

export default SpotsBlockLayout;
