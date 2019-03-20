import React, {Component} from 'react';
import TabBar             from '../TabBar/TabBar';
import SocialLinkButton   from '../SocialLinkButton/SocialLinkButton';
import Button             from '../Button/Button';
import FormField          from '../FormField/FormField';
import CloseButton        from '../CloseButton/CloseButton';
import PropTypes          from 'prop-types';
import './SignUpForm.css';

export default class SignUpForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            phone: '',
            passwordFromSms: '',
            email: '',
            password: '',
            repeatPassword: ''
        }
    }

    onPhoneChange = (event) => {
        this.setState({phone: event.target.value})
    };

    onPasswordFromSmsChange = (event) => {
        this.setState({passwordFromSms: event.target.value})
    };

    onEmailChange = (event) => {
        this.setState({email: event.target.value})
    };

    onPasswordChange = (event) => {
        this.setState({password: event.target.value})
    };

    onRepeatPasswordChange = (event) => {
        this.setState({repeatPassword: event.target.value})
    };

    firstTabContent = () =>
        <form action="#" className="form">
            <FormField placeholder="Ваш телефон"
                       id="your-phone"
                       onChange={this.onPhoneChange}
                       type="number"
                       hasError={false}
                       errorText={''}
                       value={this.state.phone}/>
            <FormField placeholder="Пароль из смс"
                       id="password-from-sms"
                       onChange={this.onPasswordFromSmsChange}
                       type="text"
                       hasError={false}
                       errorText={''}
                       value={this.state.passwordFromSms}/>
            <Button size="medium" style="normal" title="Зарегистрироваться" fullLength={true} submit={true}
                    onClick={() => this.props.onFormSubmit('phone', this.state.phone, this.state.passwordFromSms)}/>
        </form>;

    secondTabContent = () =>
        <form action="#" className="form">
            <FormField placeholder="Ваш email"
                       id="your-email"
                       onChange={this.onEmailChange}
                       type="text"
                       hasError={false}
                       errorText={''}
                       value={this.state.email}/>
            <FormField placeholder="Придумайте пароль"
                       id="password"
                       onChange={this.onPasswordChange}
                       type="password"
                       hasError={false}
                       errorText={''}
                       value={this.state.password}/>
            <FormField placeholder="Повторите пароль"
                       id="repeat-password"
                       onChange={this.onRepeatPasswordChange}
                       type="password"
                       hasError={false}
                       errorText={''}
                       value={this.state.repeatPassword}/>
            <Button size="medium" style="normal" title="Зарегистрироваться" fullLength={true} submit={true}
                    onClick={() => this.props.onFormSubmit('email', this.state.email, this.state.password)}/>
        </form>;

    render() {
        return <div className="modal-overlay">
            <div className="modal-overlay__wrapper">
                <div className="modal-block">
                    <div className="modal-block__padding-wrapper">
                        <div className="modal-block__close">
                            <CloseButton onClick={this.props.closeForm}/>
                        </div>
                        <h3 className="modal-block__title">
                            Регистрация
                        </h3>
                        <TabBar contentList={[this.firstTabContent(), this.secondTabContent()]} activeList={[false, true]} activeTab={2} test={this.firstTabContent()}
                                titleList={["Телефон", "Email"]}/>
                        <div className="modal-block__or">
                            <div className="modal-block__or-inner">или</div>
                        </div>
                        <div className="modal-block__social">
                            <ul className="social-links">
                                <li><SocialLinkButton href="https://www.instagram.com"
                                                      xlinkHref="/public/social-links-sprite/social-links-sprite.svg#icon-vk"
                                                      dark={true}/>
                                </li>
                                <li><SocialLinkButton href="https://www.instagram.com"
                                                      xlinkHref="/public/social-links-sprite/social-links-sprite.svg#icon-facebook"
                                                      dark={true}/>
                                </li>
                                <li><SocialLinkButton href="https://ru-ru.facebook.com/"
                                                      xlinkHref="/public/social-links-sprite/social-links-sprite.svg#icon-twitter"
                                                      dark={true}/>
                                </li>
                                <li><SocialLinkButton href="https://www.instagram.com/"
                                                      xlinkHref="/public/social-links-sprite/social-links-sprite.svg#icon-inst"
                                                      dark={true}/>
                                </li>
                                <li><SocialLinkButton href="https://vk.com"
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

SignUpForm.propTypes = {
    onFormSubmit: PropTypes.func.isRequired,
    closeForm: PropTypes.func.isRequired
};
