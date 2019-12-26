import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import MainScreen from '../../screens/Main/Main';
import MainPageHeader from '../MainPageHeader/MainPageHeader';
import MainPageContent from '../MainPageContent/MainPageContent';
import { ApiUrl } from '../../Environ';
import { activateEmail as activateEmailAction } from '../../stores/users/utils';
import getState from '../../utils/getState';

class SpotsIndex extends React.PureComponent {
  static propTypes = {
    activateEmail: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      email: '',
    };
  }

  componentDidMount() {
    const { history, activateEmail } = this.props;
    const url = new URL(window.location.href);

    let code = url.searchParams.get('activate_mail_code');

    if (code !== null) {
      const user_id = url.searchParams.get('user_id');
      activateEmail(
        `${ApiUrl}/v1/users/mail_activation/${code}`,
        { id: user_id },
        () => this.showToastr('success', 'Успешно', 'Активация email'),
        () => this.showToastr(
          'warning', 'Активация email', 'При активации произошла ошибка',
        ),
      );
    }

    code = url.searchParams.get('reset_password_code');

    if (code !== null) {
      const email = url.searchParams.get('user_email');
      this.setState(
        {
          email: email || url.searchParams.get('user_login'),
        },
        () => {
          history.push('#profile');
        },
      );
    }
  }

  render() {
    return (
      <MainScreen header={<MainPageHeader />}>
        <MainPageContent />
      </MainScreen>
    );
  }
}

const mapStateToProps = state => ({
  user: state.usersStore.users[state.usersStore.currentUserId],
  loading: getState(state),
});

const mapDispatchToProps = dispatch => ({
  activateEmail: (url, params, afterSuccess, afterFail) => dispatch(
    activateEmailAction(url, params, afterSuccess, afterFail),
  ),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SpotsIndex));
