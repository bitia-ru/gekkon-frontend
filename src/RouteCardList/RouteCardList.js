import React, {Component} from 'react';
import PropTypes          from 'prop-types';

export default class RouteCardList extends Component {

    render() {
        return <div>
            List
        </div>;
    }
}

RouteCardList.propTypes = {
    data: PropTypes.array.isRequired
};
