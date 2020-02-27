import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
// import { ToastContainer } from 'react-toastr';
// import Cookies from 'js-cookie';
// import InfoPageHeader from '@/v1/components/InfoPageHeader/InfoPageHeader';
import InfoPageContent from '@/v1/components/InfoPageContent/InfoPageContent';
import { TITLE, TITLES, FAQ_DATA } from '@/v1/Constants/Faq';
import getState from '@/v1/utils/getState';
import MainScreen from '../../layouts/MainScreen/MainScreen';
import Background from './images/faq.jpg';
import { StyleSheet, css } from '../../aphrodite';

class Faq extends React.PureComponent {
  render() {
    return (
      <MainScreen header={TITLE} styles={[styles.aboutUsHeader, styles.aboutUsHeaderTitle]}>
        <InfoPageContent titles={TITLES} data={FAQ_DATA} />
      </MainScreen>
    );
  }
}

const styles = StyleSheet.create({
  aboutUsHeader: {
    backgroundColor: '#EBEBE2',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '40vh',
    backgroundImage: `url(${Background})`,
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

const mapStateToProps = state => ({

});

export default withRouter(connect(mapStateToProps)(Faq));
