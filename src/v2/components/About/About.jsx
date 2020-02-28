import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import InfoPageContent from '../InfoPageContent/InfoPageContent';
import { TITLE, TITLES, ABOUT_DATA } from '@/v1/Constants/About';
import MainScreen from '@/v2/layouts/MainScreen/MainScreen';
import BackgroundImage from './images/about-us.jpg';
import { StyleSheet, css } from '../../aphrodite';

class About extends React.PureComponent {
  render() {
    return (
      <MainScreen header={TITLE} styles={[styles.background, styles.aboutUsHeaderTitle]}>
        <InfoPageContent titles={TITLES} data={ABOUT_DATA} />
      </MainScreen>
    );
  }
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: '#EBEBE2',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '40vh',
    backgroundImage: `url(${BackgroundImage})`,
  },
  aboutUsHeaderTitle: {
    fontSize: '100px',
    lineHeight: '1em',
    color: '#FDFDFD',
    fontWeight: 'normal',
    fontFamily: ['GilroyBold', ' sans-serif'],
    marginTop: '0',
    marginBottom: '0',
    '@media screen and (max-width: 1600px)': {
      fontSize: '70px',
      marginBottom: '60px',
    },
  },
});

const mapStateToProps = () => ({});

export default withRouter(connect(mapStateToProps)(About));
