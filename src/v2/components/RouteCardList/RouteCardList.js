import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import RouteRow from '@/v1/components/RouteRow/RouteRow';
import getArrayByIds from '@/v1/utils/getArrayByIds';
import { StyleSheet, css } from '../../aphrodite';

const RouteCardList = ({
  user,
  onRouteClick,
  routes,
  routeIds,
}) => (
  <div className={css(styles.tableCard)}>
    <div className={css(styles.tableCardHeader)}>
      <div className={css(styles.tableCardHeaderItem, styles.tableCardNumber)}>Номер</div>
      <div className={css(styles.tableCardHeaderItem, styles.tableCardName)}>Название трассы</div>
      <div className={css(styles.tableCardHeaderItem, styles.tableCardCategory)}>Категория</div>
      <div className={css(styles.tableCardHeaderItem, styles.tableCardHooks)}>Зацепы</div>
      <div className={css(styles.tableCardHeaderItem, styles.tableCardMarking)}>Маркеры</div>
      <div className={css(styles.tableCardHeaderItem, styles.tableCardAuthor)}>Накрутчик</div>
    </div>
    {
      R.map(
        route => (
          <RouteRow
            key={route.id}
            route={route}
            user={user}
            onRouteClick={() => onRouteClick(route.id)}
          />
        ),
        getArrayByIds(routeIds, routes),
      )
    }
  </div>
);

const styles = StyleSheet.create({
  tableCard: {
    width: '100%',
    backgroundColor: '#ffffff',
    border: '2px solid #D1D5E2',
    marginTop: '50px',
    position: 'relative',
  },
  tableCardHeader: {
    display: 'flex',
    padding: '36px 44px',
  },
  tableCardHeaderItem: {
    color: '#A5A4A4',
    fontSize: '20px',
    fontFamily: ['GilroyRegular', 'sans-serif'],
    flexShrink: '0',
  },
  tableCardAdd: {
    width: '24px',
    height: '24px',
    border: '2px solid #B4BACF',
    backgroundColor: '#ffffff',
    position: 'absolute',
    content: '\'\'',
    top: '-44px',
    left: '0',
    cursor: 'pointer',
    padding: '0',
    ':hover': {
      borderColor: '#006CEB',
      ':before': {
        backgroundColor: '#006CEB',
      },
      ':after': {
        backgroundColor: '#006CEB',
      },
    },
    ':before': {
      width: '10px',
      height: '2px',
      backgroundColor: '#B4BACF',
      position: 'absolute',
      content: '\'\'',
      left: '50%',
      top: '50%',
      transform: 'translateX(-50%)',
    },
    ':after': {
      width: '10px',
      height: '2px',
      backgroundColor: '#B4BACF',
      position: 'absolute',
      content: '\'\'',
      left: '50%',
      top: '50%',
      transform: 'translateX(-50%) rotate(90deg)',
    },
  },
  tableCardNumber: {
    width: '10%',
  },
  tableCardName: {
    width: '22%',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
  tableCardCategory: {
    width: '18%',
  },
  tableCardHooks: {
    width: '15%',
  },
  tableCardMarking: {
    width: '15%',
  },
  tableCardAuthor: {
    width: '20%',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
});

RouteCardList.propTypes = {
  user: PropTypes.object,
  routes: PropTypes.object.isRequired,
  routeIds: PropTypes.array.isRequired,
  onRouteClick: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  routes: state.routesStoreV2.routes,
  routeIds: (
    state.routesStoreV2.filtrationResults[0]
      ? state.routesStoreV2.filtrationResults[0].routeIds
      : []
  ),
  user: state.usersStore.users[state.usersStore.currentUserId],
});

export default withRouter(connect(mapStateToProps)(RouteCardList));
