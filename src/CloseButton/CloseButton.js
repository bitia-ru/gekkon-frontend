import React, {Component} from 'react';
import PropTypes          from 'prop-types';
import './CloseButton.css';

export default class CloseButton extends Component {
    render() {
        return <button className="close" onClick={this.props.onClick}></button>;
    }
}

CloseButton.propTypes = {
    onClick: PropTypes.func.isRequired
};
