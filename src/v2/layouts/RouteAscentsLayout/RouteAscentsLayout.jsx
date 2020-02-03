import React from 'react';
import * as R from 'ramda';
import { StyleSheet, css } from '../../aphrodite';
import CategoryPicker from '@/v2/components/CategoryPicker/CategoryPicker';
import TryptichButtons from '@/v2/components/TriptychButtons/TriptychButtons';


const RouteAscentsLayout = ({
  title,
  blameCategory,
  categoryOpinion,
  onCategoryOpinionChanged,
  details,
  withFlash,
  onAddButtonClicked: onAddAscent,
  onRemoveAscent,
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
              name: 'Пролез',
              onClick() {
                onAddAscent && onAddAscent('success');
              },
            },
            {
              icon: require('./assets/attempt-black.svg'),
              name: 'Попытка',
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
        <table className={css(style.table)}>
          <thead>
            <tr>
              <th style={{width: "10%", textAlign: 'left'}}>№</th>
              <th style={{width: "25%"}}>Статус</th>
              <th style={{width: "45%", textAlign: 'left'}}>Дата</th>
              <th style={{width: "20%"}} />
            </tr>
          </thead>
          <tbody>
            {
              ascents && R.addIndex(R.map)(
                (ascent, i) => (
                  <tr key={ascent.id || i}>
                    <td style={{width: "10%"}}>{i + 1}</td>
                    <td style={{width: "25%", textAlign: 'center'}}>
                      <img
                        src={
                          ascent.success ? (
                            require('./assets/success_indicator.svg')
                          ) : (
                            require('./assets/fail_indicator.svg')
                          )
                        }
                      />
                    </td>
                    <td style={{width: "45%"}}>{ascent.accomplished_at}</td>
                    <td
                      style={{width: "20%", textAlign: 'right' }}
                    >
                      <img
                        style={{ cursor: 'pointer' }}
                        onClick={
                          () => {
                            onRemoveAscent && onRemoveAscent(ascent.id);
                          }
                        }
                        src={require('./assets/remove.svg')}
                      />
                    </td>
                  </tr>
                ),
              )(ascents)
            }
          </tbody>
        </table>
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
  table: {
    width: '100%',
  },
});

export default RouteAscentsLayout;
