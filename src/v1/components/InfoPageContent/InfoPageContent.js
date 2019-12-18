import React from 'react';
import * as R from 'ramda';
import PropTypes from 'prop-types';
import './InfoPageContent.css';

const InfoPageContent = ({ titles, data }) => {
  const mapIndexed = R.addIndex(R.map);
  return (
    <div className="about-us-content">
      <div className="about-us-content__container">
        {
          mapIndexed(
            (paragraphs, index) => (
              <React.Fragment key={index}>
                <h2 className="about-us-content__title">{titles[index]}</h2>
                {
                  mapIndexed(
                    (paragraph, i) => (
                      <p key={i} className="about-us-content__text">
                        {paragraph}
                      </p>
                    ),
                    paragraphs,
                  )
                }
              </React.Fragment>
            ),
            data,
          )
        }
      </div>
    </div>
  );
};

InfoPageContent.propTypes = {
  titles: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
};

export default InfoPageContent;
