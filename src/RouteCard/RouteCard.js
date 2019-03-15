import React, {Component} from 'react';
import PropTypes          from 'prop-types';
import './RouteCard.css';

export default class RouteCard extends Component {

    render() {
        return <div className="content__col-md-4 content__col-lg-3" onClick={this.props.onRouteClick ? this.props.onRouteClick : () => {}}>
            <a href="#" className="route-card content__route-card">
                <article href="#" className="route-card__inner">
                    <div className="route-card__image">
                        {this.props.imgSrc ?
                            <img src={this.props.imgSrc} alt={this.props.imgAlt}/> : ''}
                    </div>
                    <div className="route-card__info">
                        <div className="route-card__header">
                            <h1 className="route-card__title">{this.props.title}</h1>
                            <time className="route-card__date"
                                  dateTime={this.props.dateTime}>{this.props.dateTimeText}</time>
                        </div>
                    </div>
                </article>
            </a>
        </div>;
    }
}

RouteCard.propTypes = {
    title: PropTypes.string.isRequired
};
