import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import dayjs from 'dayjs';
import UserPoster from '../components/UserPoster/UserPoster';
import { StyleSheet, css } from '../aphrodite';
import MainScreen from '../layouts/MainScreen/MainScreen';
import { loadSpecificUser as loadSpecificUserAction } from '../redux/users/actions';
import WallPhotosCards from '@/v2/components/WallPhotosCards/WallPhotosCards';


class WallPhotos extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      currentDay: dayjs().format('YYYY-MM-DD'),
      ascentsForCalendar: [],
      ascentsForPie: [],
    };
  }

  obtainUser = (userId, users) => {
    if (!users[userId]) {
      this.props.loadSpecificUser(userId);

      return {
        base_name: `User #${userId}`,
      };
    }

    const user = users[userId];

    return {
      ...user,
      base_name: user.name ? user.name : (user.login ? user.login : `User #${user.id}`),
    };
  };

  render() {
    const { match, users } = this.props;

    return (
      <MainScreen
        header={
          <UserPoster
            user={this.obtainUser(match.params.user_id, users)}
          />
        }
      >
        <div style={{width: '100%'}}>
          <div className={css(style.content)}>
            <WallPhotosCards />
          </div>
        </div>
      </MainScreen>
    );
  }
}

const style = StyleSheet.create({
  content: {
    flex: 1,
    maxWidth: '1600px',
    paddingLeft: '30px',
    paddingRight: '30px',
    marginRight: 'auto',
    marginLeft: 'auto',
  },
});

const mapStateToProps = state => ({
  users: state.usersStoreV2.store,
});

const mapDispatchToProps = dispatch => ({
  loadSpecificUser: userId => dispatch(loadSpecificUserAction(userId)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(WallPhotos));
