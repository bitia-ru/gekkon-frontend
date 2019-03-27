import React, {Component}    from 'react';
import TabBar                from '../TabBar/TabBar';
import SocialLinkButton      from '../SocialLinkButton/SocialLinkButton';
import Button                from '../Button/Button';
import FormField             from '../FormField/FormField';
import CloseButton           from '../CloseButton/CloseButton';
import CheckBox              from '../CheckBox/CheckBox';
import PropTypes             from 'prop-types';
import './LogInForm.css';
import * as R                from "ramda";
import {PASSWORD_MIN_LENGTH} from "../Constants/User";

export default class LogInForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            phone: '',
            passwordEnter: '',
            email: '',
            password: '',
            errors: {},
            rememberMe: false
        }
    }

    resetErrors = () => {
        this.setState({errors: {}});
    };

    onPhoneChange = (event) => {
        this.resetErrors();
        this.props.resetErrors();
        this.setState({phone: event.target.value})
    };

    onPasswordEnterChange = (event) => {
        this.resetErrors();
        this.props.resetErrors();
        this.setState({passwordEnter: event.target.value})
    };

    onEmailChange = (event) => {
        this.resetErrors();
        this.props.resetErrors();
        this.setState({email: event.target.value});
    };

    onPasswordChange = (event) => {
        this.resetErrors();
        this.props.resetErrors();
        this.setState({password: event.target.value});
        this.check('password', event.target.value);
    };

    onRememberMeChange = () => {
        this.setState({rememberMe: !this.state.rememberMe});
    };

    check = (field, value) => {
        switch (field) {
            case 'password':
                if (value.length === 0) {
                    this.setState({errors: R.merge(this.state.errors, {password_digest: ['Пароль не может быть пустым']})});
                    return false;
                }
                return true;
        }
    };

    checkAndSubmit = (type, data, password) => {
        let res = !this.check('password', this.state.password);
        if (res > 0) {return}
        this.props.onFormSubmit(type, data, password, this.state.rememberMe);
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

    resetPassword = (type) => {
        if (type === 'phone') {
            if (this.state.phone === '') {
                this.setState({errors: {phone: ['Введите телефон']}});
            } else {
                this.props.resetPassword('phone', this.state.phone)
            }
        }
        if (type === 'email') {
            if (this.state.email === '') {
                this.setState({errors: {email: ['Введите почту / логин']}});
            } else {
                this.props.resetPassword('email', this.state.email)
            }
        }
    };

    firstTabContent = () =>
        <form action="#" className="form">
            <FormField placeholder="Телефон"
                       id="phone"
                       onChange={this.onPhoneChange}
                       type="number"
                       hasError={this.hasError('phone')}
                       errorText={this.errorText('phone')}
                       value={this.state.phone}/>
            <FormField placeholder="Пароль"
                       id="password-enter"
                       onChange={this.onPasswordEnterChange}
                       type="text"
                       hasError={this.hasError('passwordEnter')}
                       errorText={this.errorText('passwordEnter')}
                       value={this.state.passwordEnter}/>
            <Button size="medium" style="normal" title="Войти" fullLength={true} submit={true}
                    onClick={() => this.checkAndSubmit('phone', this.state.phone, this.state.passwordEnter)}/>
            <div className="modal-block__settings">
                <CheckBox id="rememberMeTab1" onChange={this.onRememberMeChange} checked={this.state.rememberMe}/>
                <a className="modal-block__link" onClick={() => this.resetPassword('phone')}>Забыли пароль?</a>
            </div>
        </form>;

    secondTabContent = () =>
        <form action="#" className="form">
            <FormField placeholder="Email / логин"
                       id="email"
                       onChange={this.onEmailChange}
                       type="text"
                       hasError={this.hasError('email')}
                       errorText={this.errorText('email')}
                       value={this.state.email}/>
            <FormField placeholder="Пароль"
                       id="password"
                       onChange={this.onPasswordChange}
                       type="password"
                       hasError={this.hasError('password_digest')}
                       errorText={this.errorText('password_digest')}
                       onEnter={() => this.checkAndSubmit('email', this.state.email, this.state.password)}
                       value={this.state.password}/>
            <Button size="medium" style="normal" title="Войти" fullLength={true} submit={true}
                    onClick={() => this.checkAndSubmit('email', this.state.email, this.state.password)}/>
            <div className="modal-block__settings">
                <CheckBox id="rememberMeTab2" onChange={this.onRememberMeChange} checked={this.state.rememberMe}/>
                <a className="modal-block__link" onClick={() => this.resetPassword('email')}>Забыли пароль?</a>
            </div>
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
                            Войти
                        </h3>
                        <TabBar contentList={[this.firstTabContent(), this.secondTabContent()]} activeList={[false, true]} activeTab={2} test={this.firstTabContent()}
                                titleList={["Телефон", "Email / логин"]}/>
                        <div className="modal-block__or">
                            <div className="modal-block__or-inner">или</div>
                        </div>
                        <div className="modal-block__social">
                            <ul className="social-links">
                                <li><SocialLinkButton href={true ? false : "https://www.instagram.com"}
                                                      xlinkHref="/public/social-links-sprite/social-links-sprite.svg#icon-vk"
                                                      dark={true}/>
                                </li>
                                <li><SocialLinkButton href={true ? false : "https://www.instagram.com"}
                                                      xlinkHref="/public/social-links-sprite/social-links-sprite.svg#icon-facebook"
                                                      dark={true}/>
                                </li>
                                <li><SocialLinkButton href={true ? false : "https://ru-ru.facebook.com/"}
                                                      xlinkHref="/public/social-links-sprite/social-links-sprite.svg#icon-twitter"
                                                      dark={true}/>
                                </li>
                                <li><SocialLinkButton href={true ? false : "https://www.instagram.com/"}
                                                      xlinkHref="/public/social-links-sprite/social-links-sprite.svg#icon-inst"
                                                      dark={true}/>
                                </li>
                                <li><SocialLinkButton href={true ? false : "https://vk.com"}
                                                      xlinkHref="/public/social-links-sprite/social-links-sprite.svg#icon-youtube"
                                                      dark={true}/>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>;
    }
}

LogInForm.propTypes = {
    onFormSubmit: PropTypes.func.isRequired,
    closeForm: PropTypes.func.isRequired,
    resetPassword: PropTypes.func.isRequired,
    formErrors: PropTypes.object.isRequired,
    resetErrors: PropTypes.func.isRequired
};
