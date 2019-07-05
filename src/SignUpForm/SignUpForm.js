import React, {Component}    from 'react';
import TabBar                from '../TabBar/TabBar';
import SocialLinkButton      from '../SocialLinkButton/SocialLinkButton';
import Button                from '../Button/Button';
import FormField             from '../FormField/FormField';
import CloseButton           from '../CloseButton/CloseButton';
import PropTypes             from 'prop-types';
import * as R                from 'ramda';
import {PASSWORD_MIN_LENGTH} from '../Constants/User';
import {reEmail}             from '../Constants/Constraints';
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

    onPasswordFromSmsChange = (event) => {
        const {resetErrors} = this.props;
        this.resetErrors();
        resetErrors();
        this.setState({passwordFromSms: event.target.value})
    };

    onEmailChange = (event) => {
        const {resetErrors} = this.props;
        this.resetErrors();
        resetErrors();
        this.setState({email: event.target.value});
        this.check('email', event.target.value);
    };

    onPasswordChange = (event) => {
        const {resetErrors} = this.props;
        this.resetErrors();
        resetErrors();
        this.setState({password: event.target.value});
        this.check('password', event.target.value);
    };

    onRepeatPasswordChange = (event) => {
        const {resetErrors} = this.props;
        this.resetErrors();
        resetErrors();
        this.setState({repeatPassword: event.target.value});
        this.check('repeatPassword', event.target.value);
    };

    check = (field, value) => {
        const {errors, password} = this.state;
        switch (field) {
            case 'email':
                if (value === '' || !R.test(reEmail, value)) {
                    this.setState({errors: R.merge(errors, {email: ['Неверный формат email']})});
                    return false;
                }
                return true;
            case 'password':
                if (value === '' || value.length < PASSWORD_MIN_LENGTH) {
                    const msgErr = `Минимальная длина пароля ${PASSWORD_MIN_LENGTH} символов`;
                    this.setState({errors: R.merge(errors, {password: [msgErr]})});
                    return false;
                }
                return true;
            case 'repeatPassword':
                if (password !== value) {
                    this.setState(
                        {errors: R.merge(errors, {repeatPassword: ['Пароли не совпадают']})}
                    );
                    return false;
                }
                return true;
        }
    };

    checkAndSubmit = (type, data, passwordNew) => {
        const {onFormSubmit} = this.props;
        const {email, password, repeatPassword} = this.state;
        let res = !this.check('email', email);
        res += !this.check('password', password);
        res += !this.check('repeatPassword', repeatPassword);
        if (res > 0) {
            return
        }
        onFormSubmit(type, data, passwordNew);
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
                formErrors[field] ? formErrors[field] : []
            )
        );
    };

    closeForm = () => {
        const {resetErrors, closeForm} = this.props;
        this.resetErrors();
        resetErrors();
        closeForm()
    };

    firstTabContent = () => {
        const {isWaiting} = this.props;
        const {phone, passwordFromSms} = this.state;
        return (
            <form action="#" className="form">
                <FormField placeholder="Ваш телефон"
                           id="your-phone"
                           onChange={this.onPhoneChange}
                           type="number"
                           hasError={this.hasError('phone')}
                           errorText={this.errorText('phone')}
                           value={phone}/>
                <FormField placeholder="Пароль из смс"
                           id="password-from-sms"
                           onChange={this.onPasswordFromSmsChange}
                           type="text"
                           hasError={this.hasError('passwordFromSms')}
                           errorText={this.errorText('passwordFromSms')}
                           value={passwordFromSms}/>
                <Button size="medium"
                        style="normal"
                        title="Зарегистрироваться"
                        fullLength={true}
                        submit={true}
                        isWaiting={isWaiting}
                        onClick={() => this.checkAndSubmit('phone', phone, passwordFromSms)}/>
            </form>
        );
    };

    secondTabContent = () => {
        const {isWaiting} = this.props;
        const {email, password, repeatPassword} = this.state;
        return (
            <form action="#" className="form">
                <FormField placeholder="Ваш email"
                           id="your-email"
                           onChange={this.onEmailChange}
                           type="text"
                           hasError={this.hasError('email')}
                           errorText={this.errorText('email')}
                           value={email}/>
                <FormField placeholder="Придумайте пароль"
                           id="password"
                           onChange={this.onPasswordChange}
                           type="password"
                           hasError={this.hasError('password')}
                           errorText={this.errorText('password')}
                           value={password}/>
                <FormField placeholder="Повторите пароль"
                           id="repeat-password"
                           onChange={this.onRepeatPasswordChange}
                           type="password"
                           hasError={this.hasError('repeatPassword')}
                           errorText={this.errorText('repeatPassword')}
                           onEnter={
                               () => this.checkAndSubmit('email', email, password, repeatPassword)
                           }
                           value={repeatPassword}/>
                <Button size="medium"
                        style="normal"
                        title="Зарегистрироваться напрямую"
                        fullLength={true}
                        submit={true}
                        isWaiting={isWaiting}
                        onClick={
                            () => this.checkAndSubmit('email', email, password, repeatPassword)
                        }/>
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
        return <div className="modal-overlay" onClick={() => {
            if (!this.mouseOver) {
                this.closeForm()
            }
        }}>
            <div className="modal-overlay__wrapper">
                <div className="modal-block">
                    <div className="modal-block__padding-wrapper"
                         onMouseOver={() => this.mouseOver = true}
                         onMouseLeave={() => this.mouseOver = false}
                    >
                        <div className="modal-block__close">
                            <CloseButton onClick={this.closeForm}/>
                        </div>
                        <h3 className="modal-block__title">
                            Регистрация
                        </h3>
                        <TabBar contentList={[this.firstTabContent(), this.secondTabContent()]}
                                activeList={[false, true]}
                                activeTab={2}
                                test={this.firstTabContent()}
                                titleList={["Телефон", "Email"]}/>
                        <div className="modal-block__or">
                            <div className="modal-block__or-inner">или через</div>
                        </div>
                        <div className="modal-block__social">
                            <ul className="social-links">
                                <li><SocialLinkButton
                                    onClick={() => enterWithVk('signUp')}
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

SignUpForm.propTypes = {
    isWaiting: PropTypes.bool,
    onFormSubmit: PropTypes.func.isRequired,
    enterWithVk: PropTypes.func.isRequired,
    closeForm: PropTypes.func.isRequired,
    formErrors: PropTypes.object.isRequired,
    resetErrors: PropTypes.func.isRequired
};

SignUpForm.defaultProps = {
    isWaiting: null,
};
