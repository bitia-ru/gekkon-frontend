import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as R from 'ramda';
import bcrypt from 'bcryptjs';
import { SALT_ROUNDS } from '@/v1/Constants/Bcrypt';
import TabBar from '@/v1/components/TabBar/TabBar';
import SocialLinkButton from '@/v1/components/SocialLinkButton/SocialLinkButton';
import Button from '@/v1/components/Button/Button';
import FormField from '@/v1/components/FormField/FormField';
import { PASSWORD_MIN_LENGTH } from '@/v1/Constants/User';
import { reEmail } from '@/v1/Constants/Constraints';
import { enterWithVk } from '../../utils/vk';
import Modal from '../../layouts/Modal';

import './SignUpForm.css';


class SignUpForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      phone: '',
      passwordFromSms: '',
      email: '',
      password: '',
      repeatPassword: '',
      errors: {},
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

  onPasswordFromSmsChange = (event) => {
    this.resetErrors();
    this.setState({ passwordFromSms: event.target.value });
  };

  onEmailChange = (event) => {
    this.resetErrors();
    this.setState({ email: event.target.value });
    this.check('email', event.target.value);
  };

  onPasswordChange = (event) => {
    this.resetErrors();
    this.setState({ password: event.target.value });
    this.check('password', event.target.value);
  };

  onRepeatPasswordChange = (event) => {
    this.resetErrors();
    this.setState({ repeatPassword: event.target.value });
    this.check('repeatPassword', event.target.value);
  };

  check = (field, value) => {
    const { errors, password } = this.state;
    switch (field) {
    case 'email':
      if (value === '' || !R.test(reEmail, value)) {
        this.setState({ errors: R.merge(errors, { email: ['Неверный формат email'] }) });
        return false;
      }
      return true;
    case 'password':
      if (value === '' || value.length < PASSWORD_MIN_LENGTH) {
        const msgErr = `Минимальная длина пароля ${PASSWORD_MIN_LENGTH} символов`;
        this.setState({ errors: R.merge(errors, { password: [msgErr] }) });
        return false;
      }
      return true;
    case 'repeatPassword':
      if (password !== value) {
        this.setState(
          { errors: R.merge(errors, { repeatPassword: ['Пароли не совпадают'] }) },
        );
        return false;
      }
      return true;
    default:
      return true;
    }
  };

  checkAndSubmit = (type, data, passwordNew) => {
    const { email, password, repeatPassword } = this.state;
    let res = !this.check('email', email);
    res += !this.check('password', password);
    res += !this.check('repeatPassword', repeatPassword);
    if (res > 0) {
      return;
    }
    this.onFormSubmit(type, data, passwordNew);
  };

  onFormSubmit = (type, data, password) => {
    const { errors } = this.state;
    const { signUp } = this.props;
    const { location } = window;
    if (type === 'email') {
      this.setState({ isWaiting: true });
      const salt = bcrypt.genSaltSync(SALT_ROUNDS);
      const hash = bcrypt.hashSync(password, salt);
      const params = { user: { password_digest: hash, email: data } };
      signUp(
        params,
        () => location.reload(),
        () => this.setState({ isWaiting: false }),
        error => this.setState({ errors: R.merge(errors, error.response.data) }),
      );
    }
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

  firstTabContent = () => {
    const {
      isWaiting, phone, passwordFromSms,
    } = this.state;
    return (
      <form action="#" className="form">
        <FormField
          placeholder="Ваш телефон"
          id="your-phone"
          onChange={this.onPhoneChange}
          type="number"
          hasError={this.hasError('phone')}
          errorText={this.errorText('phone')}
          value={phone}
        />
        <FormField
          placeholder="Пароль из смс"
          id="password-from-sms"
          onChange={this.onPasswordFromSmsChange}
          type="text"
          hasError={this.hasError('passwordFromSms')}
          errorText={this.errorText('passwordFromSms')}
          value={passwordFromSms}
        />
        <Button
          size="medium"
          style="normal"
          title="Зарегистрироваться"
          fullLength
          submit
          isWaiting={isWaiting}
          onClick={() => this.checkAndSubmit('phone', phone, passwordFromSms)}
        />
      </form>
    );
  };

  secondTabContent = () => {
    const {
      isWaiting, email, password, repeatPassword,
    } = this.state;
    return (
      <form action="#" className="form">
        <FormField
          placeholder="Ваш email"
          id="your-email"
          onChange={this.onEmailChange}
          type="text"
          hasError={this.hasError('email')}
          errorText={this.errorText('email')}
          value={email}
        />
        <FormField
          placeholder="Придумайте пароль"
          id="password"
          onChange={this.onPasswordChange}
          type="password"
          hasError={this.hasError('password')}
          errorText={this.errorText('password')}
          value={password}
        />
        <FormField
          placeholder="Повторите пароль"
          id="repeat-password"
          onChange={this.onRepeatPasswordChange}
          type="password"
          hasError={this.hasError('repeatPassword')}
          errorText={this.errorText('repeatPassword')}
          onEnter={
            () => this.checkAndSubmit('email', email, password, repeatPassword)
          }
          value={repeatPassword}
        />
        <Button
          size="medium"
          style="normal"
          title="Зарегистрироваться напрямую"
          fullLength
          submit
          isWaiting={isWaiting}
          onClick={
            () => this.checkAndSubmit('email', email, password, repeatPassword)
          }
        />
      </form>
    );
  };

  render() {
    const socialLinksSprite = require(
      '../../../../img/social-links-sprite/social-links-sprite.svg',
    );

    const iconVk = `${socialLinksSprite}#icon-vk`;
    const iconFB = `${socialLinksSprite}#icon-facebook`;
    const iconTwitter = `${socialLinksSprite}#icon-twitter`;
    const iconInst = `${socialLinksSprite}#icon-inst`;
    const iconYoutube = `${socialLinksSprite}#icon-youtube`;

    return (
      <Modal maxWidth="580px">
        <div className="modal-block__padding-wrapper">
          <h3 className="modal-block__title">Регистрация</h3>
          <TabBar
            contentList={[this.firstTabContent(), this.secondTabContent()]}
            activeList={[false, true]}
            activeTab={2}
            test={this.firstTabContent()}
            titleList={['Телефон', 'Email']}
          />
          <div className="modal-block__or">
            <div className="modal-block__or-inner">или через</div>
          </div>
          <div className="modal-block__social">
            <ul className="social-links">
              <li><SocialLinkButton onClick={() => enterWithVk('signUp')} xlinkHref={iconVk} dark /></li>
              { false
                  && <>
                    <li><SocialLinkButton xlinkHref={iconFB} dark unactive /></li>
                    <li><SocialLinkButton xlinkHref={iconTwitter} dark unactive /></li>
                    <li><SocialLinkButton xlinkHref={iconInst} dark unactive /></li>
                    <li><SocialLinkButton xlinkHref={iconYoutube} dark unactive /></li>
                  </>
              }
            </ul>
          </div>
        </div>
      </Modal>
    );
  }
}

SignUpForm.propTypes = {
  closeForm: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
  signUp: () => {},
});

export default withRouter(connect(null, mapDispatchToProps)(SignUpForm));
