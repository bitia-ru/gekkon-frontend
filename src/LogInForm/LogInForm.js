import React, {Component} from 'react';
import TabBar             from '../TabBar/TabBar';
import SocialLinkButton   from '../SocialLinkButton/SocialLinkButton';
import Button             from '../Button/Button';
import FormField          from '../FormField/FormField';
import CloseButton        from '../CloseButton/CloseButton';
import CheckBox           from '../CheckBox/CheckBox';
import PropTypes          from 'prop-types';
import * as R             from 'ramda';
import './LogInForm.css';

export default class LogInForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            phone: '',
            passwordEnter: '',
            email: '',
            password: '',
            errors: {},
            rememberMe: true
        };
        this.mouseOver = false;
    }

    componentDidMount() {
        window.addEventListener("keydown", this.onKeyDown);
    }

    componentWillUnmount() {
        window.removeEventListener("keydown", this.onKeyDown);
    }

    onKeyDown = (event) => {
        if (event.key === 'Escape') {
            this.closeForm();
        }
    };

    resetErrors = () => {
        this.setState({errors: {}});
    };

    onPhoneChange = (event) => {
        const {resetErrors} = this.props;
        this.resetErrors();
        resetErrors();
        this.setState({phone: event.target.value})
    };

    onPasswordEnterChange = (event) => {
        const {resetErrors} = this.props;
        this.resetErrors();
        resetErrors();
        this.setState({passwordEnter: event.target.value})
    };

    onEmailChange = (event) => {
        const {resetErrors} = this.props;
        this.resetErrors();
        resetErrors();
        this.setState({email: event.target.value});
    };

    onPasswordChange = (event) => {
        const {resetErrors} = this.props;
        this.resetErrors();
        resetErrors();
        this.setState({password: event.target.value});
        this.check('password', event.target.value);
    };

    onRememberMeChange = () => {
        const {rememberMe} = this.state;
        this.setState({rememberMe: !rememberMe});
    };

    check = (field, value) => {
        const {errors} = this.state;
        switch (field) {
            case 'password':
                if (value.length === 0) {
                    this.setState(
                        {
                            errors: R.merge(
                                errors,
                                {password_digest: ['Пароль не может быть пустым']},
                            )
                        }
                    );
                    return false;
                }
                return true;
            default:
                return true;
        }
    };

    checkAndSubmit = (type, data, passwordNew) => {
        const {onFormSubmit} = this.props;
        const {password, rememberMe} = this.state;
        const res = !this.check('password', password);
        if (res > 0) {
            return;
        }
        onFormSubmit(type, data, passwordNew, rememberMe);
    };

    hasError = (field) => {
        const {formErrors} = this.props;
        const {errors} = this.state;
        return (errors[field] || formErrors[field]);
    };

    errorText = (field) => {
        const {formErrors} = this.props;
        const {errors} = this.state;
        return R.join(
            ', ',
            R.concat(
                errors[field] ? errors[field] : [],
                formErrors[field] ? formErrors[field] : [],
            )
        );
    };

    closeForm = () => {
        const {resetErrors, closeForm} = this.props;
        this.resetErrors();
        resetErrors();
        closeForm()
    };

    resetPassword = (type) => {
        const {resetPassword} = this.props;
        const {phone, email} = this.state;
        if (type === 'phone') {
            if (phone === '') {
                this.setState({errors: {phone: ['Введите телефон']}});
            } else {
                resetPassword('phone', phone)
            }
        }
        if (type === 'email') {
            if (email === '') {
                this.setState({errors: {email: ['Введите почту / логин']}});
            } else {
                resetPassword('email', email)
            }
        }
    };

    firstTabContent = () => {
        const {isWaiting} = this.props;
        const {phone, passwordEnter, rememberMe} = this.state;
        return (
            <form action="#" className="form">
                <FormField placeholder="Телефон"
                           id="phone"
                           onChange={this.onPhoneChange}
                           type="number"
                           hasError={this.hasError('phone')}
                           errorText={this.errorText('phone')}
                           value={phone}/>
                <FormField placeholder="Пароль"
                           id="password-enter"
                           onChange={this.onPasswordEnterChange}
                           type="text"
                           hasError={this.hasError('passwordEnter')}
                           errorText={this.errorText('passwordEnter')}
                           value={passwordEnter}/>
                <Button
                    size="medium"
                    style="normal"
                    title="Войти"
                    fullLength={true}
                    submit={true}
                    isWaiting={isWaiting}
                    onClick={() => this.checkAndSubmit('phone', phone, passwordEnter)}
                />
                <div className="modal-block__settings">
                    <CheckBox
                        id="rememberMeTab1"
                        onChange={this.onRememberMeChange}
                        checked={rememberMe}
                        title="Запомнить меня"
                    />
                    <a role="link"
                       tabIndex={0}
                       style={{outline: 'none'}}
                       className="modal-block__link"
                       onClick={() => this.resetPassword('phone')}
                    >
                        Забыли пароль?
                    </a>
                </div>
            </form>
        );
    };

    secondTabContent = () => {
        const {isWaiting} = this.props;
        const {email, password, rememberMe} = this.state;
        return (
            <form action="#" className="form">
                <FormField placeholder="Email / логин"
                           id="email"
                           onChange={this.onEmailChange}
                           type="text"
                           hasError={this.hasError('email')}
                           errorText={this.errorText('email')}
                           value={email}/>
                <FormField placeholder="Пароль"
                           id="password"
                           onChange={this.onPasswordChange}
                           type="password"
                           hasError={this.hasError('password_digest')}
                           errorText={this.errorText('password_digest')}
                           onEnter={() => this.checkAndSubmit('email', email, password)}
                           value={password}/>
                <Button
                    size="medium"
                    style="normal"
                    title="Войти"
                    fullLength={true}
                    submit={true}
                    isWaiting={isWaiting}
                    onClick={() => this.checkAndSubmit('email', email, password)}
                />
                <div className="modal-block__settings">
                    <CheckBox
                        id="rememberMeTab2"
                        onChange={this.onRememberMeChange}
                        checked={rememberMe}
                        title="Запомнить меня"
                    />
                    <a role="link"
                       tabIndex={0}
                       style={{outline: 'none'}}
                       className="modal-block__link"
                       onClick={() => this.resetPassword('email')}
                    >
                        Забыли пароль?
                    </a>
                </div>
            </form>
        );
    };

    render() {
        const {enterWithVk} = this.props;
        const iconVk = "/public/img/social-links-sprite/social-links-sprite.svg#icon-vk";
        const iconFB = "/public/img/social-links-sprite/social-links-sprite.svg#icon-facebook";
        const iconTwitter = "/public/img/social-links-sprite/social-links-sprite.svg#icon-twitter";
        const iconInst = "/public/img/social-links-sprite/social-links-sprite.svg#icon-inst";
        const iconYoutube = "/public/img/social-links-sprite/social-links-sprite.svg#icon-youtube";
        return <div role="button"
                    tabIndex={0}
                    style={{outline: 'none'}}
                    className="modal-overlay"
                    onClick={() => {
                        if (!this.mouseOver) {
                            this.closeForm()
                        }
                    }}
        >
            <div className="modal-overlay__wrapper">
                <div className="modal-block">
                    <div className="modal-block__padding-wrapper"
                         onMouseOver={() => {
                             this.mouseOver = true;
                         }}
                         onMouseLeave={() => {
                             this.mouseOver = false;
                         }}
                    >
                        <div className="modal-block__close">
                            <CloseButton onClick={this.closeForm}/>
                        </div>
                        <h3 className="modal-block__title">
                            Вход в систему
                        </h3>
                        <TabBar contentList={[this.firstTabContent(), this.secondTabContent()]}
                                activeList={[false, true]}
                                activeTab={2}
                                titleList={["Телефон", "Email / логин"]}/>
                        <div className="modal-block__or">
                            <div className="modal-block__or-inner">или через</div>
                        </div>
                        <div className="modal-block__social">
                            <ul className="social-links">
                                <li><SocialLinkButton
                                    onClick={() => enterWithVk('logIn')}
                                    xlinkHref={iconVk}
                                    dark={true}/>
                                </li>
                                <li><SocialLinkButton
                                    xlinkHref={iconFB}
                                    dark={true} unactive={true}/>
                                </li>
                                <li><SocialLinkButton
                                    xlinkHref={iconTwitter}
                                    dark={true} unactive={true}/>
                                </li>
                                <li><SocialLinkButton
                                    xlinkHref={iconInst}
                                    dark={true} unactive={true}/>
                                </li>
                                <li><SocialLinkButton
                                    xlinkHref={iconYoutube}
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

LogInForm.propTypes = {
    isWaiting: PropTypes.bool,
    onFormSubmit: PropTypes.func.isRequired,
    enterWithVk: PropTypes.func.isRequired,
    closeForm: PropTypes.func.isRequired,
    resetPassword: PropTypes.func.isRequired,
    formErrors: PropTypes.object.isRequired,
    resetErrors: PropTypes.func.isRequired,
};

LogInForm.defaultProps = {
    isWaiting: null,
};
