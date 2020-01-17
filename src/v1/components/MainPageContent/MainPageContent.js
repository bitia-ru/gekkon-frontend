import React from 'react';
import * as R from 'ramda';
import SpotCard from '../SpotCard/SpotCard';
import NewsBlock from '../NewsBlock/NewsBlock';
import './MainPageContent.css';

import { SpotsData } from '../../Constants/Spots';

const MainPageContent = () => (
  <>
    <NewsBlock />
    <div className="main-page-content">
      <div className="main-page-content__wrapper">
        <h2 className="main-page-content__title">
          Скалодромы
        </h2>
      </div>
      <div className="main-page-content__container">
        {R.map(spot => <SpotCard key={spot.id} spot={spot} />, SpotsData)}
      </div>
    </div>
  </>
);

export default MainPageContent;
