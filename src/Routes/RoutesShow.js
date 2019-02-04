import React              from 'react';
import {Link, withRouter} from 'react-router-dom';
import {connect}          from 'react-redux';
import * as R             from 'ramda';

class RoutesShow extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            route: {}
        }
    }

    componentDidMount() {
        this.setState({route: R.find(R.propEq('id', parseInt(this.props.match.params.id, 10)))(this.props.routes)});
    }

    render() {
        return <div>
            <React.Fragment>{this.state.route ? <h1>{this.state.route.name}</h1> : ''}</React.Fragment>
            <p><Link to='/routes'>Назад</Link></p>
        </div>
    }
};

const mapStateToProps = state => ({
    routes: state.routes
});

export default withRouter(connect(mapStateToProps)(RoutesShow));
