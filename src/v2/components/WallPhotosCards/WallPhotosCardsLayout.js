import React from 'react';
import * as R from 'ramda';
import PropTypes from 'prop-types';
import './RouteCardTable.css';
import RoutePhotoCard from './RoutePhotoCard';


const RoutePhotosCardsLayout = ({ photos }) => (
  <div className="content__inner" onClick={(e) => { e.stopPropagation(); }}>
    {
      R.map(
        photo => (
          <div
            key={photo.id}
            className="content__col-md-4 content__col-lg-3"
            role="button"
            tabIndex={0}
            style={{ outline: 'none' }}
          >
            <div className="content__route-card">
              <RoutePhotoCard photo={photo} />
            </div>
          </div>
        ),
      )(photos)
    }
  </div>
);

RoutePhotosCardsLayout.propTypes = {
  photos: PropTypes.array.isRequired,
};

export default RoutePhotosCardsLayout;
