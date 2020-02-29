import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import * as R from 'ramda';
import MainScreen from '../layouts/MainScreen/MainScreen';
import { loadUsers as loadUsersAction } from '../redux/users/actions';
import ContentWithLeftPanel from '../layouts/ContentWithLeftPanel';
import LeftPanelList from '../layouts/LeftPanelList';
import TableLayout from '../components/common/Table/TableLayout';
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

  useEffect(() => { loadUsers(); }, []);

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
            scores: 'Очки',
            karma: 'Карма',
            userId: 'ID',
          }}
          currentCols={['index', 'avatar', 'name', 'scores', 'karma']}
          rows={
            usersSorted(users, currentSortOption).map(
              (user, index) => ({
                key: user.id,
                userId: user.id,
                index: index + 1,
                avatar: user.avatar ? user.avatar.url : '',
                name: userBaseName(user),
                scores: Math.round(user.statistics.score),
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
                content: <img height={55} src={user.avatar} />,
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

const mapStateToProps = state => ({
  users: state.usersStoreV2.store,
});

const mapDispatchToProps = dispatch => ({
  loadUsers: () => dispatch(loadUsersAction()),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Users));
