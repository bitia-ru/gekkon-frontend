import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import * as R from 'ramda';
import PropTypes from 'prop-types';
import MainScreen from '../layouts/MainScreen/MainScreen';
import { loadUsers as loadUsersAction } from '../redux/users/actions';
import ContentWithLeftPanel from '../layouts/ContentWithLeftPanel';
import LeftPanelList from '../layouts/LeftPanelList';
import TableLayout from '../components/common/Table/TableLayout';
import Img from '../components/common/Img/Img';
import { userBaseName } from '../utils/users';
import { StyleSheet } from '@/v2/aphrodite';

const Users = ({ users, loadUsers, match, history }) => {
  const sortOptions = {
    score: 'По очкам',
    karma: 'По карме',
    registration_date: 'По дате регистрации',
    id: 'По ID',
  };

  const [currentSortOption, setCurrentSortOption] = useState(Object.keys(sortOptions)[0]);
  const [usersLoading, setUsersLoading] = useState(true);

  useEffect(() => { loadUsers(setUsersLoading(false)); }, []);

  const userRoleToText = (role) => {
    switch (role) {
    case 'admin': return 'Админ';
    case 'creator': return 'Наполнитель';
    default: return 'Юзер';
    }
  };

  const usersSorted = (usersData, sortBy) => {
    const transform = {
      id: R.sortBy(R.prop('id')),
      registration_date: R.sortBy(R.prop('created_at')),
      karma: R.pipe(
        R.filter(u => (u.data && u.data.karma > 0)),
        R.sortBy(
          R.pipe(
            R.path(['data', 'karma']),
            R.divide(1),
          ),
        ),
      ),
      score: R.pipe(
        R.filter(u => u.statistics.score > 0),
        R.sortBy(
          R.pipe(
            R.path(['statistics', 'score']),
            R.divide(1),
          ),
        ),
      ),
    };

    return transform[sortBy](
      R.reduce((list, userId) => [...list, usersData[userId]], [])(R.keys(usersData)),
    );
  };

  const getCurrentCols = (sortType) => {
    const colsHeaderText = ['index', 'avatar', 'name', 'userId', 'dateRegistration', 'scores', 'role', 'karma'];
    let colsIndex = [];
    switch (sortType) {
    case 'karma':
      colsIndex = [0, 1, 2, 4, 6, 7];
      break;
    case 'registration_date':
      colsIndex = [0, 1, 2, 4, 5, 7];
      break;
    case 'id':
      colsIndex = [0, 1, 2, 3, 5, 7];
      break;
    default:
      colsIndex = [0, 1, 2, 5, 7];
    }
    return colsHeaderText.filter((el, i) => colsIndex.includes(i));
  };

  const getDate = (date) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const dayRegistration = new Date(date);
    return dayRegistration.toLocaleDateString('ru-RU', options);
  };

  const onUserClick = url => history.push(url);

  return (
    <MainScreen header="Пользователи">
      <ContentWithLeftPanel
        panelTitle="Сортировки"
        panel={<LeftPanelList options={sortOptions} onOptionSelected={setCurrentSortOption} />}
      >
        <TableLayout
          cols={{
            index: '№',
            avatar: 'Аватар',
            name: { style: { textAlign: 'left' }, content: 'Имя' },
            userId: 'ID',
            dateRegistration: 'Зарегистрирован',
            scores: 'Очки',
            role: 'Роль',
            karma: 'Карма',
          }}
          currentCols={getCurrentCols(currentSortOption)}
          rows={
            usersSorted(users, currentSortOption).map(
              (user, index) => ({
                key: user.id,
                index: index + 1,
                avatar: user.avatar ? user.avatar.url : '',
                name: userBaseName(user),
                userId: user.id,
                dateRegistration: getDate(user.created_at),
                scores: Math.round(user.statistics.score),
                role: userRoleToText(user.role),
                karma: Math.round(user.data.karma * 100) / 100.0,
                url: `${match.url}/${user.id}`,
              }),
            )
          }
          rowFormat={
            user => ({
              index: { style: { fontWeight: 'bold' }, content: user.index },
              avatar: {
                style: { minWidth: '75px' },
                content: <Img
                  height={55}
                  src={user.avatar}
                  defaultImage={require('../components/common/Img/images/avatar_placeholder.svg')}
                />,
              },
              name: {
                style: { textAlign: 'left', fontFamily: 'GilroyBold', fontWeight: 'bold' },
                content: user.name,
              },
              userId: `#${user.userId}`,
            })
          }
          tableStyle={styles.userTable}
          rowStyle={styles.userRow}
          onRowClick={onUserClick}
          isLoading={usersLoading}
        />
      </ContentWithLeftPanel>
    </MainScreen>
  );
};

const styles = StyleSheet.create({
  userTable: {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: '0 15px',
    '> th': {
      fontWeight: 'bold',
      fontFamily: 'GilroyBold',
      padding: '0px 10px',
      ':first-child': { paddingLeft: '20px' },
      ':last-child': { paddingRight: '20px' },
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
      ':first-child': { paddingLeft: '20px' },
      ':last-child': { paddingRight: '20px' },
    },
  },
});

Users.propTypes = {
  users: PropTypes.object,
  loadUsers: PropTypes.func,
  match: PropTypes.object,
  history: PropTypes.object,
};

const mapStateToProps = state => ({ users: state.usersStoreV2.store });

const mapDispatchToProps = dispatch => ({ loadUsers: () => dispatch(loadUsersAction()) });

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Users));
