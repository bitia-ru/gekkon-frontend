import React, {Component}    from 'react';
import SocialLinkButton      from '../SocialLinkButton/SocialLinkButton';
import Button                from '../Button/Button';
import FormField             from '../FormField/FormField';
import CloseButton           from '../CloseButton/CloseButton';
import PropTypes             from 'prop-types';
import {SALT_ROUNDS}         from '../Constants/Bcrypt';
import bcrypt                from 'bcryptjs';
import {PASSWORD_MIN_LENGTH} from '../Constants/User';
import * as R                from 'ramda';
import './Profile.css';

export default class Profile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: this.props.user.name ? this.props.user.name : '',
            login: this.props.user.login ? this.props.user.login : '',
            phone: this.props.user.phone ? this.props.user.phone : '',
            password: '',
            email: this.props.user.email ? this.props.user.email : '',
            repeatPassword: '',
            avatar: this.props.user.avatar ? this.props.user.avatar.url : null,
            avatarFile: null,
            errors: {}
        }
    }

    resetErrors = () => {
        this.setState({errors: {}});
    };

    onPhoneChange = (event) => {
        this.resetErrors();
        this.props.resetErrors();
        this.setState({phone: event.target.value});
        this.check('phone', event.target.value);
    };

    onNameChange = (event) => {
        this.resetErrors();
        this.props.resetErrors();
        this.setState({name: event.target.value});
    };

    onEmailChange = (event) => {
        this.resetErrors();
        this.props.resetErrors();
        this.setState({email: event.target.value});
        this.check('email', event.target.value);
    };

    onLoginChange = (event) => {
        this.resetErrors();
        this.props.resetErrors();
        this.setState({login: event.target.value});
        this.check('login', event.target.value);
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

    onFileRead = (event) => {
        this.setState({avatar: this.fileReader.result});
    };

    onFileChosen = (file) => {
        this.fileReader = new FileReader();
        this.fileReader.onloadend = this.onFileRead;
        this.fileReader.readAsDataURL(file);
        this.setState({avatarFile: file});
    };

    removeAvatar = () => {
        this.setState({avatar: null});
    };

    check = (field, value) => {
        switch (field) {
            case 'email':
                let re_email = /^([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})$/;
                if (value !== '' && !R.test(re_email, value)) {
                    this.setState({errors: R.merge(this.state.errors, {email: ['Неверный формат email']})});
                    return false;
                }
                if (value === '' && this.state.login === '' && this.state.phone === '') {
                    this.setState({errors: R.merge(this.state.errors, {email: ['Должно быть заполнено хотя бы одно из полей email, логин или телефон']})});
                    return false;
                }
                return true;
            case 'login':
                let re_login = /^[\.a-zA-Z0-9_-]+$/;
                if (value !== '' && !R.test(re_login, value)) {
                    this.setState({errors: R.merge(this.state.errors, {login: ['Неверный формат login']})});
                    return false;
                }
                if (value === '' && this.state.email === '' && this.state.phone === '') {
                    this.setState({errors: R.merge(this.state.errors, {login: ['Должно быть заполнено хотя бы одно из полей email, логин или телефон']})});
                    return false;
                }
                return true;
            case 'phone':
                if (value !== '' && value.length < 11) {
                    this.setState({errors: R.merge(this.state.errors, {phone: ['Неверный формат номера']})});
                    return false;
                }
                if (value === '' && this.state.email === '' && this.state.login === '') {
                    this.setState({errors: R.merge(this.state.errors, {phone: ['Должно быть заполнено хотя бы одно из полей email, логин или телефон']})});
                    return false;
                }
                return true;
            case 'password':
                if (value !== '' && value.length < PASSWORD_MIN_LENGTH) {
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

    checkAndSubmit = () => {
        let res = !this.check('email', this.state.email);
        res += !this.check('login', this.state.login);
        res += !this.check('phone', this.state.phone);
        res += !this.check('password', this.state.password);
        res += !this.check('repeatPassword', this.state.repeatPassword);
        if (res > 0) {return}
        let formData = new FormData();
        if (this.state.avatar !== (this.props.user.avatar ? this.props.user.avatar.url : null)) {
            formData.append('user[avatar]', this.state.avatarFile);
        }
        if (this.state.name !== (this.props.user.name ? this.props.user.name : '')) {
            formData.append('user[name]', this.state.name);
        }
        if (this.state.login !== (this.props.user.login ? this.props.user.login : '')) {
            formData.append('user[login]', this.state.login);
        }
        if (this.state.password !== '') {
            let salt = bcrypt.genSaltSync(SALT_ROUNDS);
            formData.append('user[password_digest]', bcrypt.hashSync(this.state.password, salt));
        }
        if (this.state.email !== (this.props.user.email ? this.props.user.email : '')) {
            formData.append('user[email]', this.state.email);
        }
        if (this.state.phone !== (this.props.user.phone ? this.props.user.phone : '')) {
            formData.append('user[phone]', this.state.phone);
        }
        this.props.onFormSubmit(formData);
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

    render() {
        return <div className="modal-overlay">
            <div className="modal-overlay__wrapper">
                <div className="modal-block modal-block__profile">
                    <div className="modal__close">
                        <CloseButton onClick={this.closeForm}/>
                    </div>
                    <form action="#" method="post" method="post" encType="multipart/form-data" className="form">
                        <div className="modal-block__avatar-block">
                            <div className="modal-block__avatar">
                                {(this.state.avatar !== null) ?
                                    <img src={this.state.avatar} alt={this.props.user.login}/> :
                                    <img src="/public/user-icon/no-avatar.jpg" alt={this.props.user.login}/>}
                                <input type="file" name="avatar" title="Изменить аватарку"
                                       onChange={(event) => this.onFileChosen(event.target.files[0])}/>
                                {this.state.avatar !== null ?
                                    <button className="modal-block__avatar-delete" type="button"
                                            title="Удалить" onClick={this.removeAvatar}></button> : ''
                                }
                            </div>
                        </div>
                        <div className="modal-block__padding-wrapper">
                            <FormField placeholder="Имя"
                                       id="name"
                                       onChange={this.onNameChange}
                                       type="text"
                                       hasError={this.hasError('name')}
                                       errorText={this.errorText('name')}
                                       value={this.state.name}/>
                            <FormField placeholder="Логин"
                                       id="login"
                                       onChange={this.onLoginChange}
                                       type="text"
                                       hasError={this.hasError('login')}
                                       errorText={this.errorText('login')}
                                       value={this.state.login}/>
                            <FormField placeholder="Пароль"
                                       id="password"
                                       onChange={this.onPasswordChange}
                                       type="password"
                                       hasError={this.hasError('password')}
                                       errorText={this.errorText('password')}
                                       value={this.state.password}/>
                            <FormField placeholder="Подтверждение пароля"
                                       id="repeat-password"
                                       onChange={this.onRepeatPasswordChange}
                                       type="password"
                                       hasError={this.hasError('repeatPassword')}
                                       errorText={this.errorText('repeatPassword')}
                                       value={this.state.repeatPassword}/>
                            <FormField placeholder="Email"
                                       id="email"
                                       onChange={this.onEmailChange}
                                       type="text"
                                       hasError={this.hasError('email')}
                                       errorText={this.errorText('email')}
                                       value={this.state.email}/>
                            <FormField placeholder="Телефон"
                                       id="phone"
                                       onChange={this.onPhoneChange}
                                       type="number"
                                       hasError={this.hasError('phone')}
                                       errorText={this.errorText('phone')}
                                       value={this.state.phone}/>
                            <div className="modal-block__allow">
                                <div className="modal-block__allow-title">Разрешить вход через:</div>
                                <div className="modal-block__social">
                                    <ul className="social-links">
                                        <li><SocialLinkButton href={true ? false : "https://www.instagram.com"}
                                                              xlinkHref="/public/social-links-sprite/social-links-sprite.svg#icon-vk"
                                                              dark={true} withRemoveButton={true} unactive={true}/>
                                        </li>
                                        <li><SocialLinkButton href={true ? false : "https://www.instagram.com"}
                                                              xlinkHref="/public/social-links-sprite/social-links-sprite.svg#icon-facebook"
                                                              dark={true} withRemoveButton={true}/>
                                        </li>
                                        <li><SocialLinkButton href={true ? false : "https://ru-ru.facebook.com/"}
                                                              xlinkHref="/public/social-links-sprite/social-links-sprite.svg#icon-twitter"
                                                              dark={true} withRemoveButton={true}/>
                                        </li>
                                        <li><SocialLinkButton href={true ? false : "https://www.instagram.com/"}
                                                              xlinkHref="/public/social-links-sprite/social-links-sprite.svg#icon-inst"
                                                              dark={true} withRemoveButton={true}/>
                                        </li>
                                        <li><SocialLinkButton href={true ? false : "https://vk.com"}
                                                              xlinkHref="/public/social-links-sprite/social-links-sprite.svg#icon-youtube"
                                                              dark={true} withRemoveButton={true}/>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <Button size="medium" style="normal" title="Сохранить" fullLength={true} submit={true}
                                    onClick={this.checkAndSubmit}/>
                        </div>
                    </form>
                </div>
            </div>
        </div>;
    }
}

Profile.propTypes = {
    onFormSubmit: PropTypes.func.isRequired,
    closeForm: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    formErrors: PropTypes.object.isRequired,
    resetErrors: PropTypes.func.isRequired
};
