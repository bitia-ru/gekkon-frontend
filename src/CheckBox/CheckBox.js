import React, {Component} from 'react';
import PropTypes          from 'prop-types';
import './CheckBox.css';

export default class CheckBox extends Component {
    render() {
        return <div className="form__checkbox">
            <input id={this.props.id} type="checkbox" name={this.props.id} checked={this.props.checked} onChange={this.props.onChange}/>
            <label htmlFor={this.props.id}>{this.props.title}</label>
        </div>;
    }
}

CheckBox.propTypes = {
    id: PropTypes.string.isRequired,
    checked: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired
};
