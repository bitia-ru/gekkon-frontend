import React, {Component}        from 'react';
import TabBar                    from '../TabBar/TabBar';
import SocialLinkButton          from '../SocialLinkButton/SocialLinkButton';
import Button                    from '../Button/Button';
import FormField                 from '../FormField/FormField';
import CloseButton               from '../CloseButton/CloseButton';
import PropTypes                 from 'prop-types';
import * as R                    from 'ramda';
import {PASSWORD_MIN_LENGTH}     from '../Constants/User';
import {reEmail}                 from '../Constants/Constraints';
import './SignUpForm.css';

export default class SignUpForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            phone: '',
            passwordFromSms: '',
            email: '',
            password: '',
            repeatPassword: '',
            errors: {}
        };
        this.mouseOver = false;
    }

    resetErrors = () => {
        this.setState({errors: {}});
    };

    onPhoneChange = (event) => {
        this.resetErrors();
        this.props.resetErrors();
        this.setState({phone: event.target.value})
    };

    onPasswordFromSmsChange = (event) => {
        this.resetErrors();
        this.props.resetErrors();
        this.setState({passwordFromSms: event.target.value})
    };

    onEmailChange = (event) => {
        this.resetErrors();
        this.props.resetErrors();
        this.setState({email: event.target.value});
        this.check('email', event.target.value);
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
            case 'email':
                if (value === '' || !R.test(reEmail, value)) {
                    this.setState({errors: R.merge(this.state.errors, {email: ['Неверный формат email']})});
                    return false;
                }
                return true;
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
        let res = !this.check('email', this.state.email);
        res += !this.check('password', this.state.password);
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
                       onChange={this.onPhoneChange}
                       type="number"
                       hasError={this.hasError('phone')}
                       errorText={this.errorText('phone')}
                       value={this.state.phone}/>
            <FormField placeholder="Пароль из смс"
                       id="password-from-sms"
                       onChange={this.onPasswordFromSmsChange}
                       type="text"
                       hasError={this.hasError('passwordFromSms')}
                       errorText={this.errorText('passwordFromSms')}
                       value={this.state.passwordFromSms}/>
            <Button size="medium" style="normal" title="Зарегистрироваться" fullLength={true} submit={true}
                    isWaiting={this.props.isWaiting}
                    onClick={() => this.checkAndSubmit('phone', this.state.phone, this.state.passwordFromSms)}/>
        </form>;

    secondTabContent = () =>
        <form action="#" className="form">
            <FormField placeholder="Ваш email"
                       id="your-email"
                       onChange={this.onEmailChange}
                       type="text"
                       hasError={this.hasError('email')}
                       errorText={this.errorText('email')}
                       value={this.state.email}/>
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
                       onEnter={() => this.checkAndSubmit('email', this.state.email, this.state.password, this.state.repeatPassword)}
                       value={this.state.repeatPassword}/>
            <Button size="medium" style="normal" title="Зарегистрироваться" fullLength={true} submit={true}
                    isWaiting={this.props.isWaiting}
                    onClick={() => this.checkAndSubmit('email', this.state.email, this.state.password, this.state.repeatPassword)}/>
        </form>;

    render() {
        return <div className="modal-overlay" onClick={() => {if (!this.mouseOver) {this.closeForm()}}}>
            <div className="modal-overlay__wrapper">
                <div className="modal-block">
                    <div className="modal-block__padding-wrapper" onMouseOver={() => this.mouseOver = true} onMouseLeave={() => this.mouseOver = false}>
                        <div className="modal-block__close">
                            <CloseButton onClick={this.closeForm}/>
                        </div>
                        <h3 className="modal-block__title">
                            Регистрация
                        </h3>
                        <TabBar contentList={[this.firstTabContent(), this.secondTabContent()]}
                                activeList={[false, true]} activeTab={2} test={this.firstTabContent()}
                                titleList={["Телефон", "Email"]}/>
                        <div className="modal-block__or">
                            <div className="modal-block__or-inner">или</div>
                        </div>
                        <div className="modal-block__social">
                            <ul className="social-links">
                                <li><SocialLinkButton
                                    onClick={() => this.props.enterWithVk('signUp')}
                                    xlinkHref="/public/img/social-links-sprite/social-links-sprite.svg#icon-vk"
                                    dark={true}/>
                                </li>
                                <li><SocialLinkButton xlinkHref="/public/img/social-links-sprite/social-links-sprite.svg#icon-facebook"
                                                      dark={true} unactive={true}/>
                                </li>
                                <li><SocialLinkButton xlinkHref="/public/img/social-links-sprite/social-links-sprite.svg#icon-twitter"
                                                      dark={true} unactive={true}/>
                                </li>
                                <li><SocialLinkButton xlinkHref="/public/img/social-links-sprite/social-links-sprite.svg#icon-inst"
                                                      dark={true} unactive={true}/>
                                </li>
                                <li><SocialLinkButton xlinkHref="/public/img/social-links-sprite/social-links-sprite.svg#icon-youtube"
                                                      dark={true} unactive={true}/>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>;
    }
}

SignUpForm.propTypes = {
    onFormSubmit: PropTypes.func.isRequired,
    enterWithVk: PropTypes.func.isRequired,
    closeForm: PropTypes.func.isRequired,
    formErrors: PropTypes.object.isRequired,
    resetErrors: PropTypes.func.isRequired
};
