import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import TabBar from '../TabBar/TabBar';
import SocialLinkButton from '../SocialLinkButton/SocialLinkButton';
import Button from '../Button/Button';
import FormField from '../FormField/FormField';
import CloseButton from '../CloseButton/CloseButton';
import CheckBox from '../CheckBox/CheckBox';
import './LogInForm.css';
import { reEmail } from '../../Constants/Constraints';
import { logIn } from '../../stores/users/utils';

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
    this.mouseOver = false;
  }

  componentDidMount() {
    window.addEventListener('keydown', this.onKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.onKeyDown);
  }

    onKeyDown = (event) => {
      if (event.key === 'Escape') {
        this.closeForm();
      }
    };

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

    checkAndSubmit = (type, data, passwordNew) => {
      const { password, rememberMe } = this.state;
      const res = !this.check('password', password);
      if (res > 0) {
        return;
      }
      this.onFormSubmit(type, data, passwordNew, rememberMe);
    };

    onFormSubmit = (type, data, password, rememberMe) => {
      if (type !== 'email') {
        throw `Argument error: value ${type} for argument type is invalid.`;
      }
      const { errors } = this.state;
      const { logIn: logInProp } = this.props;
      const { location } = window;
      this.setState({ isWaiting: true });
      let params;
      if (R.test(reEmail, data)) {
        params = { user_session: { user: { email: data } }, rememberMe };
      } else {
        params = { user_session: { user: { login: data } }, rememberMe };
      }
      logInProp(
        params,
        password,
        () => location.reload(),
        () => this.setState({ isWaiting: false }),
        err => this.setState({ errors: R.merge(errors, err) }),
      );
    };

    hasError = (field) => {
      const { errors } = this.state;
      return errors[field];
    };

    errorText = (field) => {
      const { errors } = this.state;
      return R.join(
        ', ',
        errors[field] ? errors[field] : [],
      );
    };

    closeForm = () => {
      const { closeForm } = this.props;
      this.resetErrors();
      closeForm();
    };

    resetPassword = (type) => {
      const { resetPassword } = this.props;
      const { phone, email } = this.state;
      if (type === 'phone') {
        if (phone === '') {
          this.setState({ errors: { phone: ['Введите телефон'] } });
        } else {
          resetPassword('phone', phone);
        }
      }
      if (type === 'email') {
        if (email === '') {
          this.setState({ errors: { email: ['Введите почту / логин'] } });
        } else {
          resetPassword('email', email);
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

    secondTabContent = () => {
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
            onEnter={() => this.checkAndSubmit('email', email, password)}
            value={password}
          />
          <Button
            size="medium"
            style="normal"
            title="Войти"
            fullLength
            submit
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
      const { enterWithVk } = this.props;
      const socialLinksSprite = require(
        '../../../../img/social-links-sprite/social-links-sprite.svg',
      ).default;
      const iconVk = `${socialLinksSprite}#icon-vk`;
      const iconTwitter = `${socialLinksSprite}#icon-twitter`;
      const iconYoutube = `${socialLinksSprite}#icon-youtube`;
      return (
        <div
          role="button"
          tabIndex={0}
          style={{ outline: 'none' }}
          className="modal-overlay"
          onClick={() => {
            if (!this.mouseOver) {
              this.closeForm();
            }
          }}
        >
          <div className="modal-overlay__wrapper">
            <div className="modal-block">
              <div
                className="modal-block__padding-wrapper"
                onMouseOver={() => {
                  this.mouseOver = true;
                }}
                onMouseLeave={() => {
                  this.mouseOver = false;
                }}
              >
                <div className="modal-block__close">
                  <CloseButton onClick={this.closeForm} />
                </div>
                <h3 className="modal-block__title">
                            Вход в систему
                </h3>
                <TabBar
                  contentList={[this.firstTabContent(), this.secondTabContent()]}
                  activeList={[false, true]}
                  activeTab={2}
                  titleList={['Телефон', 'Email / логин']}
                />
                <div className="modal-block__or">
                  <div className="modal-block__or-inner">или через</div>
                </div>
                <div className="modal-block__social">
                  <ul className="social-links">
                    <li><SocialLinkButton onClick={() => enterWithVk('logIn')} xlinkHref={iconVk} dark /></li>
                    { false
                        && <>
                          <li><SocialLinkButton xlinkHref={iconTwitter} dark unactive /></li>
                          <li><SocialLinkButton xlinkHref={iconYoutube} dark unactive /></li>
                        </>
                    }
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
}

LogInForm.propTypes = {
  enterWithVk: PropTypes.func.isRequired,
  closeForm: PropTypes.func.isRequired,
  resetPassword: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
  logIn: (
    params, password, afterLogInSuccess, afterLogInFail, onFormError,
  ) => dispatch(
    logIn(params, password, afterLogInSuccess, afterLogInFail, onFormError),
  ),
});

export default withRouter(connect(null, mapDispatchToProps)(LogInForm));
