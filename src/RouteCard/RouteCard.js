import React, {Component} from 'react';
import PropTypes          from 'prop-types';
import {SOON_END_PERIOD}  from '../Constants/Route';
import RouteStatus        from '../RouteStatus/RouteStatus';
import moment             from 'moment';
import {TimeFromNow}      from '../Constants/DateTimeFormatter';
import './RouteCard.css';

export default class RouteCard extends Component {

    render() {
        moment.locale('ru');
        let date = moment().add(SOON_END_PERIOD, 'days');
        let installed_until = this.props.route.installed_until ? moment(this.props.route.installed_until) : null;
        return <div className="content__col-md-4 content__col-lg-3"
                    onClick={this.props.onRouteClick ? this.props.onRouteClick : () => {
                    }}>
            <div className="content__route-card">
                <a className={'route-card' + ((this.props.ascent && this.props.ascent.result !== 'unsuccessful') ? ' route-card_done' : '')}>
                    <article className="route-card__inner">
                        <div className="route-card__image">
                            <div className="route-card__image-inner">
                                {this.props.route.photo ?
                                    <img src={this.props.route.photo.thumb_url} alt={this.props.route.name}/> : ''}
                                {(this.props.ascent && this.props.ascent.result !== 'unsuccessful') ?
                                    <div className="route-card__track-status">
                                        <RouteStatus ascent={this.props.ascent}/>
                                    </div> : ''}
                            </div>
                        </div>
                        <div className="route-card__info">
                            <div className="route-card__header">
                                <div className="route-card__number">{this.props.route.number ? `№${this.props.route.number}` : `#${this.props.route.id}`} </div>
                                <h1 className="route-card__title">{this.props.route.name}</h1>
                            </div>
                            <div className="route-card__footer">
                                {this.props.route.installed_until ?
                                    <span title={`Скрутят: ${installed_until.format('Do MMMM')} ${(installed_until.format('YYYY') !== moment().format('YYYY') ? installed_until.format('YYYY') : '')}`}
                                        className={'route-card__date' + ((installed_until && date >= installed_until) ? ' route-card__date_end-soon' : '')}>
							<span className="route-card__date-icon">
                                {(installed_until && date >= installed_until) ? <svg>
                                    <use xlinkHref="/public/img/route-card-sprite/card-sprite.svg#icon-alarm"></use>
                                </svg> : <svg>
                                    <use xlinkHref="/public/img/route-card-sprite/card-sprite.svg#icon-clock"></use>
                                </svg>}
							</span>
                                        {TimeFromNow(moment(this.props.route.installed_until))}</span> :
                                    <span className="route-card__date"></span>}
                                <div className="route-card__level">
                                    {this.props.route.category}
                                </div>
                            </div>
                        </div>
                    </article>
                </a>
            </div>
        </div>;
    }
}

RouteCard.propTypes = {
    route: PropTypes.object.isRequired
};
