import React from 'react';
import MainScreen from '../../screens/Main/Main';
import InfoPageHeader from '../InfoPageHeader/InfoPageHeader';
import InfoPageContent from '../InfoPageContent/InfoPageContent';
import { ABOUT_DATA, TITLE, TITLES } from '../../Constants/About';


const About = () => (
  <MainScreen
    header={<InfoPageHeader title={TITLE} image={require('./images/about-us.jpg')} />}
  >
    <InfoPageContent titles={TITLES} data={ABOUT_DATA} />
  </MainScreen>
);

export default About;
