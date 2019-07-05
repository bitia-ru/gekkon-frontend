import React, {Component} from 'react';
import PropTypes          from 'prop-types';
import './FormField.css';

export default class FormField extends Component {

    onKeyPress = (event) => {
        const {onEnter} = this.props;
        if (event.key === 'Enter' && onEnter) {
            onEnter();
        }
    };

    render() {
        const {
                  hasError, id, disabled, type, value, onChange, placeholder, errorText,
              } = this.props;
        const inputClass = 'form__input' + (type === 'number' ? ' form__input-number' : '');
        return <div className={'form__field' + (hasError ? ' form__field-error' : '')}>
									<span className="form__input-wrapper">
										<input id={id}
                                               disabled={disabled ? true : false}
                                               className={inputClass}
                                               type={type}
                                               value={value}
                                               onChange={onChange}
                                               onKeyPress={this.onKeyPress}
                                               placeholder={placeholder}/>
										<label htmlFor={id}
                                               className="form__label">{placeholder}</label>
									</span>
            {
                hasError
                    ? (
                        <div className="form__field-error-message">
                            {errorText}
                        </div>
                    )
                    : ''
            }
        </div>;
    }
}

FormField.propTypes = {
    onEnter: PropTypes.func,
    onChange: PropTypes.func,
    hasError: PropTypes.array,
    disabled: PropTypes.bool,
    errorText: PropTypes.string,
    placeholder: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([
        PropTypes.string.isRequired,
        PropTypes.number.isRequired,
    ])
};

FormField.defaultProps = {
    onEnter: null,
    hasError: null,
    disabled: false,
    onChange: null,
    errorText: null,
};
