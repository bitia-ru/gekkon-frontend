import React, {Component} from 'react';
import PropTypes          from 'prop-types';
import './FormField.css';

export default class FormField extends Component {

    onKeyPress = (event) => {
        if (event.key === 'Enter' && this.props.onEnter) {
            this.props.onEnter();
        }
    };

    render() {
        return <div className={'form__field' + (this.props.hasError ? ' form__field-error' : '')}>
									<span className="form__input-wrapper">
										<input id={this.props.id}
                           disabled={this.props.disabled ? true : false}
                           className={'form__input' + (this.props.type === 'number' ? ' form__input-number' : '')}
                           type={this.props.type}
                           value={this.props.value}
                           onChange={this.props.onChange}
                           onKeyPress={this.onKeyPress}
                           placeholder={this.props.placeholder}/>
										<label htmlFor={this.props.id}
                           className="form__label">{this.props.placeholder}</label>
									</span>
            {
                this.props.hasError
                    ? (
                        <div className="form__field-error-message">
                            {this.props.errorText}
                        </div>
                    )
                    : ''
            }
        </div>;
    }
}

FormField.propTypes = {
    placeholder: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    type: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([
        PropTypes.string.isRequired,
        PropTypes.number.isRequired
    ])
};
