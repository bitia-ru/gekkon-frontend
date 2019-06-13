import React, {Component} from 'react';
import PropTypes          from 'prop-types';
import './Person.css';

export default class Person extends Component {
    render() {
        return <div className="person">
            <div className="person__avatar">
                {
                    this.props.user.avatar
                        ? (
                            <img src={this.props.user.avatar.url}
                                 alt={this.props.user.name ? this.props.user.name : this.props.user.login}/>
                        )
                        : ''
                }
            </div>
            <div className="person__name">
                {this.props.user.name ? this.props.user.name : this.props.user.login}
            </div>
        </div>;
    }
}

Person.propTypes = {
    user: PropTypes.object.isRequired
};
