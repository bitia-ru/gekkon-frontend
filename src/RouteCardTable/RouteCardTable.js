import React, {Component} from 'react';
import RouteCard          from '../RouteCard/RouteCard';
import * as R             from 'ramda';
import PropTypes          from 'prop-types';
import './RouteCardTable.css';

export default class RouteCardTable extends Component {
    render() {
        return <div className="content__inner">
            {(this.props.sectorId !== 0 && this.props.user && (this.props.user.role === 'admin' || this.props.user.role === 'creator') && this.props.ctrlPressed) ?
                <div className="content__col-md-4 content__col-lg-3">
                    <div className="content__route-card">
                        <a className="route-card route-card__edit" onClick={this.props.addRoute}>
                            <span className="route-card__edit-icon"></span>
                            <span className="route-card__edit-title">Добавить новую трассу</span>
                        </a>
                    </div>
                </div> : ''}
            {R.map((route) => <RouteCard key={route.id}
                                         route={route}
                                         ascent={R.find((ascent) => ascent.route_id === route.id, this.props.ascents)}
                                         onRouteClick={() => this.props.onRouteClick(route.id)}/>, this.props.routes)}
        </div>;
    }
}

RouteCardTable.propTypes = {
    routes: PropTypes.array.isRequired,
    ascents: PropTypes.array.isRequired,
    ctrlPressed: PropTypes.bool.isRequired,
    addRoute: PropTypes.func.isRequired,
    sectorId: PropTypes.number.isRequired
};
