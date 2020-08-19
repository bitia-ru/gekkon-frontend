import React from 'react';
import PropTypes from 'prop-types';
import MainScreen from '@/v2/layouts/MainScreen/MainScreen';
import EntityPoster from '@/v2/example/components/EntityPoster';
import EntityLogo from '@/v2/example/components/EntityLogo';
import EntityInfoBlock from '@/v2/example/components/EntityInfoBlock';
import EntityTabs from '@/v2/example/components/EntityTabs';
import { StyleSheet, css } from '@/v2/aphrodite';

const styles = StyleSheet.create({
  infoBlockContainer: {
    display: 'flex',
    height: '220px',
    marginBottom: '100px',
    marginTop: '-110px',
  },
  infoContainer: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 3,
    minWidth: '470px',
    height: '220px',
    marginLeft: '30px',
    '@media screen and (max-width: 1600px)': { width: '560px' },
  },
  titleContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: '110px',
    fontFamily: 'Gilroy',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: '40px',
    lineHeight: '50px',
    color: '#FFFFFF',
    zIndex: 1,
    '@media screen and (max-width: 1600px)': { fontSize: '34px' },
  },
  contentContainer: {
    display: 'flex',
    border: '1px solid grey',
    minWidth: '960px',
    height: '1000px',
    margin: '0px 160px 100px 160px',
  },
});

const EntityPage = ({
  poster,
  bgHeaderColor,
  logo,
  avatar,
  title,
  infoBlockItems,
  tabsItems,
}) => (
  <MainScreen>
    <EntityPoster poster={poster} bgHeaderColor={bgHeaderColor} />
    <div className={css(styles.infoBlockContainer)}>
      <EntityLogo logo={logo} avatar={avatar} />
      <div className={css(styles.infoContainer)}>
        <div className={css(styles.titleContainer)}>{title}</div>
        <EntityInfoBlock infoBlockItems={infoBlockItems} />
      </div>
      <EntityTabs tabsItems={tabsItems} />
    </div>
    <div className={css(styles.contentContainer)} />
  </MainScreen>
);

EntityPage.propTypes = {
  poster: PropTypes.string,
  bgHeaderColor: PropTypes.string,
  logo: PropTypes.string,
  avatar: PropTypes.string,
  title: PropTypes.string,
  infoBlockItems: PropTypes.array,
  tabsItems: PropTypes.array,
};

export default EntityPage;
