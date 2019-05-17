import React     from 'react';
import PropTypes from 'prop-types';
import {Link}    from 'react-router-dom';
import './SpotCard.css';

export default class SpotCard extends React.Component {

    render() {
        return <div className="spot-card-container__col-lg-4">
            <article className={'spot-card ' + this.props.spot.className}>
                <Link to={'/spots/' + this.props.spot.id} id={'linkToRoutes' + this.props.spot.id}></Link>
                <a className="spot-card__inner"
                   onClick={() => document.getElementById(`linkToRoutes${this.props.spot.id}`).click()}>
                    <h1 className="spot-card__title">{this.props.spot.name}</h1>
                    <div className="spot-card__content">
                        <ul className="spot-card__list">
                            { this.props.spot.info1 && <li className="spot-card__list-item">
									<span className="spot-card__list-icon">
										<svg>
											<use
                                                xlinkHref="/public/img/spot-card-sprite/spot-card-sprite.svg#icon-square"></use>
										</svg>
									</span>
                                {this.props.spot.info1}
                            </li> }
                            { this.props.spot.info2 && <li className="spot-card__list-item">
									<span className="spot-card__list-icon">
										<svg>
											<use
                                                xlinkHref="/public/img/spot-card-sprite/spot-card-sprite.svg#icon-height"></use>
										</svg>
									</span>
                                {this.props.spot.info2}
                            </li> }
                            { this.props.spot.info3 && <li className="spot-card__list-item">
									<span className="spot-card__list-icon">
										<svg>
											<use
                                                xlinkHref="/public/img/spot-card-sprite/spot-card-sprite.svg#icon-hooks"></use>
										</svg>
									</span>
                                {this.props.spot.info3}
                            </li> }
                            { this.props.spot.info4 && <li className="spot-card__list-item">
									<span className="spot-card__list-icon">
										<svg>
											<use
                                                xlinkHref="/public/img/spot-card-sprite/spot-card-sprite.svg#icon-hooks"></use>
										</svg>
									</span>
                                {this.props.spot.info4}
                            </li> }
                            <li className="spot-card__list-item">
									<span className="spot-card__list-icon">
										<svg>
											<use
                                                xlinkHref="/public/img/spot-card-sprite/spot-card-sprite.svg#icon-place"></use>
										</svg>
									</span>
                                {this.props.spot.address}
                            </li>
                        </ul>
                        <div className="spot-card__descr">
                            <p className="spot-card__descr-text">
                                {this.props.spot.description}
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
                            <img src={this.props.spot.imgSrc} alt={'Скалодром ' + this.props.spot.name}/>
                        </div>
                    </div>
                </a>
            </article>
        </div>
    }
}

SpotCard.propTypes = {
    spot: PropTypes.object.isRequired
};
