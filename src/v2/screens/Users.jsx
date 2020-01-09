import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { StyleSheet, css } from '../aphrodite';
import MainScreen from '../layouts/MainScreen/MainScreen';
import { loadUsers } from '../redux/users/actions';
import ContentWithLeftPanel from '@/v2/layouts/ContentWithLeftPanel';
import LeftPanelList from '@/v2/layouts/LeftPanelList';


const obtainUsers = (users, loadUsers) => {
  if (Object.keys(users).length === 0) {
    loadUsers();

    return {};
  }

  return users;
};

class Users extends React.PureComponent {
  sortOptions = {
    by_id: 'По ID',
    by_registration_date: 'По дате регистрации',
    by_karma: 'По карме',
    by_score: 'По очкам',
  };

  onSortChanged = (selectedSort) => {
    console.log(selectedSort);
  };

  render() {
    return (
      <MainScreen header="Пользователи">
        <ContentWithLeftPanel
          panel={
            <LeftPanelList options={this.sortOptions} onOptionSelected={this.onSortChanged} />
          }
        >
          <table>
          {
            Object.keys(obtainUsers(this.props.users, this.props.loadUsers)).map(
              (id, index) => {
                const user = this.props.users[id];
                return <tr className={css(style.userRow)} onClick={() => { this.props.history.push(this.props.match.url + `/${user.id}`); }}>
                  <td>{index}</td>
                  <td>#{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.login}</td>
                  <td>{user.data['karma']}</td>
                </tr>;
              },
            )
          }
          </table>
        </ContentWithLeftPanel>
      </MainScreen>
    );
  }
}

const style = StyleSheet.create({
  userRow: {
    ':hover': {
      cursor: 'pointer',
      fontWeight: 600,
    },
  },
});

const mapStateToProps = state => ({
  users: state.usersStoreV2.store,
});

const mapDispatchToProps = dispatch => ({
  loadUsers: () => dispatch(loadUsers()),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Users));
