import React from 'react';
import { StyleSheet, css } from '../../aphrodite';
import CategoryPicker from '@/v2/components/CategoryPicker/CategoryPicker';
import TryptichButtons from '@/v2/components/TriptychButtons/TriptychButtons';
import RouteAscentsTable from './RouteAscentsTable/RouteAscentsTable';


const RouteAscentsLayout = ({
  title,
  blameCategory,
  categoryOpinion,
  onCategoryOpinionChanged,
  details,
  withFlash,
  onAddButtonClicked: onAddAscent,
  onRemoveAscent,
  onAscentDateChanged,
  ascents,
}) => (
  <div className={css(style.container)}>
    <div className={css(style.titleRow)}>{title}</div>
    <div className={css(style.tryptichRow)}>
      <TryptichButtons
        buttons={
          withFlash ? [
            {
              icon: require('./assets/red_point-black.svg'),
              name: 'Red point',
              onClick() {
                onAddAscent && onAddAscent('red_point');
              },
            },
            {
              default: true,
              icon: require('./assets/flash-white.svg'),
              name: 'Flash',
              onClick() {
                onAddAscent && onAddAscent('flash');
              },
            },
            {
              icon: require('./assets/attempt-black.svg'),
              name: 'Попытка',
              onClick() {
                onAddAscent && onAddAscent('attempt');
              },
            },
          ] : [
            {
              default: true,
              icon: require('./assets/success.svg'),
              name: '+1 пролaз',
              onClick() {
                onAddAscent && onAddAscent('success');
              },
            },
            {
              icon: require('./assets/attempt-black.svg'),
              name: '+1 попытка',
              onClick() {
                onAddAscent && onAddAscent('attempt');
              },
            },
          ]
        }
      />
    </div>
    {
      ascents && ascents.length > 0 && details && details.show && (
        <div
          className={css( style.expander, details && details.expanded && style.expanderActivated)}
          onClick={
            () => {
              if (details && typeof details.onExpand === 'function') {
                details.onExpand();
              }
            }
          }
        >
          Подробнее <img src={require('./assets/expander_flag.svg')} />
        </div>
      )
    }
    {
      details && details.expanded && ascents && ascents.length > 0 && (
        <RouteAscentsTable
          ascents={ascents}
          onAscentDateChanged={
            (ascentId, newDate) => {
              onAscentDateChanged && onAscentDateChanged(ascentId, newDate);
            }
          }
          onRemoveAscent={
            (ascentId) => {
              onRemoveAscent && onRemoveAscent(ascentId);
            }
          }
        />
      )
    }
    <div className={css(style.categoryBlameRow)}>
    {
      blameCategory
        ? <>
          {'Моя оценка: '}
          <CategoryPicker
            category={categoryOpinion}
            changeCategory={
              category => onCategoryOpinionChanged(category)
            }
          />
        </>
        : 'Не согласен с категорией!'
    }
    </div>
  </div>
);

const style = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    padding: '20px',
    boxSizing: 'border-box',
  },
  titleRow: {
    fontFamily: 'GilroyBold, sans-serif',
    fontSize: '24px',
    marginBottom: '20px',
  },
  tryptichRow: {
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
    marginBottom: '16px',
  },
  categoryBlameRow: {
    color: '#006CEB',

    ':hover': {
      cursor: 'pointer',
      color: '#005eb9',
      backgroundColor: 'rgba(0,0,0,0.02)',
    },
  },
  expander: {
    color: '#919191',
    textAlign: 'center',
    cursor: 'pointer',
    marginBottom: '12px',

    '> img': {
      verticalAlign: 'middle',
      transform: 'rotate(180deg)',
    },

    ':hover': {
      color: '#878787',
    },
    ':active': {
      color: '#787878',
    },
  },
  expanderActivated: {
    '> img': {
      transform: 'rotate(0deg)',
    },
  },
  detailsContainer: {
    width: '100%',
    maxHeight: '400px',
    overflowY: 'scroll',
    marginBottom: '16px',
  },
  table: {
    width: '100%',
    borderSpacing: 0,

    '> tbody': {
      '> tr': {
        height: '40px',
        lineHeight: '40px',

        '> td': {
          '> img': {
            verticalAlign: 'middle',
          },
        },
        '> td:first-child': {
          paddingLeft: '10px',
        },
        '> td:last-child': {
          paddingRight: '10px',
        },
      },

      '> tr:nth-child(even)': {
        backgroundColor: '#EDEDED',
      },
    },
  },
  tableHeader: {
    width: '100%',
    borderSpacing: 0,

    '> thead': {
      '> tr': {
        height: '40px',
        lineHeight: '40px',

        '> th:first-child': {
          paddingLeft: '10px',
        },
        '> th:last-child': {
          paddingRight: '10px',
        },
      },
    },
  },
});

export default RouteAscentsLayout;
