import React, {Component} from 'react';
import RouteCard          from '../RouteCard/RouteCard';
import * as R             from 'ramda';
import PropTypes          from 'prop-types';

export default class RouteCardTable extends Component {
    render() {
        return <div className="content__inner">
            {R.map((el) => <RouteCard key={el.id}
                                      imgSrc={el.photo ? el.photo.url : null}
                                      imgAlt={el.name}
                                      title={el.name ? el.name : ''}
                                      dateTime={el.installed_at}
                                      onRouteClick={() => this.props.onRouteClick(el.id)}
                                      dateTimeText={el.installed_at}/>, this.props.data)}
        </div>;
    }
}

RouteCardTable.propTypes = {
    data: PropTypes.array.isRequired
};
