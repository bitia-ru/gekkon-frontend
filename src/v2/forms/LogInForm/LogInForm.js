import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as R from 'ramda';
import TabBar from '@/v1/components/TabBar/TabBar';
import SocialLinkButton from '@/v1/components/SocialLinkButton/SocialLinkButton';
import Button from '@/v1/components/Button/Button';
import FormField from '@/v1/components/FormField/FormField';
import CheckBox from '@/v1/components/CheckBox/CheckBox';
import { reEmail } from '@/v1/Constants/Constraints';
import Modal from '../../layouts/Modal';
import { createUserSession } from '../../utils/auth';
import { enterWithVk } from '../../utils/vk';

import './LogInForm.css';
import { ModalContext } from '../../modules/modalable';
import Api from '@/v2/utils/Api';
import showToastr from '@/v2/utils/showToastr';


class LogInForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      phone: '',
      passwordEnter: '',
      email: '',
      password: '',
      errors: {},
      rememberMe: true,
      isWaiting: false,
    };
  }

  resetErrors = () => {
    this.setState({ errors: {} });
  };

  onPhoneChange = (event) => {
    this.resetErrors();
    this.setState({ phone: event.target.value });
  };

  onPasswordEnterChange = (event) => {
    this.resetErrors();
    this.setState({ passwordEnter: event.target.value });
  };

  onEmailChange = (event) => {
    this.resetErrors();
    this.setState({ email: event.target.value });
  };

  onPasswordChange = (event) => {
    this.resetErrors();
    this.setState({ password: event.target.value });
    this.check('password', event.target.value);
  };

  onRememberMeChange = () => {
    const { rememberMe } = this.state;
    this.setState({ rememberMe: !rememberMe });
  };

  check = (field, value) => {
    const { errors } = this.state;
    switch (field) {
    case 'password':
      if (value.length === 0) {
        this.setState(
          {
            errors: R.merge(
              errors,
              { password_digest: ['Пароль не может быть пустым'] },
            ),
          },
        );
        return false;
      }
      return true;
    default:
      return true;
    }
  };

  checkAndSubmit = (type, data, passwordNew, after) => {
    const { password, rememberMe } = this.state;
    const res = !this.check('password', password);
    if (res > 0) {
      return;
    }
    this.onFormSubmit(type, data, passwordNew, rememberMe, after);
  };

  onFormSubmit = (type, data, password, longDuration, after) => {
    if (type !== 'email') {
      throw `Argument error: value ${type} for argument type is invalid.`;
    }

    const { errors } = this.state;

    this.setState({ isWaiting: true });

    createUserSession(
      {
        [R.test(reEmail, data) ? 'email' : 'login']: data,
      },
      password,
      longDuration,
      () => {
        after && after();
      },
      (errorDetails) => {
        this.setState({ isWaiting: false });
        if (errorDetails) {
          this.setState({ errors: R.merge(errors, errorDetails) });
        }
      },
    );
  };

  hasError = (field) => {
    const { errors } = this.state;
    return errors[field];
  };

  errorText = (field) => {
    const { errors } = this.state;
    return R.join(', ', errors[field] ? errors[field] : []);
  };

  resetPassword = (type) => {
    const { email, errors } = this.state;

    if (type === 'email') {
      if (email === '') {
        this.setState({ errors: { email: ['Введите почту / логин'] } });
      } else {
        let params;
        if (R.test(reEmail, email)) {
          params = { user: { email } };
        } else {
          params = { user: { login: email } };
        }

        const self = this;
        Api.get(
          '/v1/users/send_reset_password_mail',
          {
            params,
            success() {
              showToastr(
                'На почту было отправлено сообщение для восстановления пароля',
                {
                  type: 'success',
                  after: () => {
                    window.history.back();
                  },
                },
              );
            },
            failed(error) {
              const resp = error.response;
              let errorMsg;
              if (resp && resp.status === 404 && resp.data.model === 'User') {
                errorMsg = 'Пользователь не найден';
              } else if (resp && resp.status === 400 && resp.data.email) {
                errorMsg = 'Без почты невозможно восстановить пароль. Обратитесь к администратору.';
              } else {
                errorMsg = 'Не удалось отправить на почту сообщение для восстановления пароля';
              }
              self.setState(
                {
                  errors: R.merge(
                    errors,
                    { email: [errorMsg] },
                  ),
                },
              );
            },
          },
        );
      }
    }
  };

  firstTabContent = () => {
    const {
      isWaiting, phone, passwordEnter, rememberMe,
    } = this.state;

    return (
      <form action="#" className="form">
        <FormField
          placeholder="Телефон"
          id="phone"
          onChange={this.onPhoneChange}
          type="number"
          hasError={this.hasError('phone')}
          errorText={this.errorText('phone')}
          value={phone}
        />
        <FormField
          placeholder="Пароль"
          id="password-enter"
          onChange={this.onPasswordEnterChange}
          type="text"
          hasError={this.hasError('passwordEnter')}
          errorText={this.errorText('passwordEnter')}
          value={passwordEnter}
        />
        <Button
          size="medium"
          style="normal"
          title="Войти"
          fullLength
          submit
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
          <a
            role="link"
            tabIndex={0}
            style={{ outline: 'none' }}
            className="modal-block__link"
            onClick={() => this.resetPassword('phone')}
          >
            Забыли пароль?
          </a>
        </div>
      </form>
    );
  };

  secondTabContent = (closeModal) => {
    const {
      isWaiting, email, password, rememberMe,
    } = this.state;

    return (
      <form action="#" className="form">
        <FormField
          placeholder="Email / логин"
          id="email"
          onChange={this.onEmailChange}
          type="text"
          hasError={this.hasError('email')}
          errorText={this.errorText('email')}
          value={email}
        />
        <FormField
          placeholder="Пароль"
          id="password"
          onChange={this.onPasswordChange}
          type="password"
          hasError={this.hasError('password_digest')}
          errorText={this.errorText('password_digest')}
          onEnter={
            () => this.checkAndSubmit(
              'email',
              email,
              password,
              () => {
                closeModal();
                window.location.reload(true);
              },
            )
          }
          value={password}
        />
        <Button
          size="medium"
          style="normal"
          title="Войти"
          fullLength
          submit
          isWaiting={isWaiting}
          onClick={
            () => this.checkAndSubmit(
              'email',
              email,
              password,
              () => {
                closeModal();
                window.location.reload(true);
              },
            )
          }
        />
        <div className="modal-block__settings">
          <CheckBox
            id="rememberMeTab2"
            onChange={this.onRememberMeChange}
            checked={rememberMe}
            title="Запомнить меня"
          />
          <a
            role="link"
            tabIndex={0}
            style={{ outline: 'none' }}
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
    const socialLinksSprite = require(
      '../../../../img/social-links-sprite/social-links-sprite.svg',
    ).default;

    const iconVk = `${socialLinksSprite}#icon-vk`;
    const iconTwitter = `${socialLinksSprite}#icon-twitter`;
    const iconYoutube = `${socialLinksSprite}#icon-youtube`;

    return (
      <Modal maxWidth="580px">
        <ModalContext.Consumer>
          {
            ({ closeModal }) => (
              <div className="modal-block__padding-wrapper">
                <h3 className="modal-block__title">Вход в систему</h3>
                <TabBar
                  contentList={[this.firstTabContent(), this.secondTabContent(closeModal)]}
                  activeList={[false, true]}
                  activeTab={2}
                  titleList={['Телефон', 'Email / логин']}
                />
                <div className="modal-block__or">
                  <div className="modal-block__or-inner">или через</div>
                </div>
                <div className="modal-block__social">
                  <ul className="social-links">
                    <li>
                      <SocialLinkButton
                        onClick={
                          () => {
                            enterWithVk('logIn', null, this.state.rememberMe);
                          }
                        }
                        xlinkHref={iconVk}
                        dark
                      />
                    </li>
                    { false
                    && <>
                      <li><SocialLinkButton xlinkHref={iconTwitter} dark unactive /></li>
                      <li><SocialLinkButton xlinkHref={iconYoutube} dark unactive /></li>
                    </>
                    }
                  </ul>
                </div>
              </div>
            )
          }
        </ModalContext.Consumer>
      </Modal>
    );
  }
}

const mapDispatchToProps = dispatch => ({
});

export default withRouter(connect(null, mapDispatchToProps)(LogInForm));
