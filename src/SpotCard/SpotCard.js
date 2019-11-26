import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './SpotCard.css';

const SpotCard = ({
  spot,
}) => {
  const spotCardSprite = require('./images/spot-card-sprite.svg');
  const iconSquare = `${spotCardSprite}#icon-square`;
  const iconHeight = `${spotCardSprite}#icon-height`;
  const iconHooks = `${spotCardSprite}#icon-hooks`;
  const iconPlace = `${spotCardSprite}#icon-place`;
  const iconNext = `${spotCardSprite}#icon-next`;
  return (
    <div className="spot-card-container__col-lg-4 spot-card-container__col-md-2">
      <article className={`spot-card ${spot.className}`}>
        <Link to={`/spots/${spot.id}`} id={`linkToRoutes${spot.id}`} />
        <a
          className="spot-card__inner"
          role="link"
          tabIndex={0}
          style={{ outline: 'none' }}
          onClick={() => document.getElementById(`linkToRoutes${spot.id}`).click()}
        >
          <h1 className="spot-card__title">{spot.name}</h1>
          <div className="spot-card__content">
            <ul className="spot-card__list">
              {spot.info1 && (
                <li className="spot-card__list-item">
                  <span className="spot-card__list-icon">
                    <svg>
                      <use
                        xlinkHref={iconSquare}
                      />
                    </svg>
                  </span>
                  {spot.info1}
                </li>
              )}
              {spot.info2 && (
                <li className="spot-card__list-item">
                  <span className="spot-card__list-icon">
                    <svg>
                      <use
                        xlinkHref={iconHeight}
                      />
                    </svg>
                  </span>
                  {spot.info2}
                </li>
              )}
              {spot.info3 && (
                <li className="spot-card__list-item">
                  <span className="spot-card__list-icon">
                    <svg>
                      <use
                        xlinkHref={iconHooks}
                      />
                    </svg>
                  </span>
                  {spot.info3}
                </li>
              )}
              {spot.info4 && (
                <li className="spot-card__list-item">
                  <span className="spot-card__list-icon">
                    <svg>
                      <use
                        xlinkHref={iconHooks}
                      />
                    </svg>
                  </span>
                  {spot.info4}
                </li>
              )}
              <li className="spot-card__list-item">
                <span className="spot-card__list-icon">
                  <svg>
                    <use
                      xlinkHref={iconPlace}
                    />
                  </svg>
                </span>
                {spot.address}
              </li>
            </ul>
            <div className="spot-card__descr">
              <p className="spot-card__descr-text">
                {spot.description}
              </p>
              <span className="spot-card__link">
									Список трасс
                <span className="spot-card__link-icon">
                  <svg>
                    <use
                      xlinkHref={iconNext}
                    />
                  </svg>
                </span>
              </span>
            </div>
            <div className="spot-card__img">
              <img src={spot.imgSrc} alt={`Скалодром ${spot.name}`} />
            </div>
          </div>
        </a>
      </article>
    </div>
  );
};

SpotCard.propTypes = {
  spot: PropTypes.object.isRequired,
};

export default SpotCard;
