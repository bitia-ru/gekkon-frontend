import React from 'react';
import { withRouter } from 'react-router-dom';
import MainScreen from '../layouts/MainScreen/MainScreen';
import SpotsBlock from '@/v2/components/spots/SpotsBlock/SpotsBlock';
import MainPageHeader from '@/v2/components/MainPageHeader/MainPageHeader';

class SpotsIndex extends React.PureComponent {
  render() {
    return (
      <MainScreen
        header={
          <MainPageHeader />
        }
      >
        <SpotsBlock />
      </MainScreen>
    );
  }
}

export default withRouter(SpotsIndex);
