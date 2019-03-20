import React, {Component} from 'react';
import TabBar             from '../TabBar/TabBar';
import SocialLinkButton   from '../SocialLinkButton/SocialLinkButton';
import Button             from '../Button/Button';
import FormField          from '../FormField/FormField';
import CloseButton        from '../CloseButton/CloseButton';
import CheckBox           from '../CheckBox/CheckBox';
import PropTypes          from 'prop-types';
import './LogInForm.css';

export default class LogInForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            phone: '',
            passwordEnter: '',
            email: '',
            password: ''
        }
    }

    onPhoneChange = (event) => {
        this.setState({phone: event.target.value})
    };

    onPasswordEnterChange = (event) => {
        this.setState({passwordEnter: event.target.value})
    };

    onEmailChange = (event) => {
        this.setState({email: event.target.value})
    };

    onPasswordChange = (event) => {
        this.setState({password: event.target.value})
    };

    firstTabContent = () =>
        <form action="#" className="form">
            <FormField placeholder="Телефон"
                       id="phone"
                       onChange={this.onPhoneChange}
                       type="number"
                       hasError={false}
                       errorText={''}
                       value={this.state.phone}/>
            <FormField placeholder="Пароль"
                       id="password-enter"
                       onChange={this.onPasswordEnterChange}
                       type="text"
                       hasError={false}
                       errorText={''}
                       value={this.state.passwordEnter}/>
            <Button size="medium" style="normal" title="Войти" fullLength={true} submit={true}
                    onClick={() => this.props.onFormSubmit('phone', this.state.phone, this.state.passwordEnter)}/>
            <div className="modal-block__settings">
                <CheckBox id="rememberMeTab1"/>
                <a className="modal-block__link">Забыли пароль?</a>
            </div>
        </form>;

    secondTabContent = () =>
        <form action="#" className="form">
            <FormField placeholder="Email / логин"
                       id="email"
                       onChange={this.onEmailChange}
                       type="text"
                       hasError={false}
                       errorText={''}
                       value={this.state.email}/>
            <FormField placeholder="Пароль"
                       id="password"
                       onChange={this.onPasswordChange}
                       type="password"
                       hasError={false}
                       errorText={''}
                       value={this.state.password}/>
            <Button size="medium" style="normal" title="Войти" fullLength={true} submit={true}
                    onClick={() => this.props.onFormSubmit('email', this.state.email, this.state.password)}/>
            <div className="modal-block__settings">
                <CheckBox id="rememberMeTab2"/>
                <a className="modal-block__link">Забыли пароль?</a>
            </div>
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
                            Войти
                        </h3>
                        <TabBar contentList={[this.firstTabContent(), this.secondTabContent()]} activeList={[false, true]} activeTab={2} test={this.firstTabContent()}
                                titleList={["Телефон", "Email / логин"]}/>
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

LogInForm.propTypes = {
    onFormSubmit: PropTypes.func.isRequired,
    closeForm: PropTypes.func.isRequired
};
