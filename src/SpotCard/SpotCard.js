import React     from 'react';
import PropTypes from 'prop-types';
import {Link}    from 'react-router-dom';
import './SpotCard.css';

const SpotCard = ({
                      spot,
                  }) => (
    <div className="spot-card-container__col-lg-4">
        <article className={'spot-card ' + spot.className}>
            <Link to={'/spots/' + spot.id} id={'linkToRoutes' + spot.id}></Link>
            <a className="spot-card__inner"
               onClick={() => document.getElementById(`linkToRoutes${spot.id}`).click()}>
                <h1 className="spot-card__title">{spot.name}</h1>
                <div className="spot-card__content">
                    <ul className="spot-card__list">
                        {spot.info1 && <li className="spot-card__list-item">
									<span className="spot-card__list-icon">
										<svg>
											<use
                                                xlinkHref="/public/img/spot-card-sprite/spot-card-sprite.svg#icon-square"></use>
										</svg>
									</span>
                            {spot.info1}
                        </li>}
                        {spot.info2 && <li className="spot-card__list-item">
									<span className="spot-card__list-icon">
										<svg>
											<use
                                                xlinkHref="/public/img/spot-card-sprite/spot-card-sprite.svg#icon-height"></use>
										</svg>
									</span>
                            {spot.info2}
                        </li>}
                        {spot.info3 && <li className="spot-card__list-item">
									<span className="spot-card__list-icon">
										<svg>
											<use
                                                xlinkHref="/public/img/spot-card-sprite/spot-card-sprite.svg#icon-hooks"></use>
										</svg>
									</span>
                            {spot.info3}
                        </li>}
                        {spot.info4 && <li className="spot-card__list-item">
									<span className="spot-card__list-icon">
										<svg>
											<use
                                                xlinkHref="/public/img/spot-card-sprite/spot-card-sprite.svg#icon-hooks"></use>
										</svg>
									</span>
                            {spot.info4}
                        </li>}
                        <li className="spot-card__list-item">
									<span className="spot-card__list-icon">
										<svg>
											<use
                                                xlinkHref="/public/img/spot-card-sprite/spot-card-sprite.svg#icon-place"></use>
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
                                                xlinkHref="/public/img/spot-card-sprite/spot-card-sprite.svg#icon-next"></use>
										</svg>
									</span>
								</span>
                    </div>
                    <div className="spot-card__img">
                        <img src={spot.imgSrc} alt={'Скалодром ' + spot.name}/>
                    </div>
                </div>
            </a>
        </article>
    </div>
);

SpotCard.propTypes = {
    spot: PropTypes.object.isRequired,
};

export default SpotCard;
