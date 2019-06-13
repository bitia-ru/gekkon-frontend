import React, {Component} from 'react';
import RouteCardTable     from '../RouteCardTable/RouteCardTable';
import RouteCardList      from '../RouteCardList/RouteCardList';
import PropTypes          from 'prop-types';

export default class RouteCardView extends Component {
    render() {
        return <React.Fragment>
            {this.props.viewMode === 'table'
                ? (
                    <RouteCardTable routes={this.props.routes}
                                    ascents={this.props.ascents}
                                    addRoute={this.props.addRoute}
                                    sectorId={this.props.sectorId}
                                    onRouteClick={this.props.onRouteClick}
                                    ctrlPressed={this.props.ctrlPressed}
                                    user={this.props.user}
                    />
                )
                : (
                    <RouteCardList routes={this.props.routes}
                                   ascents={this.props.ascents}
                                   addRoute={this.props.addRoute}
                                   sectorId={this.props.sectorId}
                                   onRouteClick={this.props.onRouteClick}
                                   user={this.props.user}
                    />
                )
            }
        </React.Fragment>;
    }
}

RouteCardView.propTypes = {
    viewMode: PropTypes.string.isRequired,
    routes: PropTypes.array.isRequired,
    ascents: PropTypes.array.isRequired,
    ctrlPressed: PropTypes.bool.isRequired,
    addRoute: PropTypes.func.isRequired,
    sectorId: PropTypes.number.isRequired
};
