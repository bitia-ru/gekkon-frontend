import React, {Component} from 'react';
import RouteCardTable     from '../RouteCardTable/RouteCardTable';
import RouteCardList      from '../RouteCardList/RouteCardList';
import PropTypes          from 'prop-types';

export default class RouteCardView extends Component {
    render() {
        return <React.Fragment>
            {this.props.viewMode === 'table' ? <RouteCardTable data={this.props.routes} onRouteClick={this.props.onRouteClick}/> :
                <RouteCardList data={this.props.routes} onRouteClick={this.props.onRouteClick}/>}
        </React.Fragment>;
    }
}

RouteCardView.propTypes = {
    viewMode: PropTypes.string.isRequired,
    routes: PropTypes.array.isRequired
};
