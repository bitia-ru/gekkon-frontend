import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import * as R from 'ramda';
import { StyleSheet, css } from '../aphrodite';
import MainScreen from '../layouts/MainScreen/MainScreen';
import { loadUsers } from '../redux/users/actions';
import ContentWithLeftPanel from '../layouts/ContentWithLeftPanel';
import LeftPanelList from '../layouts/LeftPanelList';
import { userBaseName } from '../utils/users';


const obtainUsers = (users, loadUsers, sortBy) => {
  if (Object.keys(users).length === 0) {
    loadUsers();

    return [];
  }

  const sortByInternal = {
    id: R.prop('id'),
    registration_date: R.prop('created_at'),
    karma: R.pipe(R.path(['data', 'karma']), R.divide(1)),
    score: R.pipe(R.path(['statistics', 'score']), R.divide(1)),
  };

  return R.sortBy(sortByInternal[sortBy])(
    R.reduce((list, userId) => [...list, users[userId]], [])(R.keys(users)),
  );
};

class Users extends React.PureComponent {
  sortOptions = {
    score: 'По очкам',
    karma: 'По карме',
    registration_date: 'По дате регистрации',
    id: 'По ID',
  };

  constructor(props) {
    super(props);

    this.state = {
      currentSortOption: Object.keys(this.sortOptions)[0],
    };
  }


  onSortChanged = (selectedSort) => {
    this.setState({ currentSortOption: selectedSort });
  };

  render() {
    return (
      <MainScreen header="Пользователи">
        <ContentWithLeftPanel
          panelTitle="Сортировки"
          panel={
            <LeftPanelList options={this.sortOptions} onOptionSelected={this.onSortChanged} />
          }
        >
          <table className={css(style.userTable)}>
            <thead>
              <tr>
                <th>№</th>
                <th>Аватар</th>
                <th style={{ textAlign: 'left' }}>Имя</th>
                <th>Очки</th>
                <th>Карма</th>
                <th>ID</th>
              </tr>
            </thead>
            <tbody>
            {
              obtainUsers(this.props.users, this.props.loadUsers, this.state.currentSortOption).map(
                (user, index) => {
                  return <tr className={css(style.userRow)} onClick={() => { this.props.history.push(this.props.match.url + `/${user.id}`); }}>
                    <td style={{ fontWeight: 'bold' }}>{index + 1}</td>
                    <td style={{ minWidth: '75px' }}><img height={55} src={user.avatar ? user.avatar.url : ''} /></td>
                    <td style={{ textAlign: 'left', fontFamily: 'GilroyBold', fontWeight: 'bold' }}>{userBaseName(user)}</td>
                    <td>{Math.round(user.statistics.score)}</td>
                    <td>{user.data['karma']}</td>
                    <td>#{user.id}</td>
                  </tr>;
                },
              )
            }
            </tbody>
          </table>
        </ContentWithLeftPanel>
      </MainScreen>
    );
  }
}

const style = StyleSheet.create({
  userTable: {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: '0 15px',

    '> th': {
      fontWeight: 'bold',
      fontFamily: 'GilroyBold',
      padding: '0px 10px',

      ':first-child': {
        paddingLeft: '20px',
      },
      ':last-child': {
        paddingRight: '20px',
      },
    },
  },
  userRow: {
    height: '75px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.08)',
    marginBottom: '20px',
    backgroundColor: 'white',

    ':hover': {
      boxShadow: '0px 8px 8px rgba(0, 0, 0, 0.12)',
      cursor: 'pointer',
      fontWeight: 600,
    },

    '> td': {
      padding: '10px',
      textAlign: 'center',

      ':first-child': {
        paddingLeft: '20px',
      },
      ':last-child': {
        paddingRight: '20px',
      },
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
