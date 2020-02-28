import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import MainScreen from '../../layouts/MainScreen/MainScreen';
import InfoPageHeader from '../InfoPageHeader/InfoPageHeader';
import InfoPageContent from '../InfoPageContent/InfoPageContent';
import { TITLE, TITLES, ABOUT_DATA } from '@/v1/Constants/About';
import BackgroundImage from './images/about-us.jpg';

class About extends React.PureComponent {
  render() {
    return (
      <MainScreen
        header={
          <InfoPageHeader
            image={BackgroundImage}
            title={TITLE}
          />
        }
      >
        <InfoPageContent titles={TITLES} data={ABOUT_DATA} />
      </MainScreen>
    );
  }
}

const mapStateToProps = () => ({});

export default withRouter(connect(mapStateToProps)(About));
