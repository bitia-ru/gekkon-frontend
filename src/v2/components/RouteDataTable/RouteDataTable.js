import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import * as R from 'ramda';
import { getCategoryColor } from '@/v1/Constants/Categories';
import { GetUserName } from '@/v1/Constants/User';
import { ROUTE_KINDS } from '@/v1/Constants/Route';
import RouteColorPicker from '../RouteColorPicker/RouteColorPicker';
import { StyleSheet, css } from '../../aphrodite';
import { routeCategoryToString } from '@/lib/routeHelpers';

const RouteDataTable = ({
  user, route,
}) => {
  const isCurrentUserRoute = user && route.author_id === user.id;
  let name = route.author ? GetUserName(route.author) : null;
  if (!isCurrentUserRoute && name === null && route.author_id !== null) {
    if (user && user.role === 'admin') {
      name = GetUserName(route.author, true);
    }
    if (user && user.role === 'creator') {
      name = `Пользователь #${route.author.id}`;
    }
  }
  const kind = R.find(R.propEq('title', route.kind), ROUTE_KINDS);
  return (
  // ITS NOT DEFINED
    <div className="route-data-table">
      {/* END*/}
      <div className={css(styles.routeDataTableRow)}>
        <div className={css(styles.routeDataTableItem, styles.routeDataTableItemHeader)}>
          Категория:
        </div>
        <div className={css(styles.routeDataTableItem)}>
          <div className={css(styles.routeDataTableCategoryTrack)}>
            {routeCategoryToString(route)}
          </div>
          <div
            className={css(styles.routeDataTableCategoryTrackColor)}
            style={{ backgroundColor: getCategoryColor(route.category) }}
          />
        </div>
      </div>
      <div className={css(styles.routeDataTableRow)}>
        <div className={css(styles.routeDataTableItem, styles.routeDataTableItemHeader)}>
          Зацепы:
        </div>
        <div className={css(styles.routeDataTableItem)}>
          <RouteColorPicker editable={false} route={route} fieldName="holds_color" />
        </div>
      </div>
      {
        route.marks_color && (
          <div className={css(styles.routeDataTableRow)}>
            <div className={css(styles.routeDataTableItem, styles.routeDataTableItemHeader)}>
              Маркировка:
            </div>
            <div className={css(styles.routeDataTableItem)}>
              <RouteColorPicker editable={false} route={route} fieldName="marks_color" />
            </div>
          </div>
        )
      }
      <div className={css(styles.routeDataTableRow)}>
        <div className={css(styles.routeDataTableItem, styles.routeDataTableItemHeader)}>
          Тип:
        </div>
        <div className={css(styles.routeDataTableItem)}>
          {kind && kind.text}
        </div>
      </div>
      {
        route.installed_at && (<>
          <div className={css(styles.routeDataTableRow)}>
            <div className={css(styles.routeDataTableItem, styles.routeDataTableItemHeader)}>
              Накручена:
            </div>
            <div className={css(styles.routeDataTableItem)}>
              {moment(route.installed_at).format('DD.MM.YYYY')}
            </div>
          </div>
        </>)
      }
      {
        route.installed_until && (<>
          <div className={css(styles.routeDataTableRow)}>
            <div className={css(styles.routeDataTableItem, styles.routeDataTableItemHeader)}>
              Cкручена:
            </div>
            <div className={css(styles.routeDataTableItem)}>
              {moment(route.installed_until).format('DD.MM.YYYY')}
            </div>
          </div>
        </>)
      }
      {
        name && (<>
          <div className={css(styles.routeDataTableRow)}>
            <div className={css(styles.routeDataTableItem, styles.routeDataTableItemHeader)}>
              Накрутчик:
            </div>
            <div className={css(styles.routeDataTableItem)}>
              <a className={css(styles.routeDataTableLink)}>{isCurrentUserRoute ? 'Вы' : name}</a>
            </div>
          </div>
        </>)
      }
    </div>
  );
};

const styles = StyleSheet.create({
  routeDataTableRow: {
    display: 'flex',
    padding: '5px 0 5px',
    '@media screen and (max-width: 1440px)': {
      padding: '3px 0 3px',
    },
  },
  routeDataTableItem: {
    maxWidth: '215px',
    width: '100%',
    fontSize: '16px',
    '@media screen and (max-width: 1440px)': {
      fontSize: '14px',
    },
  },
  routeDataTableItemHeader: {
    color: '#828282',
    '@media screen and (max-width: 1440px)': {
      minWidth: '150px',
    },
  },

  // NOT USED
  routeDataTableTableItemRight: {
    maxWidth: '240px',
    width: ' 100%',
  },
  routedataTableFieldSelect: {
    marginLeft: '-10px',
    marginTop: '-3px',
  },
  // END

  routeDataTableCategoryTrack: {
    display: 'inline-block',
    verticalAlign: 'middle',
  },

  // NOT USED
  routeDataTableCategoryTrackWrap: {
    display: 'inline-flex',
    position: 'relative',
  },
  routeDataTableCategoryTrackInfo: {
    cursor: 'pointer',
  },
  // END

  routeDataTableCategoryTrackColor: {
    display: 'inline-block',
    width: '60px',
    height: '20px',
    verticalAlign: 'middle',
    marginLeft: '15px',
  },

  // NOT USED
  routeDataTableCategoryTrackColor5c: {
    backgroundColor: '#E24D4D',
  },
  // END

  routeDataTableLink: {
    color: '#006CEB',
    textDecoration: 'none',
    cursor: 'pointer',
    '@media screen and (max-width: 1440px)': {
      whiteSpace: 'nowrap',
    },
    ':hover': {
      textDecoration: 'underline',
    },
  },
});

RouteDataTable.propTypes = {
  user: PropTypes.object,
  route: PropTypes.object.isRequired,
};

export default RouteDataTable;
