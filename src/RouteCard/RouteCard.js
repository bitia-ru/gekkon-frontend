import React             from 'react';
import PropTypes         from 'prop-types';
import {SOON_END_PERIOD} from '../Constants/Route';
import RouteStatus       from '../RouteStatus/RouteStatus';
import moment            from 'moment';
import {TimeFromNow}     from '../Constants/DateTimeFormatter';
import './RouteCard.css';

const RouteCard = ({
                       route, onRouteClick, ascent
                   }) => {
    moment.locale('ru');
    let date = moment().add(SOON_END_PERIOD, 'days');
    let installed_until = route.installed_until ? moment(route.installed_until) : null;
    const statusClass = ((ascent && ascent.result !== 'unsuccessful') ? ' route-card_done' : '');
    let year;
    let titleDate;
    let soonClass;
    if (route.installed_until) {
        year = (
            installed_until.format('YYYY') !== moment().format('YYYY')
                ? installed_until.format('YYYY')
                : ''
        );
        titleDate = installed_until.format('Do MMMM');
        soonClass = (
            (installed_until && date >= installed_until)
                ? ' route-card__date_end-soon'
                : ''
        );
    }
    const alarmIcon = "/public/img/route-card-sprite/card-sprite.svg#icon-alarm";
    const clockIcon = "/public/img/route-card-sprite/card-sprite.svg#icon-clock";
    const installedUntilValid = (installed_until && date >= installed_until);
    return (
        <div className="content__col-md-4 content__col-lg-3"
             role="button"
             tabIndex={0}
             style={{outline: 'none'}}
             onClick={onRouteClick ? onRouteClick : null}>
            <div className="content__route-card">
                <a className={'route-card' + statusClass}>
                    <article className="route-card__inner">
                        <div className="route-card__image">
                            <div className="route-card__image-inner">
                                {
                                    route.photo
                                        ? (
                                            <img src={route.photo.thumb_url}
                                                 alt={route.name}/>
                                        )
                                        : ''
                                }
                                {
                                    (ascent && ascent.result !== 'unsuccessful')
                                        ? (
                                            <div className="route-card__track-status">
                                                <RouteStatus ascent={ascent}/>
                                            </div>
                                        )
                                        : ''
                                }
                            </div>
                        </div>
                        <div className="route-card__info">
                            <div className="route-card__header">
                                <div className="route-card__number">
                                    {
                                        route.number
                                            ? `№${route.number}`
                                            : `#${route.id}`
                                    }
                                </div>
                                <h1 className="route-card__title">{route.name}</h1>
                            </div>
                            <div className="route-card__footer">
                                {
                                    route.installed_until
                                        ? (
                                            <span title={`Скрутят: ${titleDate} ${year}`}
                                                  className={'route-card__date' + soonClass}
                                            >
                                                <span
                                                    className="route-card__date-icon">
                                                    {
                                                        installedUntilValid
                                                            ? (
                                                                <svg>
                                                                    <use xlinkHref={alarmIcon}>
                                                                    </use>
                                                                </svg>
                                                            )
                                                            : (
                                                                <svg>
                                                                    <use xlinkHref={clockIcon}>
                                                                    </use>
                                                                </svg>
                                                            )
                                                    }
                                                </span>
                                                {TimeFromNow(moment(route.installed_until))}
                                            </span>
                                        )
                                        : (
                                            <span className="route-card__date"></span>
                                        )
                                }
                                <div className="route-card__level">
                                    {route.category}
                                </div>
                            </div>
                        </div>
                    </article>
                </a>
            </div>
        </div>
    )
};


RouteCard.propTypes = {
    ascent: PropTypes.object,
    onRouteClick: PropTypes.func,
    route: PropTypes.object.isRequired,
};

RouteCard.defaultProps = {
    ascent: null,
    onRouteClick: null,
};

export default RouteCard;
