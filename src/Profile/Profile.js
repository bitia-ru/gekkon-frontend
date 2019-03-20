import React, {Component} from 'react';
import SocialLinkButton   from '../SocialLinkButton/SocialLinkButton';
import Button             from '../Button/Button';
import FormField          from '../FormField/FormField';
import CloseButton        from '../CloseButton/CloseButton';
import PropTypes          from 'prop-types';
import {SALT_ROUNDS}      from '../Constants/Bcrypt';
import bcrypt             from 'bcryptjs';
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
            avatarFile: null
        }
    }

    onPhoneChange = (event) => {
        this.setState({phone: event.target.value})
    };

    onNameChange = (event) => {
        this.setState({name: event.target.value})
    };

    onEmailChange = (event) => {
        this.setState({email: event.target.value})
    };

    onLoginChange = (event) => {
        this.setState({login: event.target.value})
    };

    onPasswordChange = (event) => {
        this.setState({password: event.target.value})
    };

    onRepeatPasswordChange = (event) => {
        this.setState({repeatPassword: event.target.value})
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

    render() {
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
        return <div className="modal-overlay">
            <div className="modal-overlay__wrapper">
                <div className="modal-block modal-block__profile">
                    <div className="modal__close">
                        <CloseButton onClick={this.props.closeForm}/>
                    </div>
                    <form action="#" method="post" method="post" encType="multipart/form-data" className="form">
                        <div className="modal-block__avatar-block">
                            <div className="modal-block__avatar">
                                {(this.state.avatar !== null) ?
                                    <img src={this.state.avatar} alt={this.props.user.login}/> :
                                    <img src="/public/user-icon/no-avatar.jpg" alt={this.props.user.login}/>}
                                <input type="file" name="avatar" title="Изменить аватарку"
                                       onChange={(event) => this.onFileChosen(event.target.files[0])}/>
                                {this.props.user.avatar ?
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
                                       hasError={false}
                                       errorText={''}
                                       value={this.state.name}/>
                            <FormField placeholder="Логин"
                                       id="login"
                                       onChange={this.onLoginChange}
                                       type="text"
                                       hasError={false}
                                       errorText={''}
                                       value={this.state.login}/>
                            <FormField placeholder="Пароль"
                                       id="password"
                                       onChange={this.onPasswordChange}
                                       type="password"
                                       hasError={false}
                                       errorText={''}
                                       value={this.state.password}/>
                            <FormField placeholder="Подтверждение пароля"
                                       id="repeat-password"
                                       onChange={this.onRepeatPasswordChange}
                                       type="password"
                                       hasError={false}
                                       errorText={''}
                                       value={this.state.repeatPassword}/>
                            <FormField placeholder="Email"
                                       id="email"
                                       onChange={this.onEmailChange}
                                       type="text"
                                       hasError={false}
                                       errorText={''}
                                       value={this.state.email}/>
                            <FormField placeholder="Телефон"
                                       id="phone"
                                       onChange={this.onPhoneChange}
                                       type="number"
                                       hasError={false}
                                       errorText={''}
                                       value={this.state.phone}/>
                            <div className="modal-block__allow">
                                <div className="modal-block__allow-title">Разрешить вход через:</div>
                                <div className="modal-block__social">
                                    <ul className="social-links">
                                        <li><SocialLinkButton href="https://www.instagram.com"
                                                              xlinkHref="/public/social-links-sprite/social-links-sprite.svg#icon-vk"
                                                              dark={true} withRemoveButton={true} unactive={true}/>
                                        </li>
                                        <li><SocialLinkButton href="https://www.instagram.com"
                                                              xlinkHref="/public/social-links-sprite/social-links-sprite.svg#icon-facebook"
                                                              dark={true} withRemoveButton={true}/>
                                        </li>
                                        <li><SocialLinkButton href="https://ru-ru.facebook.com/"
                                                              xlinkHref="/public/social-links-sprite/social-links-sprite.svg#icon-twitter"
                                                              dark={true} withRemoveButton={true}/>
                                        </li>
                                        <li><SocialLinkButton href="https://www.instagram.com/"
                                                              xlinkHref="/public/social-links-sprite/social-links-sprite.svg#icon-inst"
                                                              dark={true} withRemoveButton={true}/>
                                        </li>
                                        <li><SocialLinkButton href="https://vk.com"
                                                              xlinkHref="/public/social-links-sprite/social-links-sprite.svg#icon-youtube"
                                                              dark={true} withRemoveButton={true}/>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <Button size="medium" style="normal" title="Сохранить" fullLength={true} submit={true}
                                    onClick={() => this.props.onFormSubmit(formData)}/>
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
    user: PropTypes.object.isRequired
};
