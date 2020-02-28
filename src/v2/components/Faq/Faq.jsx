import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import MainScreen from '../../layouts/MainScreen/MainScreen';
import InfoPageHeader from '../InfoPageHeader/InfoPageHeader';
import InfoPageContent from '../InfoPageContent/InfoPageContent';
import { TITLE, TITLES, FAQ_DATA } from '@/v1/Constants/Faq';
import Background from './images/faq.jpg';

class Faq extends React.PureComponent {
  render() {
    return (
      <MainScreen
        header={
          <InfoPageHeader
            image={Background}
            title={TITLE}
          />
        }
      >
        <InfoPageContent
          titles={TITLES}
          data={FAQ_DATA}
        />
      </MainScreen>
    );
  }
}

const mapStateToProps = () => ({});

export default withRouter(connect(mapStateToProps)(Faq));
