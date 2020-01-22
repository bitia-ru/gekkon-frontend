import React, { Component } from 'react';
import * as R from 'ramda';
import bcrypt from 'bcryptjs';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import TabBar from '@/v1/components/TabBar/TabBar';
import Button from '@/v1/components/Button/Button';
import FormField from '@/v1/components/FormField/FormField';
import { PASSWORD_MIN_LENGTH } from '@/v1/Constants/User';
import { SALT_ROUNDS } from '@/v1/Constants/Bcrypt';
import { reEmail } from '@/v1/Constants/Constraints';
import Modal from '../../layouts/Modal';

import './ResetPasswordForm.css';


class ResetPasswordForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      passwordFromSms: '',
      password: '',
      repeatPassword: '',
      errors: {},
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

    resetErrors = () => {
      this.setState({ errors: {} });
    };

    onPasswordFromSmsChange = (event) => {
      this.resetErrors();
      this.setState({ passwordFromSms: event.target.value });
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
      const { password, repeatPassword } = this.state;
      let res = !this.check('password', password);
      res += !this.check('repeatPassword', repeatPassword);
      if (res > 0) {
        return;
      }
      this.onFormSubmit(type, data, passwordNew);
    };

    onFormSubmit = (type, data, password) => {
      if (type !== 'email') {
        throw `Argument error: value ${type} for argument type is invalid.`;
      }
      const { resetPassword: resetPasswordProp } = this.props;
      this.setState({ isWaiting: true });
      const url = new URL(window.location.href);
      const salt = bcrypt.genSaltSync(SALT_ROUNDS);
      const hash = bcrypt.hashSync(password, salt);
      let params;
      if (R.test(reEmail, data)) {
        params = {
          user: { password_digest: hash, email: data },
          token: url.searchParams.get('reset_password_code'),
        };
      } else {
        params = {
          user: { password_digest: hash, login: data },
          token: url.searchParams.get('reset_password_code'),
        };
      }
      resetPasswordProp(
        params,
        () => {
          this.logIn(data, password);
        },
        () => {
          this.setState({ isWaiting: false });
          //this.showToastr(
          //  'error',
          //  'Ошибка',
          //  'Срок действия ссылки для восстановления пароля истек или пользователь не найден',
          //);
        },
      );
    };

    logIn = (data, password) => {
      const { logIn: logInProp } = this.props;
      let params;
      if (R.test(reEmail, data)) {
        params = { user_session: { user: { email: data } } };
      } else {
        params = { user_session: { user: { login: data } } };
      }
      logInProp(
        params,
        password,
        () => { window.location.href = '/'; },
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

    firstTabContent = () => {
      const { phone } = this.props;
      const { passwordFromSms, isWaiting } = this.state;
      return (
        <form action="#" className="form">
          <FormField
            placeholder="Ваш телефон"
            id="your-phone"
            onChange={null}
            type="number"
            disabled
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
            title="Восстановить"
            fullLength
            submit
            isWaiting={isWaiting}
            onClick={() => this.checkAndSubmit('phone', phone, passwordFromSms)}
          />
        </form>
      );
    };

    secondTabContent = () => {
      const { email } = this.props;
      const { password, repeatPassword, isWaiting } = this.state;
      return (
        <form action="#" className="form">
          <FormField
            placeholder="Email / логин"
            id="your-email"
            onChange={null}
            type="text"
            disabled
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
            title="Сохранить"
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
      return (
        <Modal maxWidth="580px">
          <div
            className="modal-block__padding-wrapper"
            role="button"
            tabIndex={0}
            style={{ outline: 'none' }}
          >
            <h3 className="modal-block__title">Установка нового пароля</h3>
            <TabBar
              contentList={[this.firstTabContent(), this.secondTabContent()]}
              activeList={[false, true]}
              activeTab={2}
              titleList={['Телефон', 'Email']}
            />
          </div>
        </Modal>
      );
    }
}

ResetPasswordForm.propTypes = {
};

const mapDispatchToProps = dispatch => ({
  resetPassword: (
    params, afterSuccess, afterFail, afterAll,
  ) => {},
  logIn: (
    params, password, afterLogInSuccess, afterLogInFail, onFormError,
  ) => {},
});

export default withRouter(connect(null, mapDispatchToProps)(ResetPasswordForm));
