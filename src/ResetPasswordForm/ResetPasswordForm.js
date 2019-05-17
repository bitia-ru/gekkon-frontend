import React, {Component}    from 'react';
import TabBar                from '../TabBar/TabBar';
import Button                from '../Button/Button';
import FormField             from '../FormField/FormField';
import CloseButton           from '../CloseButton/CloseButton';
import PropTypes             from 'prop-types';
import * as R                from 'ramda';
import {PASSWORD_MIN_LENGTH} from '../Constants/User'
import './ResetPasswordForm.css';

export default class ResetPasswordForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            passwordFromSms: '',
            password: '',
            repeatPassword: '',
            errors: {}
        }
    }

    resetErrors = () => {
        this.setState({errors: {}});
    };

    onPasswordFromSmsChange = (event) => {
        this.resetErrors();
        this.props.resetErrors();
        this.setState({passwordFromSms: event.target.value})
    };

    onPasswordChange = (event) => {
        this.resetErrors();
        this.props.resetErrors();
        this.setState({password: event.target.value});
        this.check('password', event.target.value);
    };

    onRepeatPasswordChange = (event) => {
        this.resetErrors();
        this.props.resetErrors();
        this.setState({repeatPassword: event.target.value});
        this.check('repeatPassword', event.target.value);
    };

    check = (field, value) => {
        switch (field) {
            case 'password':
                if (value === '' || value.length < PASSWORD_MIN_LENGTH) {
                    this.setState({errors: R.merge(this.state.errors, {password: [`Минимальная длина пароля ${PASSWORD_MIN_LENGTH} символов`]})});
                    return false;
                }
                return true;
            case 'repeatPassword':
                if (this.state.password !== value) {
                    this.setState({errors: R.merge(this.state.errors, {repeatPassword: ['Пароли не совпадают']})});
                    return false;
                }
                return true;
        }
    };

    checkAndSubmit = (type, data, password, repeatPassword = null) => {
        let res = !this.check('password', this.state.password);
        res += !this.check('repeatPassword', this.state.repeatPassword);
        if (res > 0) {
            return
        }
        this.props.onFormSubmit(type, data, password);
    };

    hasError = (field) => {
        return (this.state.errors[field] || this.props.formErrors[field]);
    };

    errorText = (field) => {
        return R.join(', ', R.concat(this.state.errors[field] ? this.state.errors[field] : [], this.props.formErrors[field] ? this.props.formErrors[field] : []));
    };

    closeForm = () => {
        this.resetErrors();
        this.props.resetErrors();
        this.props.closeForm()
    };

    firstTabContent = () =>
        <form action="#" className="form">
            <FormField placeholder="Ваш телефон"
                       id="your-phone"
                       onChange={() => {
                       }}
                       type="number"
                       hasError={false}
                       errorText={''}
                       disabled={true}
                       value={this.props.phone}/>
            <FormField placeholder="Пароль из смс"
                       id="password-from-sms"
                       onChange={this.onPasswordFromSmsChange}
                       type="text"
                       hasError={this.hasError('passwordFromSms')}
                       errorText={this.errorText('passwordFromSms')}
                       value={this.state.passwordFromSms}/>
            <Button size="medium" style="normal" title="Восстановить" fullLength={true} submit={true}
                    isWaiting={this.props.isWaiting}
                    onClick={() => this.checkAndSubmit('phone', this.props.phone, this.state.passwordFromSms)}/>
        </form>;

    secondTabContent = () =>
        <form action="#" className="form">
            <FormField placeholder="Email / логин"
                       id="your-email"
                       onChange={() => {
                       }}
                       type="text"
                       hasError={false}
                       errorText={''}
                       disabled={true}
                       value={this.props.email}/>
            <FormField placeholder="Придумайте пароль"
                       id="password"
                       onChange={this.onPasswordChange}
                       type="password"
                       hasError={this.hasError('password')}
                       errorText={this.errorText('password')}
                       value={this.state.password}/>
            <FormField placeholder="Повторите пароль"
                       id="repeat-password"
                       onChange={this.onRepeatPasswordChange}
                       type="password"
                       hasError={this.hasError('repeatPassword')}
                       errorText={this.errorText('repeatPassword')}
                       onEnter={() => this.checkAndSubmit('email', this.props.email, this.state.password, this.state.repeatPassword)}
                       value={this.state.repeatPassword}/>
            <Button size="medium" style="normal" title="Сохранить" fullLength={true} submit={true}
                    isWaiting={this.props.isWaiting}
                    onClick={() => this.checkAndSubmit('email', this.props.email, this.state.password, this.state.repeatPassword)}/>
        </form>;

    render() {
        return <div className="modal-overlay">
            <div className="modal-overlay__wrapper">
                <div className="modal-block">
                    <div className="modal-block__padding-wrapper">
                        <div className="modal-block__close">
                            <CloseButton onClick={this.closeForm}/>
                        </div>
                        <h3 className="modal-block__title">
                            Установка нового пароля
                        </h3>
                        <TabBar contentList={[this.firstTabContent(), this.secondTabContent()]}
                                activeList={[false, true]} activeTab={2} test={this.firstTabContent()}
                                titleList={["Телефон", "Email"]}/>
                    </div>
                </div>
            </div>
        </div>;
    }
}

ResetPasswordForm.propTypes = {
    onFormSubmit: PropTypes.func.isRequired,
    closeForm: PropTypes.func.isRequired,
    formErrors: PropTypes.object.isRequired,
    resetErrors: PropTypes.func.isRequired
};
