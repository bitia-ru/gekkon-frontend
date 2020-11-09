import React from 'react';
import * as R from 'ramda';
import PropTypes from 'prop-types';
import './WallCardTable.css';
import WallPhotoCard from './WallPhotoCard';


const WallPhotosCardsLayout = ({ photos, onClick, selectedIds }) => (
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
              <WallPhotoCard
                photo={photo}
                onClick={onClick}
                selected={R.contains(photo.id, selectedIds)}
              />
            </div>
          </div>
        ),
      )(photos)
    }
  </div>
);

WallPhotosCardsLayout.propTypes = {
  photos: PropTypes.array.isRequired,
  onClick: PropTypes.func,
  selectedIds: PropTypes.array,
};

export default WallPhotosCardsLayout;
